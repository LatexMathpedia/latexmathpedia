import katex from "katex";
import "katex/dist/katex.min.css";

interface EjBoxProps {
  title: string;
  children: React.ReactNode;
}

function renderLatexInTitle(text: string): string {
  // Reemplazar fórmulas inline $...$ con versión renderizada
  return text.replace(/\$([^$]+)\$/g, (_, formula) => {
    try {
      return katex.renderToString(formula, {
        displayMode: false,
        throwOnError: false,
        output: "html",
      });
    } catch (error) {
      return `$${formula}$`;
    }
  });
}

export function EjBox({ title, children }: EjBoxProps) {
  const renderedTitle = renderLatexInTitle(title);
  
  return (
    <div className="border-l-4 border-green-500 bg-green-50 dark:bg-green-950/30 p-6 my-6 rounded-r-lg">
      <h4 className="font-bold text-green-800 dark:text-green-300 mb-3 flex items-center gap-2">
        <span className="text-xl">💡</span>
        <span dangerouslySetInnerHTML={{ __html: renderedTitle }} />
      </h4>
      <div className="text-gray-700 dark:text-gray-300 prose prose-sm max-w-none">
        {children}
      </div>
    </div>
  );
}