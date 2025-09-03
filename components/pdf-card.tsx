import Image from "next/image";
import Link from "next/link";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type PDFCardProps = {
    title: string;
    url: string;
    date: string;
    img: string;
}

function PDFCard({ title, url, date, img }: PDFCardProps) {
    const defaultImage = "/image.png";

    return (
        <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
            <div className="relative h-36 w-full overflow-hidden">
                <Image 
                    src={img || defaultImage}
                    alt={`Imagen de ${title}`}
                    fill
                    className="object-cover"
                />
            </div>
            
            <div className="flex flex-1 flex-col p-4">
                <h3 className="mb-2 line-clamp-2 text-lg font-medium">{title}</h3>
                
                <div className="mb-4 flex items-center text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5 mr-4">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        <span>{date}</span>
                    </div>
                </div>
                
                <div className="mt-auto">
                    <Button 
                        variant="default" 
                        size="sm" 
                        className="w-full"
                        asChild
                    >
                        <Link href={url}>
                            Ver PDF
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default PDFCard