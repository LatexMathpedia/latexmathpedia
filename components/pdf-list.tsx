"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Eye } from "lucide-react"
import type { PDF } from "@/types/pdf"
import { API_ROUTES } from "@/lib/api-config"

export function PDFList({ limit }: { limit?: number }) {
  const [pdfs, setPDFs] = useState<PDF[]>([])
  const [filteredPDFs, setFilteredPDFs] = useState<PDF[]>([])
  const [subjects, setSubjects] = useState<string[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedYear, setSelectedYear] = useState<string>("all")

  useEffect(() => {
    const fetchPDFs = async () => {
      try {
        const response = await fetch(API_ROUTES.pdfs)
        const data = await response.json()
        setPDFs(data)
        setFilteredPDFs(data)
      } catch (error) {
        console.error("Error fetching PDFs:", error)
      }
    }

    const fetchSubjects = async () => {
      try {
        const response = await fetch(API_ROUTES.subjects)
        const data = await response.json()
        setSubjects(data.subjects)
      } catch (error) {
        console.error("Error fetching subjects:", error)
      }
    }
    fetchPDFs()
    fetchSubjects()
  }, [])

  useEffect(() => {
    let filtered = pdfs

    // Filter by subject
    if (selectedSubject !== "all") {
      filtered = filtered.filter((pdf) => pdf.subject === selectedSubject)
    }

    // Filter by year
    if (selectedYear !== "all") {
      filtered = filtered.filter((pdf) => pdf.year === Number.parseInt(selectedYear))
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (pdf) =>
          pdf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pdf.subject.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply limit if specified
    if (limit) {
      filtered = filtered.slice(0, limit)
    }

    setFilteredPDFs(filtered)
  }, [selectedSubject, selectedYear, searchTerm, pdfs, limit])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Buscar PDFs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Seleccionar asignatura" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las asignaturas</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Seleccionar año" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los años</SelectItem>
            {[1, 2, 3, 4].map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}º Año
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPDFs.map((pdf) => (
          <Card key={pdf.href} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4 mb-4">
                <FileText className="h-8 w-8 text-blue-500" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{pdf.name}</h3>
                  <p className="text-sm text-gray-500">
                    {pdf.subject} - {pdf.year}º Año
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <Link href={pdf.href} target="_blank" rel="noopener noreferrer">
                  <Button>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver PDF
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {filteredPDFs.length === 0 && (
        <p className="text-center text-gray-500">No se encontraron PDFs que coincidan con los criterios de búsqueda.</p>
      )}
    </div>
  )
}

