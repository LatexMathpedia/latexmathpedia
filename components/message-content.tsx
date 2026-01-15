import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageContentProps {
    content: string;
}

export function MessageContent({ content }: MessageContentProps) {
    const preprocessContent = (text: string): string => {
        const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        
        return text.replace(markdownLinkRegex, (match, linkText, url) => {
            if (linkText.includes('(') || linkText.includes(')')) {
                return `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
            }
            return match;
        });
    };

    return (
        <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // Personaliza los componentes de Markdown
                    a: ({ node, ...props }) => (
                        <a
                            {...props}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-chart-2 hover:text-chart-3 break-all"
                        />
                    ),
                    code: ({ node, inline, className, children, ...props }: any) => {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline ? (
                            <code
                                className={`block bg-muted p-2 rounded my-2 overflow-x-auto ${className}`}
                                {...props}
                            >
                                {children}
                            </code>
                        ) : (
                            <code
                                className="bg-muted px-1 py-0.5 rounded text-xs"
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    },
                    pre: ({ node, ...props }) => (
                        <pre className="bg-muted p-3 rounded-lg overflow-x-auto my-2" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                        <ul className="list-disc list-inside my-2" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                        <ol className="list-decimal list-inside my-2" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                        <li className="ml-2" {...props} />
                    ),
                    p: ({ node, ...props }) => (
                        <p className="mb-2 last:mb-0" {...props} />
                    ),
                    h1: ({ node, ...props }) => (
                        <h1 className="text-lg font-bold mt-4 mb-2" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                        <h2 className="text-base font-bold mt-3 mb-2" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                        <h3 className="text-sm font-bold mt-2 mb-1" {...props} />
                    ),
                }}
            >
                {preprocessContent(content)}
            </ReactMarkdown>
        </div>
    );
}