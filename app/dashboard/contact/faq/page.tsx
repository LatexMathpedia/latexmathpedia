"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, GraduationCap, FileText, Users, HelpCircle, Download, Search, Code } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

const faqCategories = [
    {
        category: "General",
        icon: HelpCircle,
        questions: [
            {
                question: "¿Qué es MathTexpedia?",
                answer: "MathTexpedia es una plataforma educativa gratuita que ofrece apuntes de matemáticas de nivel universitario en formato PDF y artículos interactivos. Nuestra misión es democratizar el acceso a material educativo de calidad."
            },
            {
                question: "¿Es realmente gratuito?",
                answer: "Sí, todo el contenido en MathTexpedia es completamente gratuito. Creemos que la educación debe ser accesible para todos."
            },
            {
                question: "¿Necesito crear una cuenta?",
                answer: "No es necesario crear una cuenta para acceder a parte del contenido. Sin embargo, registrarse te permitirá ver los PDFs sin ningún tipo de restricción."
            }
        ]
    },
    {
        category: "Contenido",
        icon: BookOpen,
        questions: [
            {
                question: "¿Qué tipo de contenido ofrecen?",
                answer: "Ofrecemos apuntes de matemáticas universitarias e Ingeniería Informática De Software en formato PDF y artículos interactivos con fórmulas renderizadas en LaTeX. Cubrimos todos los temas principales de ambas carreras universitarias, en particular, de las asignaturas impartidas en la Universidad de Oviedo."
            },
            {
                question: "¿Con qué frecuencia se actualiza el contenido?",
                answer: "Agregamos nuevo contenido regularmente. Nos esforzamos por subir nuevos apuntes y artículos cada vez que sufren actualizaciones para garantizar la calidad del mismo. Puedes seguirnos en nuestras redes sociales para estar al tanto de las novedades."
            },
            {
                question: "¿Puedo usar el contenido para mis estudios o clases?",
                answer: "¡Por supuesto! Todo nuestro contenido está diseñado para ser utilizado libremente con fines educativos. Te animamos a usarlo para estudiar, enseñar o compartir con otros estudiantes."
            },
            {
                question: "¿Los PDFs están en español?",
                answer: "Sí, todo nuestro contenido está en español, enfocado principalmente en estudiantes universitarios de España e Hispanoamérica."
            }
        ]
    },
    {
        category: "Uso de la Plataforma",
        icon: Search,
        questions: [
            {
                question: "¿Cómo busco contenido específico?",
                answer: "Puedes usar la barra de búsqueda en la parte superior de la página o navegar por categorías en la sección de Blog y PDFs. También puedes filtrar por asignatura o tema."
            },
            {
                question: "¿Cómo descargo los PDFs?",
                answer: "No está permitida la descarga directa de los PDFs. Esta medida nos ayuda a mantener la propiedad intelectual y evitar el uso fraudulento del contenido. Sin embargo, puedes ver los PDFs en línea sin restricciones creando una cuenta gratuita."
            },
            {
                question: "¿Puedo acceder desde mi móvil?",
                answer: "Sí, MathTexpedia está completamente optimizado para dispositivos móviles. Puedes acceder desde cualquier smartphone o tablet con una experiencia de usuario adaptada."
            }
        ]
    },
    {
        category: "Contribuciones",
        icon: Users,
        questions: [
            {
                question: "¿Puedo contribuir con mis propios apuntes?",
                answer: "Aún no estamos aceptando contribuciones externas, pero planeamos habilitar esta opción en el futuro si el proyecto crece lo suficiente. No obstante, invitamos a aquellos usuarios interesados a contactarnos para discutir posibles colaboraciones."
            },
            {
                question: "¿Puedo reportar errores en los apuntes?",
                answer: "Sí, por favor. La calidad del contenido es nuestra prioridad. Puedes reportar errores a través de nuestro formulario de contacto o directamente por correo electrónico."
            },
            {
                question: "¿Cómo puedo sugerir nuevos temas o mejoras?",
                answer: "Nos encantaría escuchar tus sugerencias. Puedes enviarnos tus ideas y comentarios a través de nuestra página de contacto. Valoramos mucho la opinión de nuestra comunidad."
            }
        ]
    },
    {
        category: "Técnico",
        icon: Code,
        questions: [
            {
                question: "¿Con qué tecnologías está construida la plataforma?",
                answer: "MathTexpedia está construida con Next.js, React, TypeScript, y Tailwind CSS. Utilizamos Firebase para la autenticación y almacenamiento, y renderizamos las fórmulas matemáticas con KaTeX."
            },
            {
                question: "¿Es el proyecto de código abierto?",
                answer: "Sí, nuestro proyecto es de código abierto y está disponible en GitHub. ¡Las contribuciones son bienvenidas!"
            },
            {
                question: "¿Por qué algunas fórmulas no se muestran correctamente?",
                answer: "Asegúrate de tener una conexión a internet estable y que tu navegador esté actualizado. Si el problema persiste, por favor repórtalo a través de nuestra página de contacto. Es posible que haya errores en el código ya que KaTeX no soporta todas las funciones de LaTeX."
            }
        ]
    }
]

