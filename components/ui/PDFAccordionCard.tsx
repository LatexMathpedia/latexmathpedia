"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Trash } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { SubjectUnitPicker } from "@/components/ui/subject-unit-picker"
import { useToast } from "@/hooks/use-toast"
import { useDeletePdf, useUpdatePdf } from "@/hooks/api/use-pdfs"
import type { PDFDto } from "@/lib/api/pdfs"
import { formatDate as formatLastEdited } from "@/lib/utils"

const updatePdfSchema = z
  .object({
    name: z.string().min(1, "El título es obligatorio"),
    // Opcional: sin fichero, el back conserva el contenido actual.
    file: z
      .custom<FileList>()
      .optional()
      .refine(
        (files) => !files?.length || files[0].type === "application/pdf",
        "El fichero debe ser un PDF",
      ),
    description: z.string().optional(),
    subjectId: z.number().nullable(),
    subjectUnitId: z.number().nullable(),
  })
  .refine((data) => data.subjectId != null, {
    message: "Selecciona una asignatura",
    path: ["subjectId"],
  })

type UpdatePdfFormValues = z.infer<typeof updatePdfSchema>

function PDFAccordionCard({ pdf }: { pdf: PDFDto }) {
  const [isOpen, setIsOpen] = useState(false)
  const toast = useToast()
  const updatePdf = useUpdatePdf()
  const deletePdf = useDeletePdf()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePdfFormValues>({
    resolver: zodResolver(updatePdfSchema),
    defaultValues: {
      name: pdf.name ?? "",
      description: pdf.description ?? "",
      subjectId: pdf.subject?.id ?? null,
      subjectUnitId: pdf.subjectUnit?.id ?? null,
    },
  })

  const subjectIdValue = watch("subjectId")
  const subjectUnitIdValue = watch("subjectUnitId")

  const onSubmit = async (values: UpdatePdfFormValues) => {
    if (pdf.id == null) return

    try {
      await updatePdf.mutateAsync({
        pdfId: pdf.id,
        data: {
          name: values.name,
          description: values.description || undefined,
          subjectId: values.subjectId as number,
          subjectUnitId: values.subjectUnitId,
        },
        file: values.file?.[0],
      })
      toast.success("PDF actualizado correctamente.")
      setIsOpen(false)
    } catch (error) {
      toast.error("Error al actualizar el PDF.")
    }
  }

  const handleDelete = async () => {
    if (pdf.id == null) return

    toast.info("Eliminando PDF...")
    try {
      await deletePdf.mutateAsync(pdf.id)
      toast.success("PDF eliminado correctamente.")
    } catch (error) {
      toast.error("Error al eliminar el PDF.")
    }
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border rounded-md mb-4 w-full"
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex-col">
          <div className="flex items-center space-x-3">
            <div className="font-medium">{pdf.name}</div>
            <div className="text-xs text-muted-foreground">
              Última edición: {formatLastEdited(pdf.lastTimeEdited)}
            </div>
          </div>
          {(pdf.subject?.name || pdf.subjectUnit?.name) && (
            <div className="flex mt-1 items-center space-x-2">
              {pdf.subject?.name && (
                <div className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {pdf.subject.name}
                </div>
              )}
              {pdf.subjectUnit?.name && (
                <div className="text-xs bg-secondary/10 text-primary px-2 py-0.5 rounded-full">
                  {pdf.subjectUnit.name}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer"
                disabled={deletePdf.isPending}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar este PDF?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
                <AlertDialogAction className="cursor-pointer" onClick={handleDelete}>
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="cursor-pointer">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>

      <CollapsibleContent>
        <Separator />
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          <div className="grid gap-2">
            <Label htmlFor={`title-${pdf.id}`}>Título del documento</Label>
            <Input id={`title-${pdf.id}`} className="w-full" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor={`pdfFile-${pdf.id}`}>Reemplazar fichero (opcional)</Label>
            <Input
              id={`pdfFile-${pdf.id}`}
              type="file"
              accept="application/pdf"
              className="w-full cursor-pointer"
              {...register("file")}
            />
            {errors.file && <p className="text-sm text-destructive">{errors.file.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor={`description-${pdf.id}`}>Descripción</Label>
            <Input id={`description-${pdf.id}`} className="w-full" {...register("description")} />
          </div>

          <Separator className="my-4" />

          <SubjectUnitPicker
            subjectId={subjectIdValue ?? null}
            subjectUnitId={subjectUnitIdValue ?? null}
            onSubjectChange={(id) => {
              setValue("subjectId", id, { shouldValidate: true })
              setValue("subjectUnitId", null)
            }}
            onSubjectUnitChange={(id) => setValue("subjectUnitId", id)}
          />
          {errors.subjectId && (
            <p className="text-sm text-destructive">{errors.subjectId.message}</p>
          )}

          <div className="flex justify-end space-x-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset()
                setIsOpen(false)
              }}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={isSubmitting || updatePdf.isPending}
            >
              Actualizar PDF
            </Button>
          </div>
        </form>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default PDFAccordionCard
