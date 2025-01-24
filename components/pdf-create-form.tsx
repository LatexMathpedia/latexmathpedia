
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type PDF = {
    name: string,
    subject: string,
    year: number,
    href: string,
}

type PdfFormProps = {
    submitPdf: (e: React.FormEvent) => void
    setNewPDF: (pdf: PDF) => void
    newPDF: PDF
}

export const PdfCreateForm: React.FC<PdfFormProps> = ({ submitPdf, newPDF, setNewPDF, }) => {
    return (
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
    )
}