export default function FAQPage() {
    const [openQuestion, setOpenQuestion] = useState<string | null>(null)

    const toggleQuestion = (questionId: string) => {
        setOpenQuestion(openQuestion === questionId ? null : questionId)
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-primary/10 to-background border-b">
                <div className="container mx-auto px-4 py-12 md:py-16">
                    <div className="max-w-3xl mx-auto text-center space-y-4">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Preguntas Frecuentes (FAQ)
                        </h1>
                        <p className="text-base md:text-lg text-muted-foreground">
                            Encuentra respuestas a las preguntas más comunes sobre MathTexpedia
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-5xl">
                {/* FAQ Categories */}
                <div className="space-y-8">
                    {faqCategories.map((category, categoryIndex) => {
                        const Icon = category.icon
                        return (
                            <div key={categoryIndex}>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <Icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <h2 className="text-2xl font-bold">{category.category}</h2>
                                </div>

                                <div className="space-y-4">
                                    {category.questions.map((faq, faqIndex) => {
                                        const questionId = `${categoryIndex}-${faqIndex}`
                                        const isOpen = openQuestion === questionId

                                        return (
                                            <Card key={faqIndex} className="overflow-hidden">
                                                <button
                                                    onClick={() => toggleQuestion(questionId)}
                                                    className="w-full text-left"
                                                >
                                                    <CardHeader className="hover:bg-accent/50 transition-colors">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <CardTitle className="text-lg font-semibold">
                                                                {faq.question}
                                                            </CardTitle>
                                                            <div className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                                                                <svg
                                                                    className="w-5 h-5 text-muted-foreground"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M19 9l-7 7-7-7"
                                                                    />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </CardHeader>
                                                </button>
                                                {isOpen && (
                                                    <CardContent className="pt-0">
                                                        <p className="text-muted-foreground leading-relaxed">
                                                            {faq.answer}
                                                        </p>
                                                    </CardContent>
                                                )}
                                            </Card>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Still have questions? */}
                <div className="mt-16">
                    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                        <CardContent className="py-12 text-center">
                            <h3 className="text-2xl font-bold mb-4">¿Todavía tienes preguntas?</h3>
                            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                                Si no encontraste la respuesta que buscabas, no dudes en contactarnos.
                                Estamos aquí para ayudarte.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button asChild size="lg">
                                    <Link href="/dashboard/contact/contact-us">Contáctanos</Link>
                                </Button>
                                <Button variant="outline" size="lg" asChild>
                                    <Link href="/dashboard/contact/about-us">Sobre Nosotros</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Links */}
                <div className="mt-12 grid md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <GraduationCap className="w-8 h-8 text-primary mb-2" />
                            <CardTitle className="text-lg">Explora PDFs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Descubre nuestra colección de apuntes universitarios
                            </p>
                            <Button variant="link" className="p-0 h-auto" asChild>
                                <Link href="/dashboard">Explorar PDFs →</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <FileText className="w-8 h-8 text-primary mb-2" />
                            <CardTitle className="text-lg">Lee Artículos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Artículos interactivos con fórmulas matemáticas
                            </p>
                            <Button variant="link" className="p-0 h-auto" asChild>
                                <Link href="/dashboard/blog">Leer Artículos →</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <Download className="w-8 h-8 text-primary mb-2" />
                            <CardTitle className="text-lg">Sobre Nosotros</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Conoce más sobre el proyecto MathTexpedia
                            </p>
                            <Button variant="link" className="p-0 h-auto" asChild>
                                <a href="/dashboard/contact/about-us">Leer más →</a>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
