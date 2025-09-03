import { MDXRemote } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";

interface MDXContentProps {
  source: string;
  className?: string;
}

export default function MDXContent({ source, className }: MDXContentProps) {
  return (
    <div className={cn(
      "prose dark:prose-invert max-w-none",
      // Personalizaciones para fórmulas matemáticas
      "[&_.math-display]:my-6 [&_.math-display]:overflow-x-auto [&_.math]:text-primary",
      // Personalizaciones para títulos
      "[&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-4",
      "[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3",
      // Personalizaciones para párrafos y listas
      "[&_p]:my-4 [&_ul]:my-4 [&_ol]:my-4 [&_li]:my-2",
      // Clase adicional personalizada
      className
    )}>
      <MDXRemote
        source={source}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkMath],
            rehypePlugins: [rehypeKatex],
          },
        }}
      />
    </div>
  );
}
