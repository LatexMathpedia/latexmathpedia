import Link from "next/link"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, ChevronLeft } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { API_ROUTES } from "@/lib/api-config"

async function getPDFData(pdfId: string) {
  try {
    const res = await fetch(`${API_ROUTES.pdfs}/${pdfId}`)
    if (!res.ok) {
      throw new Error("Failed to fetch PDF")
    }
    return res.json()
  } catch (error) {
    console.error("Error:", error)
    return null
  }
}

export default async function PDFPage({ params }: { params: { pdfId: string } }) {
  const pdf = await getPDFData(params.pdfId)

  if (!pdf) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f5f5]">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/pdfs">
            <Button>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Volver a la lista de PDFs
            </Button>
          </Link>
        </div>
        <Card className="overflow-hidden">
          <CardHeader className="p-6">
            <CardTitle className="text-2xl font-bold">{pdf.name}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <FileText className="h-8 w-8 text-blue-500" />
              <div>
                <p className="font-semibold">Asignatura: {pdf.subject}</p>
                <p className="text-sm text-gray-500">Curso: {pdf.year}</p>
              </div>
            </div>
            <p className="mb-6">{pdf.description}</p>
            <Link href={pdf.href} target="_blank" rel="noopener noreferrer">
            </Link>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

