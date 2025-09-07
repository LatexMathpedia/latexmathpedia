import { GalleryVerticalEnd, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PasswordEmailSentPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            MathTexpedia
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-primary/10 flex size-12 items-center justify-center rounded-full">
                  <Mail className="size-6 text-primary" />
                </div>
              </div>
              <CardTitle>Correo enviado</CardTitle>
              <CardDescription className="pt-2">
                Hemos enviado un enlace a tu correo electrónico para restablecer tu contraseña.
                Por favor, revisa tu bandeja de entrada y sigue las instrucciones.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <p className="text-sm text-muted-foreground text-center">
                Si no recibes el correo en unos minutos, revisa tu carpeta de spam
                o solicita un nuevo enlace.
              </p>
              <Link href="/auth/login" className="w-full">
                <Button
                  variant="outline"
                  className="w-full"
                >
                  <ArrowLeft className="size-4 mr-1" /> Volver a inicio de sesión
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/logo.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
