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
  return (
    <div className="space-y-6">
      <Card>
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
        {pdfs.map(pdf => (
          <Card key={pdf.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{pdf.title}</h3>
                  <p className="text-sm text-gray-500">{pdf.subject} - {pdf.course}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

