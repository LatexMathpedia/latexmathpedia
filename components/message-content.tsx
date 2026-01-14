interface MessageContentProps {
    content: string;
}

export function MessageContent({ content }: MessageContentProps) {
    const renderContent = (text: string) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = text.split(urlRegex);

        return parts.map((part, index) => {
            if (part.match(urlRegex)) {
                return (
                    <a
                        href={part}
                        key={index}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-chart-2 hover:text-chart-3"
                    >
                        {part}
                    </a>
                );
        }
            return <span key={index}>{part}</span>;
        });
    };

    return (
        <p className="text-sm whitespace-pre-wrap wrap-break-word">
            {renderContent(content)}
        </p>
    );
}