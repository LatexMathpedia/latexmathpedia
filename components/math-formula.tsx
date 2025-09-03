import katex from "katex";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface MathFormulaProps {
  formula: string;
  displayMode?: boolean;
  className?: string;
}

export default function MathFormula({ formula, displayMode = false, className }: MathFormulaProps) {
  const htmlContent = useMemo(() => {
    try {
      return katex.renderToString(formula, {
        displayMode,
        throwOnError: false,
        output: "html",
      });
    } catch (error) {
      console.error("Error rendering LaTeX formula:", error);
      return `<span class="text-destructive">Error de sintaxis LaTeX: ${formula}</span>`;
    }
  }, [formula, displayMode]);

  return (
    <div
      className={cn(
        "math-formula",
        displayMode ? "block my-4 text-center overflow-x-auto" : "inline-block",
        className
      )}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
