"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const courses = [
  {
    title: "Introducción al Cálculo",
    description: "Aprende los fundamentos del cálculo diferencial e integral",
    level: "Principiante",
    duration: "8 semanas",
    rating: 4.8
  },
  {
    title: "Álgebra Lineal Avanzada",
    description: "Explora conceptos avanzados de álgebra lineal y sus aplicaciones",
    level: "Avanzado",
    duration: "10 semanas",
    rating: 4.9
  },
  {
    title: "Estadística y Probabilidad",
    description: "Domina los conceptos estadísticos y su aplicación en el análisis de datos",
    level: "Intermedio",
    duration: "6 semanas",
    rating: 4.7
  }
]

export function CourseOfTheDay() {
  const [currentCourse, setCurrentCourse] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCourse((prev) => (prev + 1) % courses.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-16 bg-gradient-to-r from-blue-500 to-blue-600">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Curso del Día
        </h2>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCourse}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-2">
                  {courses[currentCourse].title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {courses[currentCourse].description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">{courses[currentCourse].level}</Badge>
                  <Badge variant="secondary">{courses[currentCourse].duration}</Badge>
                  <Badge variant="secondary">⭐ {courses[currentCourse].rating}</Badge>
                </div>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                  Más Información
                </button>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

