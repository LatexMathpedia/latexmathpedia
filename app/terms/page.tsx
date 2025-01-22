import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Scroll, Shield, Eye, RefreshCw } from 'lucide-react'

export default function TermsPage() {
  const terms = [
    {
      title: "Uso del Sitio",
      content: "El contenido de Math Texpedia es para uso educativo y personal. No está permitido copiar, distribuir o modificar el contenido sin autorización previa.",
      icon: Scroll
    },
    {
      title: "Cuentas de Usuario",
      content: "Eres responsable de mantener la confidencialidad de tu cuenta y contraseña. Notifícanos inmediatamente si sospechas un uso no autorizado de tu cuenta.",
      icon: Shield
    },
    {
      title: "Propiedad Intelectual",
      content: "Todo el contenido publicado en Math Texpedia está protegido por derechos de autor y otras leyes de propiedad intelectual.",
      icon: Eye
    },
    {
      title: "Modificaciones",
      content: "Nos reservamos el derecho de modificar estos términos en cualquier momento. Es tu responsabilidad revisar periódicamente los cambios.",
      icon: RefreshCw
    }
  ]

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-100 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Términos y Condiciones</h1>
        <Card className="bg-white dark:bg-gray-800 shadow-xl mb-8">
          <CardContent className="p-6">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Bienvenido a Math Texpedia. Al acceder y utilizar nuestro sitio web, aceptas cumplir con los siguientes términos y condiciones:
            </p>
          </CardContent>
        </Card>
        <div className="grid gap-8 md:grid-cols-2">
          {terms.map((term, index) => (
            <Card key={index} className="bg-white dark:bg-gray-800 shadow-xl">
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <term.icon className="h-8 w-8 text-blue-500" />
                <CardTitle className="text-xl text-blue-600 dark:text-blue-400">{term.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">{term.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="mt-8 bg-white dark:bg-gray-800 shadow-xl">
          <CardContent className="p-6">
            <p className="text-gray-700 dark:text-gray-300">
              Math Texpedia no se hace responsable de errores u omisiones en el contenido del sitio. El uso del sitio es bajo tu propio riesgo. Al utilizar nuestros servicios, aceptas cumplir con estos términos y condiciones.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

