import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-100 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Contacto</h1>
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-white dark:bg-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600 dark:text-blue-400">Envíanos un mensaje</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" placeholder="Tu nombre" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input id="email" type="email" placeholder="tu@email.com" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="message">Mensaje</Label>
                  <Textarea id="message" placeholder="Tu mensaje aquí" className="mt-1" />
                </div>
                <Button type="submit" className="w-full">Enviar Mensaje</Button>
              </form>
            </CardContent>
          </Card>
          <div className="space-y-8">
            <Card className="bg-white dark:bg-gray-800 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-600 dark:text-blue-400">Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {[
                    { icon: Mail, text: "info@mathtexpedia.com" },
                    { icon: Phone, text: "+1 (123) 456-7890" },
                    { icon: MapPin, text: "123 Calle Matemática, Ciudad Educación, 12345" },
                  ].map(({ icon: Icon, text }, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <Icon className="h-6 w-6 text-blue-500" />
                      <span className="text-gray-700 dark:text-gray-300">{text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-blue-500 text-white shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">¿Tienes alguna pregunta?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Nuestro equipo de soporte está disponible para ayudarte con cualquier duda o consulta que puedas tener.
                </p>
                <p>
                  No dudes en ponerte en contacto con nosotros. ¡Estaremos encantados de ayudarte!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

