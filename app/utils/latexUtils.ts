import * as React from "react";
import TeX from "@matejmazur/react-katex";

/**
 * Renders text with LaTeX support
 * @param text - The text to render with LaTeX support
 * @returns React nodes with LaTeX rendered where appropriate
 */
export function renderWithLatex(text: string): React.ReactNode {
  // First, handle the case where LaTeX commands are escaped with double backslashes
  const processedText = text.replace(/\\([\\{}_^])/g, '$1');
  
  // Split by $...$ and render inline math where found
  const parts = processedText.split(/(\$.*?\$)/g);
  return parts.map((part: string, i: number) => {
    if (part.startsWith("$") && part.endsWith("$")) {
      try {
        const mathContent = part.slice(1, -1).trim();
        return React.createElement(TeX, { 
          key: i, 
          math: mathContent 
        });
      } catch (e) {
        console.warn("Error rendering LaTeX:", part, e);
        return React.createElement("span", { 
          key: i, 
          className: "text-red-500" 
        }, part);
      }
    }
    return React.createElement(React.Fragment, { key: i }, part);
  });
}

/**
 * Renders block LaTeX (centered, display mode)
 * @param content - The LaTeX content to render
 * @returns A block-level LaTeX component
 */
export function renderBlockLatex(content: string): React.ReactNode {
  try {
    return React.createElement(TeX, { 
      math: content, 
      block: true 
    });
  } catch (e) {
    console.warn("Error rendering block LaTeX:", content, e);
    return React.createElement("div", { 
      className: "text-red-500" 
    }, content);
  }
}

/**
 * Renders text with LaTeX support, automatically detecting block vs inline math
 * @param text - The text to render with LaTeX support
 * @returns React nodes with LaTeX rendered where appropriate
 */
export function renderTextWithLatex(text: string): React.ReactNode {
  if (text.startsWith('$$') && text.endsWith('$$')) {
    return renderBlockLatex(text.slice(2, -2).trim());
  }
  return renderWithLatex(text);
}
