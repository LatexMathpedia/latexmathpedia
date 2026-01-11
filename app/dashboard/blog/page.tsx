import fs from "fs"
import path from "path"
import matter from "gray-matter"
import BlogCard from "@/components/blog-card"

export default function BlogIndex() {
  const postsDir = path.join(process.cwd(), "content/posts")
  const filenames = fs.readdirSync(postsDir)

  const posts = filenames.map((file) => {
    const slug = file.replace(/\.mdx?$/, "")
    const filePath = path.join(postsDir, file)
    const fileContent = fs.readFileSync(filePath, "utf-8")
    const { data, content } = matter(fileContent)
    
    // Calcular tiempo estimado de lectura (promedio 200 palabras/minuto)
    const wordCount = content.split(/\s+/).length
    const estimatedReadTime = `${Math.ceil(wordCount / 80)} min`

    return { 
      slug, 
      title: data.title as string,
      description: (data.description as string) || "",
      date: data.date as string,
      estimatedReadTime,
      tags: (data.tags as string[]) || ["Matemáticas"], // Tags por defecto si no están definidos
    }
  })

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Blog de Matemáticas</h1>
      </div>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {posts.map((post) => (
          <BlogCard 
            key={post.slug}
            title={post.title}
            description={post.description || ""}
            date={post.date}
            estimatedReadTime={post.estimatedReadTime}
            tags={post.tags}
            link={post.slug}
          />
        ))}
      </div>
    </div>
  )
}