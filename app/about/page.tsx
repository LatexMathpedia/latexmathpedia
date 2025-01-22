import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Award, Lightbulb } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-100 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Sobre Nosotros</h1>
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-white dark:bg-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600 dark:text-blue-400">Nuestra Misión</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Math Texpedia es una plataforma educativa dedicada a hacer que el aprendizaje de las matemáticas sea accesible, interactivo y emocionante para estudiantes de todos los niveles.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Nuestra misión es proporcionar recursos de alta calidad, desde apuntes detallados hasta videos explicativos, que ayuden a los estudiantes a dominar conceptos matemáticos complejos.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600 dark:text-blue-400">Nuestros Valores</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {[
                  { icon: BookOpen, text: "Educación accesible para todos" },
                  { icon: Users, text: "Comunidad colaborativa de aprendizaje" },
                  { icon: Award, text: "Excelencia académica" },
                  { icon: Lightbulb, text: "Innovación en la enseñanza de matemáticas" },
                ].map(({ icon: Icon, text }, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Icon className="h-6 w-6 text-blue-500" />
                    <span className="text-gray-700 dark:text-gray-300">{text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        <Card className="mt-8 bg-white dark:bg-gray-800 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-600 dark:text-blue-400">Nuestro Equipo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {[
                { name: "Dra. Ana Rodríguez", role: "Fundadora y Directora de Contenido" },
                { name: "Prof. Carlos Méndez", role: "Jefe de Desarrollo Curricular" },
                { name: "Ing. Laura Sánchez", role: "Directora de Tecnología" },
                { name: "Lic. Miguel Torres", role: "Coordinador de Comunidad y Soporte Estudiantil" },
              ].map(({ name, role }, index) => (
                <div key={index} className="p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-semibold text-lg text-blue-600 dark:text-blue-400">{name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{role}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

