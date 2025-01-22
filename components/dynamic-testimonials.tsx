"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type Testimonial = {
  id: number
  name: string
  role: string
  content: string
  avatar: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Ana García",
    role: "Estudiante de Ingeniería",
    content: "Math Texpedia ha sido fundamental en mi éxito académico. Los recursos son de alta calidad y fáciles de entender.",
    avatar: "/placeholder.svg?height=60&width=60"
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    role: "Profesor de Matemáticas",
    content: "Como educador, aprecio la estructura y profundidad del contenido. Es una herramienta valiosa tanto para estudiantes como para profesores.",
    avatar: "/placeholder.svg?height=60&width=60"
  },
  {
    id: 3,
    name: "Laura Martínez",
    role: "Estudiante de Secundaria",
    content: "Gracias a Math Texpedia, he mejorado significativamente mis calificaciones en matemáticas. Los videos explicativos son geniales.",
    avatar: "/placeholder.svg?height=60&width=60"
  },
  {
    id: 4,
    name: "David Sánchez",
    role: "Ingeniero de Software",
    content: "Utilizo Math Texpedia para refrescar conceptos matemáticos que aplico en mi trabajo. Es una excelente herramienta de referencia.",
    avatar: "/placeholder.svg?height=60&width=60"
  }
]

export function DynamicTestimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1)
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextTestimonial = () => {
    setDirection(1)
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setDirection(-1)
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Lo que dicen nuestros usuarios</h2>
        <div className="relative overflow-hidden" style={{ height: '300px' }}>
          <Card className="bg-white dark:bg-gray-700 max-w-4xl mx-auto h-full">
            <CardContent className="p-8 h-full">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentTestimonial}
                  custom={direction}
                  initial={{ opacity: 0, x: direction > 0 ? '100%' : '-100%' }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction > 0 ? '-100%' : '100%' }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute inset-0 flex flex-col md:flex-row items-center justify-center p-8"
                >
                  <Image
                    src={testimonials[currentTestimonial].avatar}
                    alt={testimonials[currentTestimonial].name}
                    width={120}
                    height={120}
                    className="rounded-full mb-4 md:mb-0 md:mr-8 flex-shrink-0 object-cover"
                  />
                  <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <p className="text-lg mb-4 text-gray-700 dark:text-gray-300 italic">"{testimonials[currentTestimonial].content}"</p>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{testimonials[currentTestimonial].name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{testimonials[currentTestimonial].role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10"
            onClick={prevTestimonial}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10"
            onClick={nextTestimonial}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}

