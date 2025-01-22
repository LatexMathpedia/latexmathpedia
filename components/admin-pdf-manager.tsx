"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Pencil, Trash, Eye, EyeOff } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination"
import { API_ROUTES } from '@/lib/api-config'

type PDF = {
  id: string
  title: string
  subject: string
  course: string
  driveLink: string
  isVisible: boolean
}

const ITEMS_PER_PAGE = 10

export function AdminPDFManager() {
  const [pdfs, setPdfs] = useState<PDF[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newPDF, setNewPDF] = useState<Omit<PDF, 'id'>>({ title: '', subject: '', course: '', driveLink: '', isVisible: true })
  const [selectedCourse, setSelectedCourse] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)

  useEffect(() => {
    fetch(API_ROUTES.pdfs)
      .then(res => res.json())
      .then(data => setPdfs(data))
  }, [])

  const handleEdit = (id: string) => {
    setEditingId(id)
    const pdfToEdit = pdfs.find(pdf => pdf.id === id)
    if (pdfToEdit) {
      setNewPDF(pdfToEdit)
    }
  }

  const handleDelete = (id: string) => {
    setPdfs(pdfs.filter(pdf => pdf.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      setPdfs(pdfs.map(pdf => pdf.id === editingId ? { ...newPDF, id: editingId } : pdf))
      setEditingId(null)
    } else {
      setPdfs([...pdfs, { ...newPDF, id: Date.now().toString() }])
    }
    setNewPDF({ title: '', subject: '', course: '', driveLink: '', isVisible: true })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPDF({ ...newPDF, [e.target.name]: e.target.value })
  }

  const handleToggleVisibility = (id: string) => {
    setPdfs(pdfs.map(pdf => pdf.id === id ? { ...pdf, isVisible: !pdf.isVisible } : pdf))
  }

  const filteredPDFs = pdfs
    .filter(pdf => selectedCourse === 'all' || pdf.course === selectedCourse)
    .filter(pdf => pdf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pdf.subject.toLowerCase().includes(searchTerm.toLowerCase()))

  const paginatedPDFs = filteredPDFs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const totalPages = Math.ceil(filteredPDFs.length / ITEMS_PER_PAGE)

  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">{editingId ? 'Editar PDF' : 'Añadir nuevo PDF'}</h2>
            <div>
              <Label htmlFor="title">Título</Label>
              <Input id="title" name="title" value={newPDF.title} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="subject">Asignatura</Label>
              <Input id="subject" name="subject" value={newPDF.subject} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="course">Curso</Label>
              <Input id="course" name="course" value={newPDF.course} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="driveLink">Enlace de Drive</Label>
              <Input id="driveLink" name="driveLink" value={newPDF.driveLink} onChange={handleChange} required />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isVisible"
                checked={newPDF.isVisible}
                onCheckedChange={(checked: boolean) => setNewPDF({ ...newPDF, isVisible: checked })}
              />
              <Label htmlFor="isVisible">PDF visible</Label>
            </div>
            <Button type="submit">{editingId ? 'Actualizar PDF' : 'Añadir PDF'}</Button>
          </form>
        </CardContent>
      </Card>

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
              <SelectItem value="Primer Año">Primer Año</SelectItem>
              <SelectItem value="Segundo Año">Segundo Año</SelectItem>
              <SelectItem value="Tercer Año">Tercer Año</SelectItem>
              <SelectItem value="Cuarto Año">Cuarto Año</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {paginatedPDFs.map(pdf => (
          <Card key={pdf.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{pdf.title}</h3>
                  <p className="text-sm text-gray-500">{pdf.subject} - {pdf.course}</p>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => handleToggleVisibility(pdf.id)}>
                    {pdf.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button onClick={() => handleEdit(pdf.id)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => handleDelete(pdf.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                size="sm"
                onClick={() => setCurrentPage(page)}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            {currentPage < totalPages && (
              <PaginationNext
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              />
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

