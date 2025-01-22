import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PDFList } from "@/components/pdf-list"

export default function PDFsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f5f5f5]">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Recursos PDF</h1>
        <PDFList />
      </main>
      <Footer />
    </div>
  )
}

