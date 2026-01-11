"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Target, Heart, Github, Linkedin, Mail } from "lucide-react"
import { Link as LinkIcon } from "lucide-react"
import Link from "next/link"

export default function AboutUsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/10 to-background border-b">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Sobre MathTexpedia
            </h1>
            <p className="text-base md:text-lg text-muted-foreground">
              Una plataforma educativa creada por estudiantes, para estudiantes
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Misión Section */}
        <section className="mb-16">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <BookOpen className="w-8 h-8 mb-2 text-primary" />
                <CardTitle className="text-xl md:text-2xl">Educación Accesible</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm md:text-base">
                  Recursos de calidad disponibles para todos los estudiantes de matemáticas e informática.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Target className="w-8 h-8 mb-2 text-primary" />
                <CardTitle className="text-xl md:text-2xl">Contenido Claro</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm md:text-base">
                  Apuntes y explicaciones diseñados para facilitar el aprendizaje y la comprensión.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-8 h-8 mb-2 text-primary" />
                <CardTitle className="text-xl md:text-2xl">Comunidad</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm md:text-base">
                  Construida por y para estudiantes de la Universidad de Oviedo.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Nuestra Historia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground text-sm md:text-base">
              <p>
                MathTexpedia nació de la necesidad de centralizar y compartir apuntes de calidad entre estudiantes. 
                Como estudiantes de la Universidad de Oviedo, nos dimos cuenta de que muchos recursos valiosos 
                estaban dispersos o eran difíciles de encontrar.
              </p>
              <p>
                Decidimos crear una plataforma donde los apuntes, resúmenes y materiales de estudio pudieran 
                estar organizados, accesibles y disponibles para toda la comunidad estudiantil. Lo que comenzó 
                como un proyecto personal se ha convertido en un recurso utilizado por estudiantes de diferentes carreras.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Nuestro Equipo</h2>
            <p className="text-muted-foreground">
              Los creadores detrás de MathTexpedia
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Diego */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl md:text-2xl">Diego Díaz Mendaña</CardTitle>
                    <CardDescription className="text-base mt-2">Co-fundador & Desarrollador</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm md:text-base">
                  Estudiante de PCEO de Ingeniería Informática y Matemáticas en la Universidad de Oviedo. Apasionado por el desarrollo web y la creación de herramientas que faciliten el aprendizaje.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="secondary">Next.js</Badge>
                  <Badge variant="secondary">TypeScript</Badge>
                  <Badge variant="secondary">Python</Badge>
                </div>
                <div className="flex gap-3 pt-2">
                  <a 
                    href="https://github.com/Mendana" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-accent transition-colors"
                    aria-label="GitHub de Diego"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a 
                    href="https://diego-diaz-mendana.web.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-accent transition-colors"
                    aria-label="Sitio web de Diego"
                  >
                    <LinkIcon className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/diego-d%C3%ADaz-menda%C3%B1a/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-accent transition-colors"
                    aria-label="LinkedIn de Diego"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Pablo */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">Pablo García Pernas</CardTitle>
                    <CardDescription className="text-base mt-2">Co-fundador & Desarrollador</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm md:text-base">
                  Estudiante de PCEO de Ingeniería Informática y Matemáticas en la Universidad de Oviedo. Enfocado en el desarrollo backend y la arquitectura de sistemas para crear plataformas escalables.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Node.js</Badge>
                  <Badge variant="secondary">Bases de Datos</Badge>
                  <Badge variant="secondary">APIs</Badge>
                  <Badge variant="secondary">DevOps</Badge>
                </div>
                <div className="flex gap-3 pt-2">
                  <a 
                    href="https://github.com/PabloGarPe" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-accent transition-colors"
                    aria-label="GitHub de Pablo"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/pablo-garc%C3%ADa-pernas-873630352/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-accent transition-colors"
                    aria-label="LinkedIn de Pablo"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="text-center py-12 px-6">
              <Heart className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-bold mb-3">¿Quieres contribuir?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                MathTexpedia es un proyecto de código abierto. Si tienes ideas, sugerencias o quieres 
                contribuir, ¡nos encantaría escucharte!
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link 
                  href="/dashboard/contact/contact-us"
                  className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contáctanos
                </Link>
                <a 
                  href="https://github.com/LatexMathpedia/latexmathpedia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors font-medium"
                >
                  <Github className="w-4 h-4 mr-2" />
                  Ver en GitHub
                </a>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
