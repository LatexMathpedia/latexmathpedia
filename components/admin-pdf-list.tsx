"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Pencil, Trash } from 'lucide-react'
import { AdminPDFForm } from "@/components/admin-pdf-form"

type PDF = {
  id: string
  title: string
  subject: string
  course: string
  driveLink: string
}

export function AdminPDFList() {
  const [pdfs, setPdfs] = useState<PDF[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    // Aquí normalmente harías una llamada a la API para obtener los PDFs
    // Por ahora, usaremos datos de ejemplo
    setPdfs([
      { id: '1', title: 'Introducción al Cálculo', subject: 'Análisis', course: 'Primer Año', driveLink: 'https://drive.google.com/file/d/example1' },
      { id: '2', title: 'Álgebra Lineal', subject: 'Álgebra', course: 'Segundo Año', driveLink: 'https://drive.google.com/file/d/example2' },
    ])
  }, [])

  const handleEdit = (id: string) => {
    setEditingId(id)
  }

  const handleDelete = (id: string) => {
    // Aquí normalmente harías una llamada a la API para eliminar el PDF
    setPdfs(pdfs.filter(pdf => pdf.id !== id))
  }

  const handleUpdatePDF = (updatedPDF: PDF) => {
    setPdfs(pdfs.map(pdf => pdf.id === updatedPDF.id ? updatedPDF : pdf))
    setEditingId(null)
  }

  return (
    <div className="space-y-4">
      {pdfs.map(pdf => (
        <Card key={pdf.id}>
          <CardContent className="p-4">
            {editingId === pdf.id ? (
              <AdminPDFForm pdf={pdf} onComplete={handleUpdatePDF} />
            ) : (
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{pdf.title}</h3>
                  <p className="text-sm text-gray-500">{pdf.subject} - {pdf.course}</p>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => handleEdit(pdf.id)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => handleDelete(pdf.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

