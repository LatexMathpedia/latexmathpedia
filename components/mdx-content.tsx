import { MDXRemote } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";

interface MDXContentProps {
  source: string;
  className?: string;
  components?: Record<string, React.ComponentType<any>>;
}

export default function MDXContent({ source, className, components = {} }: MDXContentProps) {
  return (
    <div className={cn(
      "prose dark:prose-invert max-w-none",
      // Personalizaciones para fórmulas matemáticas
      "[&_.math-display]:my-6 [&_.math-display]:overflow-x-auto [&_.math]:text-primary",
      // Personalizaciones para títulos
      "[&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mt-20 [&_h2]:mb-10",
      "[&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:mt-14 [&_h3]:mb-6",
      "[&_h4]:text-xl [&_h4]:font-semibold [&_h4]:mt-10 [&_h4]:mb-4",
      "[&_h5]:text-lg [&_h5]:font-semibold [&_h5]:mt-6 [&_h5]:mb-2",
      // Personalizaciones para párrafos y listas
      "[&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:ml-6",
      "[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:ml-6",
      "[&_li]:my-2 [&_li]:ml-2",
      // Clase adicional personalizada
      className
    )}>
      <MDXRemote
        source={source}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkMath, remarkGfm],
            rehypePlugins: [[rehypeKatex, { strict: false }]],
          },
        }}
        components={components}
      />
    </div>
  );
}
