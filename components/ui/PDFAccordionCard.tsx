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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { SubjectUnitPicker } from "@/components/ui/subject-unit-picker"
import { useToast } from "@/hooks/use-toast"
import { useDeletePdf, useUpdatePdf } from "@/hooks/api/use-pdfs"
import type { PDFDto } from "@/lib/api/pdfs"

const updatePdfSchema = z
  .object({
    name: z.string().min(1, "El título es obligatorio"),
    link: z.string().min(1, "El enlace es obligatorio").url("Debe ser una URL válida"),
    description: z.string().optional(),
    subjectId: z.number().nullable(),
    subjectUnitId: z.number().nullable(),
  })
  .refine((data) => data.subjectId != null, {
    message: "Selecciona una asignatura",
    path: ["subjectId"],
  })

type UpdatePdfFormValues = z.infer<typeof updatePdfSchema>

function formatLastEdited(iso?: string) {
  if (!iso) return "-"
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
}

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
      link: pdf.link ?? "",
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
        body: {
          name: values.name,
          link: values.link,
          description: values.description || undefined,
          subjectId: values.subjectId as number,
          subjectUnitId: values.subjectUnitId,
        },
      })
      toast.success("PDF actualizado correctamente.")
      setIsOpen(false)
    } catch (error) {
      toast.error("Error al actualizar el PDF.")
    }
  }

  const handleDelete = async () => {
    if (!pdf.name) return

    toast.info("Eliminando PDF...")
    try {
      await deletePdf.mutateAsync(pdf.name)
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
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="cursor-pointer"
            disabled={deletePdf.isPending}
          >
            <Trash className="h-4 w-4" />
          </Button>
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
            <Label htmlFor={`pdfUrl-${pdf.id}`}>Enlace al PDF</Label>
            <Input id={`pdfUrl-${pdf.id}`} className="w-full" {...register("link")} />
            {errors.link && <p className="text-sm text-destructive">{errors.link.message}</p>}
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
