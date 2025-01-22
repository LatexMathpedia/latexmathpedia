import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Footer } from "@/components/footer"
import { PDFList } from "@/components/pdf-list"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f5f5f5] dark:bg-gray-900">
      <Header />
      <Hero />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">PDFs Recientes</h2>
          <Link href="/pdfs">
            <Button>Ver todos los PDFs</Button>
          </Link>
        </div>
        <PDFList limit={6} />
      </main>
      <Footer />
    </div>
  )
}

