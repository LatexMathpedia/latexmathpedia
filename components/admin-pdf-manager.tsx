"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { API_ROUTES } from '@/lib/api-config'

type PDF = {
  name: string,
  subject: string,
  year: number,
  href: string,
}

const ITEMS_PER_PAGE = 10

export function AdminPDFManager() {
  const [pdfs, setPdfs] = useState<PDF[]>([])
  const [editingPDF, setEditingPDF] = useState<PDF>({ name: '', subject: '', year: 0, href: '' })
  const [filteredPDFs, setFilteredPDFs] = useState<PDF[]>([])
  const [newPDF, setNewPDF] = useState<Omit<PDF, 'id'>>({ name: '', subject: '', year: 0, href: '' })
  const [selectedCourse, setSelectedCourse] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [currentPdf, setCurrentPdf] = useState<PDF | null>(null)

  const submitPdf = async (e: React.FormEvent) => {
    e.preventDefault()
    const r = await fetch(API_ROUTES.create, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPDF)
    })
    if (!r.ok)
      alert('Error al crear el PDF')
    setPdfs([...pdfs, newPDF])
    setNewPDF({ name: '', subject: '', year: 0, href: '' })
  }

  const editPdf = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPdf) return;

    try {
      const response = await fetch(`${API_ROUTES.pdfs}/${currentPdf.name}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingPDF),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const updatedPDF = await response.json();
      setPdfs(pdfs.map(pdf => (pdf.name === currentPdf.name ? updatedPDF : pdf)));
      setCurrentPdf(null);
      setEditingPDF({ name: '', subject: '', year: 0, href: '' });
      alert('PDF actualizado');
    } catch (error) {
      console.error('Error editing PDF:', error);
    }
  }

  useEffect(() => {
    fetch(API_ROUTES.pdfs)
      .then(res => res.json())
      .then(data => setPdfs(data))
  }, [])

  useEffect(() => {
    let filtered = pdfs

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(pdf => pdf.name.toLowerCase().includes(searchTerm.toLowerCase()) || pdf.subject.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Filter by course
    if (selectedCourse !== 'all') {
      filtered = filtered.filter(pdf => pdf.year === parseInt(selectedCourse))
    }

    setFilteredPDFs(filtered)
  }, [pdfs, searchTerm, selectedCourse])

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <form className="space-y-4" onSubmit={submitPdf}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre del PDF</Label>
                <Input
                  id="name"
                  value={newPDF.name}
                  onChange={(e) => setNewPDF({ ...newPDF, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="subject">Asignatura</Label>
                <Input
                  id="subject"
                  value={newPDF.subject}
                  onChange={(e) => setNewPDF({ ...newPDF, subject: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="year">Curso</Label>
                <Input
                  id="year"
                  value={newPDF.year}
                  type='number'
                  onChange={(e) => setNewPDF({ ...newPDF, year: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="href">Link de Google Drive</Label>
                <Input
                  id="href"
                  value={newPDF.href}
                  onChange={(e) => setNewPDF({ ...newPDF, href: e.target.value })}
                />
              </div>
            </div>
            <Button type="submit">Agregar PDF</Button>
          </form>
        </CardContent>
      </Card>
      { }
      <div className="flex space-x-4">
        <div className="flex-1">
          <Label htmlFor="search">Buscar PDFs</Label>
          <Input
            id="search"
            placeholder="Buscar por título o asignatura"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="courseFilter">Filtrar por curso</Label>
          <Select onValueChange={setSelectedCourse} value={selectedCourse}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un curso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los cursos</SelectItem>
              <SelectItem value="1">Primer Año</SelectItem>
              <SelectItem value="2">Segundo Año</SelectItem>
              <SelectItem value="3">Tercer Año</SelectItem>
              <SelectItem value="4">Cuarto Año</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredPDFs.map(pdf => (
          <div key={pdf.name + "div"}>
            <Card key={pdf.name}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{pdf.name}</h3>
                    <p className="text-sm text-gray-500">{pdf.subject} - {pdf.year}</p>
                  </div>
                  <div className="flex space-x-4 items-center text-gray-500">
                    <Button className="bg-blue-500 text-white" onClick={() => {
                      setCurrentPdf(pdf)
                      setEditingPDF(pdf)
                    }}>Editar</Button>
                    <Button className="bg-red-500 text-white" onClick={async (e) => {
                      e.preventDefault()
                      const r = await fetch(API_ROUTES.delete + pdf.name, {
                        method: 'DELETE',
                        headers: {
                          'Content-Type': 'application/json'
                        }
                      })
                      if (!r.ok) {
                        alert('Error al eliminar el PDF')
                        return
                      }
                      setPdfs(pdfs.filter(p => p.name !== pdf.name))
                      alert('PDF eliminado')
                    }}>Eliminar</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            {currentPdf && currentPdf.name === pdf.name && (
              <Card key={pdf.name + "editing"} >
                <CardContent className="p-4 space-y-4 justify-center items-center">
                  <form onSubmit={editPdf} className="space-y-4 flex flex-col items-left">
                    <Input
                      placeholder="Nombre del PDF"
                      value={editingPDF.name}
                      onChange={(e) => setEditingPDF({ ...editingPDF, name: e.target.value })}
                    />
                    <Input
                      placeholder="Asignatura"
                      value={editingPDF.subject}
                      onChange={(e) => setEditingPDF({ ...editingPDF, subject: e.target.value })}
                    />
                    <Input
                      placeholder="Año"
                      type="number"
                      value={editingPDF.year}
                      onChange={(e) => setEditingPDF({ ...editingPDF, year: parseInt(e.target.value) })}
                    />
                    <Input
                      placeholder="URL del PDF"
                      value={editingPDF.href}
                      onChange={(e) => setEditingPDF({ ...editingPDF, href: e.target.value })}
                    />
                    <Button type="submit">Guardar cambios</Button>
                    <Button type="button" className="bg-red-500" onClick={() => {
                      setCurrentPdf(null)
                      setEditingPDF({ name: '', subject: '', year: 0, href: '' })
                    }}>Cancelar</Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

