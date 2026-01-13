import { CalendarIcon, FileIcon } from "lucide-react";
import { useAuth } from '@/contexts/auth-context';
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type PDFCardProps = {
    title: string;
    url: string;
    date: string;
    tag?: string;
}

function PDFCard({ title, url, date, tag }: PDFCardProps) {
    const { isAuthenticated } = useAuth();
    const toast = useToast();
    const router = useRouter();

    // Función para procesar el título y separarlo en partes
    const getTitleParts = () => {
        // Primero verificamos si contiene palabras clave especiales como "Completos"
        const specialKeywords = ['Completos', 'completos'];
        let mainPart = '';
        let secondaryPart = '';
        let tertiaryPart = '';

        // Verificar si hay palabras clave especiales
        for (const keyword of specialKeywords) {
            if (title.includes(keyword)) {
                // Extraer el texto antes de la palabra clave como parte principal
                const index = title.indexOf(keyword);
                mainPart = title.substring(0, index).trim();
                secondaryPart = keyword;
                break;
            }
        }

        // Si no hay palabras clave especiales, dividir por guiones
        if (!mainPart) {
            const parts = title.split('-').map(part => part.trim());
            mainPart = parts[0] || '';
            secondaryPart = parts.length > 1 ? parts[1] : '';
            tertiaryPart = parts.length > 2 ? parts.slice(2).join(' - ') : '';
        }

        return {
            main: mainPart,
            secondary: secondaryPart,
            tertiary: tertiaryPart
        };
    };

    const titleParts = getTitleParts();

    const generateBackgroundColor = () => {
        const colors = [
            'bg-blue-100 dark:bg-blue-900',
            'bg-green-100 dark:bg-green-900',
            'bg-purple-100 dark:bg-purple-900',
            'bg-yellow-100 dark:bg-yellow-900',
            'bg-red-100 dark:bg-red-900',
            'bg-indigo-100 dark:bg-indigo-900',
            'bg-pink-100 dark:bg-pink-900',
        ];

        // Usar el tag si está disponible, de lo contrario usar el título
        const textToUse = tag || title;
        const index = textToUse.charCodeAt(0) % colors.length;
        return colors[index];
    };

    function handleClick(e: React.MouseEvent) {
        if (!isAuthenticated) {
            e.preventDefault();
            toast.error("Debes iniciar sesión para acceder a los archivos PDF. Los blogs son de acceso libre.");
            router.push('/auth/login');
        }
    }

    return (
        <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
            <div className={`relative h-36 w-full overflow-hidden grid place-items-center ${generateBackgroundColor()} rounded-t-lg pdf-card-preview`}>
                <div className="flex flex-col items-center justify-center text-center p-4 h-full w-full">
                    <FileIcon className="mb-2 h-6 w-6" />
                    {titleParts.main && (
                        <div className="pdf-title-main text-sm">{titleParts.main}</div>
                    )}
                    {titleParts.secondary && (
                        <div className="pdf-title-secondary text-xs mt-1">{titleParts.secondary}</div>
                    )}
                    {titleParts.tertiary && (
                        <div className="pdf-title-tertiary text-xs mt-1">{titleParts.tertiary}</div>
                    )}
                </div>
            </div>

            <div className="flex flex-1 flex-col p-4">
                <h3 className="mb-2 line-clamp-2 text-base font-medium">{title}</h3>

                <div className="mb-4 flex items-center text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5 mr-4">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        <span className="text-sm">{date}</span>
                    </div>
                </div>

                <div className="mt-auto">
                    {isAuthenticated ? (
                        <Button
                            variant="default"
                            size="sm"
                            className="w-full cursor-pointer"
                            asChild
                        >
                            <a href={url} target="_blank" rel="noopener noreferrer">
                                Ver PDF
                            </a>
                        </Button>
                    ) : (
                        <Button
                            variant="default"
                            size="sm"
                            className="w-full cursor-pointer"
                            onClick={handleClick}
                        >
                            Iniciar sesión para ver PDF
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PDFCard