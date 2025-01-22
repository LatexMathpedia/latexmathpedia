import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink } from 'lucide-react'

interface AdBannerProps {
  title: string
  description: string
  imageUrl: string
  link: string
}

export function AdBanner({ title, description, imageUrl, link }: AdBannerProps) {
  return (
    <Card className="my-8 overflow-hidden">
      <CardContent className="p-0">
        <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center hover:opacity-90 transition-opacity">
          <img src={imageUrl} alt={title} className="w-1/3 h-32 object-cover" />
          <div className="p-4 flex-1">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              {title}
              <ExternalLink className="ml-2 h-4 w-4 text-gray-500" />
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
          </div>
        </a>
      </CardContent>
    </Card>
  )
}

