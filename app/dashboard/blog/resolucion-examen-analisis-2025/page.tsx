"use client";

import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function BlogPostPage() {
  // En un caso real, estos datos vendrían de una API o CMS
  const blogPost = {
    title: "Resolución del examen de Análisis 20/12/2025",
    date: "20/2/2025",
    estimatedReadTime: "5 min",
    tags: ["Análisis", "Matemáticas"],
    author: "Pablo García",
    authorImage: "/image.png",
    content: [
      {
        type: "paragraph",
        content:
          "El examen de Análisis del 20 de diciembre de 2025 presentó varios desafíos interesantes que requerían una comprensión profunda de los conceptos fundamentales. En este artículo, desglosaremos cada problema y proporcionaremos soluciones detalladas.",
      },
      {
        type: "heading",
        level: 2,
        content: "Problema 1: Límites y Continuidad",
      },
      {
        type: "paragraph",
        content:
          "El primer problema pedía demostrar la continuidad de una función definida por partes y encontrar los puntos de discontinuidad. Recordemos que para que una función sea continua en un punto, el límite debe existir y ser igual al valor de la función en ese punto.",
      },
      {
        type: "math",
        content: `f(x) = \\begin{cases} 
          \\frac{x^2 - 1}{x - 1} & \\text{si } x \\neq 1 \\\\
          2 & \\text{si } x = 1
        \\end{cases}`,
      },
      {
        type: "paragraph",
        content:
          "Para resolver este problema, primero evaluamos el límite cuando x tiende a 1:",
      },
      {
        type: "math",
        content: `\\lim_{x \\to 1} \\frac{x^2 - 1}{x - 1} = \\lim_{x \\to 1} \\frac{(x - 1)(x + 1)}{x - 1} = \\lim_{x \\to 1} (x + 1) = 2`,
      },
      {
        type: "paragraph",
        content:
          "Como el límite es igual al valor asignado en x = 1, la función es continua en este punto a pesar de estar definida por partes.",
      },
      {
        type: "heading",
        level: 2,
        content: "Problema 2: Derivación",
      },
      {
        type: "paragraph",
        content:
          "El segundo problema requería calcular la derivada de una función compuesta y aplicar la regla de la cadena correctamente.",
      },
      {
        type: "math",
        content: `h(x) = \\sin(e^{x^2+1})`,
      },
      {
        type: "paragraph",
        content:
          "Aplicamos la regla de la cadena múltiples veces para resolver este problema:",
      },
      {
        type: "math",
        content: `h'(x) = \\cos(e^{x^2+1}) \\cdot e^{x^2+1} \\cdot 2x`,
      },
      {
        type: "paragraph",
        content:
          "Esta derivada puede simplificarse para análisis adicionales, pero la forma presentada muestra claramente la aplicación de la regla de la cadena.",
      },
      {
        type: "heading",
        level: 2,
        content: "Problema 3: Integración",
      },
      {
        type: "paragraph",
        content:
          "El tercer problema consistía en calcular una integral definida usando técnicas de integración por partes.",
      },
      {
        type: "math",
        content: `\\int_{0}^{\\pi} x \\sin(x) \\, dx`,
      },
      {
        type: "paragraph",
        content:
          "Para resolver esta integral, usamos integración por partes con u = x y dv = sin(x) dx:",
      },
      {
        type: "math",
        content: `\\int x \\sin(x) \\, dx = -x \\cos(x) + \\int \\cos(x) \\, dx = -x \\cos(x) + \\sin(x) + C`,
      },
      {
        type: "paragraph",
        content: "Evaluando en los límites 0 y π:",
      },
      {
        type: "math",
        content: `[-\\pi \\cos(\\pi) + \\sin(\\pi)] - [-0 \\cos(0) + \\sin(0)] = -\\pi \\cdot (-1) + 0 - 0 + 0 = \\pi`,
      },
      {
        type: "heading",
        level: 2,
        content: "Consejos para futuros exámenes",
      },
      {
        type: "paragraph",
        content:
          "Basándonos en este examen, recomendamos enfocarse en los siguientes conceptos para preparaciones futuras:",
      },
      {
        type: "list",
        items: [
          "Comprensión profunda de la continuidad y los límites",
          "Dominio de la regla de la cadena para derivadas complejas",
          "Práctica con integración por partes y sustituciones",
          "Análisis de funciones definidas por partes",
          "Aplicación de teoremas fundamentales del cálculo",
        ],
      },
      {
        type: "paragraph",
        content:
          "Esperamos que esta resolución te haya sido útil. Si tienes preguntas específicas sobre alguno de los problemas, no dudes en dejar un comentario.",
      },
    ],
    relatedPosts: [
      {
        title: "Guía completa de integrales impropias",
        link: "guia-integrales-impropias",
      },
      {
        title: "Teorema del valor medio: aplicaciones prácticas",
        link: "teorema-valor-medio-aplicaciones",
      },
      {
        title: "Series de Taylor: fundamentos y ejemplos",
        link: "series-taylor-fundamentos",
      },
    ],
  };

  return (
    <div className="container max-w-3xl mx-auto py-12 px-4 sm:px-6">
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center mb-4 text-muted-foreground"
          asChild
        >
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al dashboard
          </Link>
        </Button>

        <h1 className="text-3xl sm:text-4xl font-bold mb-6">{blogPost.title}</h1>

        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {blogPost.date}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {blogPost.estimatedReadTime} de lectura
          </div>
          <div className="flex flex-wrap gap-1 items-center">
            <Tag className="h-4 w-4 mr-1" />
            {blogPost.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden">
            {/* En una implementación real, aquí iría una imagen */}
          </div>
          <span className="text-sm">{blogPost.author}</span>
        </div>
      </div>

      <Separator className="my-8" />

      <article className="prose prose-slate max-w-none dark:prose-invert">
        {blogPost.content.map((block, index) => {
          switch (block.type) {
            case "paragraph":
              return <p key={index} className="mb-6 leading-7">{block.content}</p>;
            case "heading":
              if (block.level === 2) {
                return <h2 key={index} className="text-2xl font-semibold mt-12 mb-6">{block.content}</h2>;
              }
              return <h3 key={index} className="text-xl font-semibold mt-10 mb-4">{block.content}</h3>;
            case "math":
              // En una implementación real, aquí renderizaríamos KaTeX o MathJax
              return (
                <div key={index} className="my-4 p-4 bg-secondary/20 rounded-md overflow-x-auto">
                  <pre className="font-mono text-sm">{block.content}</pre>
                </div>
              );
            case "list":
              return (
                <ul key={index} className="my-6 list-disc pl-6 space-y-2">
                  {block.items?.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              );
            default:
              return null;
          }
        })}
      </article>

      <Separator className="my-12" />

      <section>
        <h2 className="text-2xl font-semibold mb-6">Artículos relacionados</h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
          {blogPost.relatedPosts.map((post, index) => (
            <Link
              href={`/dashboard/blog/${post.link}`}
              key={index}
              className="p-4 border rounded-lg transition-all hover:border-primary"
            >
              <h3 className="font-medium">{post.title}</h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
