"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type PDF = {
  id: string
  title: string
  subject: string
  course: string
  driveLink: string
}

type AdminPDFFormProps = {
  pdf?: PDF
  onComplete: (pdf: PDF) => void
}

export function AdminPDFForm({ pdf, onComplete }: AdminPDFFormProps) {
  const [formData, setFormData] = useState<PDF>({
    id: '',
    title: '',
    subject: '',
    course: '',
    driveLink: '',
  })

  useEffect(() => {
    if (pdf) {
      setFormData(pdf)
    }
  }, [pdf])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí normalmente harías una llamada a la API para añadir o actualizar el PDF
    onComplete({
      ...formData,
      id: formData.id || Date.now().toString(), // Genera un ID si es un nuevo PDF
    })
    // Resetear el formulario si es una adición
    if (!pdf) {
      setFormData({ id: '', title: '', subject: '', course: '', driveLink: '' })
    }
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="subject">Asignatura</Label>
            <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="course">Curso</Label>
            <Input id="course" name="course" value={formData.course} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="driveLink">Enlace de Drive</Label>
            <Input id="driveLink" name="driveLink" value={formData.driveLink} onChange={handleChange} required />
          </div>
          <Button type="submit" className="w-full">{pdf ? 'Actualizar PDF' : 'Añadir PDF'}</Button>
        </form>
      </CardContent>
    </Card>
  )
}

