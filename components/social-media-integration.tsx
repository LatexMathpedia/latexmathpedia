import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export function SocialMediaIntegration() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Síguenos en Redes Sociales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: "Facebook", icon: Facebook, color: "bg-blue-600", url: "https://facebook.com/mathtexpedia" },
            { name: "Twitter", icon: Twitter, color: "bg-blue-400", url: "https://twitter.com/mathtexpedia" },
            { name: "Instagram", icon: Instagram, color: "bg-pink-600", url: "https://instagram.com/mathtexpedia" },
            { name: "LinkedIn", icon: Linkedin, color: "bg-blue-700", url: "https://linkedin.com/company/mathtexpedia" },
          ].map((social) => (
            <Card key={social.name} className="overflow-hidden">
              <CardHeader className={`${social.color} text-white`}>
                <CardTitle className="flex items-center justify-center">
                  <social.icon className="h-8 w-8 mr-2" />
                  {social.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <Button asChild className="w-full">
                  <a href={social.url} target="_blank" rel="noopener noreferrer">
                    Seguir en {social.name}
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

