import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Lock, Share2, UserCheck } from 'lucide-react'

export default function PrivacyPage() {
  const privacyPoints = [
    {
      title: "Información que Recopilamos",
      content: "Recopilamos información que proporcionas al registrarte, como tu nombre, dirección de correo electrónico y datos de perfil. También podemos recopilar información sobre tu uso del sitio.",
      icon: FileText
    },
    {
      title: "Uso de la Información",
      content: "Utilizamos tu información para personalizar tu experiencia, mejorar nuestros servicios y comunicarnos contigo sobre actualizaciones o nuevos recursos.",
      icon: UserCheck
    },
    {
      title: "Protección de Datos",
      content: "Implementamos medidas de seguridad para proteger tu información personal contra acceso no autorizado o alteración.",
      icon: Lock
    },
    {
      title: "Compartir Información",
      content: "No vendemos ni compartimos tu información personal con terceros, excepto cuando sea necesario para proporcionar nuestros servicios o cumplir con requisitos legales.",
      icon: Share2
    }
  ]

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-100 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Política de Privacidad</h1>
        <Card className="bg-white dark:bg-gray-800 shadow-xl mb-8">
          <CardContent className="p-6">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              En Math Texpedia, valoramos y respetamos tu privacidad. Esta política describe cómo recopilamos, usamos y protegemos tu información personal.
            </p>
          </CardContent>
        </Card>
        <div className="grid gap-8 md:grid-cols-2">
          {privacyPoints.map((point, index) => (
            <Card key={index} className="bg-white dark:bg-gray-800 shadow-xl">
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <point.icon className="h-8 w-8 text-blue-500" />
                <CardTitle className="text-xl text-blue-600 dark:text-blue-400">{point.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">{point.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="mt-8 bg-white dark:bg-gray-800 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-600 dark:text-blue-400">Tus Derechos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300">
              Tienes derecho a acceder, corregir o eliminar tu información personal. Si deseas ejercer estos derechos o tienes preguntas sobre nuestra política de privacidad, por favor contáctanos.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

