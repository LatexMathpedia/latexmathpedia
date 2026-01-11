"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, CheckCircle, AlertCircle, Scale, BookOpen, Mail } from "lucide-react"
import Link from "next/link"

export default function TermsOfServicePage() {
  const lastUpdated = "11 de enero de 2026"

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/10 to-background border-b">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <FileText className="w-12 h-12 mx-auto text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Términos de Servicio
            </h1>
            <p className="text-base md:text-lg text-muted-foreground">
              Condiciones de uso de MathTexpedia
            </p>
            <p className="text-sm text-muted-foreground">
              Última actualización: {lastUpdated}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Introduction */}
        <section className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Bienvenido a MathTexpedia. Al acceder y utilizar nuestros servicios, aceptas cumplir con estos 
                Términos de Servicio. Por favor, léelos detenidamente antes de utilizar la plataforma.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Quick Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Puntos Clave</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CheckCircle className="w-6 h-6 mb-2 text-primary" />
                <CardTitle className="text-base">Uso Gratuito</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  El acceso a nuestros recursos educativos es gratuito
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Scale className="w-6 h-6 mb-2 text-primary" />
                <CardTitle className="text-base">Uso Responsable</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Comprométete a usar la plataforma de forma ética y legal
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <BookOpen className="w-6 h-6 mb-2 text-primary" />
                <CardTitle className="text-base">Respeto Intelectual</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Respeta los derechos de autor del contenido publicado
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Detailed Sections */}
        <div className="space-y-8">
          {/* Aceptación de los Términos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">1. Aceptación de los Términos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm md:text-base">
              <p className="text-muted-foreground">
                Al acceder o utilizar MathTexpedia, aceptas estar legalmente vinculado por estos Términos de 
                Servicio. Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar 
                nuestros servicios.
              </p>
              <p className="text-muted-foreground">
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones 
                entrarán en vigor inmediatamente después de su publicación en el sitio. Tu uso continuado del 
                servicio constituye la aceptación de dichas modificaciones.
              </p>
            </CardContent>
          </Card>

          {/* Descripción del Servicio */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">2. Descripción del Servicio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm md:text-base">
              <p className="text-muted-foreground">
                MathTexpedia es una plataforma educativa que proporciona:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Apuntes y materiales de estudio en formato PDF</li>
                <li>Artículos educativos y posts de blog sobre matemáticas e informática</li>
                <li>Recursos organizados por categorías y temas</li>
                <li>Herramientas de búsqueda y filtrado de contenido</li>
              </ul>
              <p className="text-muted-foreground">
                El servicio se proporciona "tal cual" y nos esforzamos por mantener la plataforma disponible, 
                pero no garantizamos que el servicio será ininterrumpido o libre de errores.
              </p>
            </CardContent>
          </Card>

          {/* Registro de Cuenta */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">3. Registro de Cuenta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm md:text-base">
              <p className="text-muted-foreground">
                Para acceder a ciertas funcionalidades, es posible que necesites crear una cuenta. Al registrarte, 
                te comprometes a:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Proporcionar información precisa, actual y completa</li>
                <li>Mantener actualizada tu información de cuenta</li>
                <li>Mantener la confidencialidad de tu contraseña</li>
                <li>Notificarnos inmediatamente sobre cualquier uso no autorizado de tu cuenta</li>
                <li>Ser responsable de todas las actividades realizadas bajo tu cuenta</li>
              </ul>
              <p className="text-muted-foreground">
                Nos reservamos el derecho de suspender o cancelar cuentas que violen estos términos.
              </p>
            </CardContent>
          </Card>

          {/* Uso Aceptable */}
          <Card>
            <CardHeader>
              <AlertCircle className="w-6 h-6 mb-2 text-primary" />
              <CardTitle className="text-xl">4. Uso Aceptable</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm md:text-base">
              <p className="text-muted-foreground">
                Al utilizar MathTexpedia, te comprometes a NO:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Utilizar el servicio para fines ilegales o no autorizados</li>
                <li>Intentar obtener acceso no autorizado a nuestros sistemas o cuentas de otros usuarios</li>
                <li>Realizar ingeniería inversa o intentar extraer el código fuente de la plataforma</li>
                <li>Reproducir, distribuir o vender nuestro contenido sin autorización expresa</li>
                <li>Realizar actividades que sobrecarguen o interfieran con el funcionamiento del servicio</li>
                <li>Utilizar bots, scrapers o herramientas automatizadas sin nuestro consentimiento</li>
                <li>Publicar o transmitir contenido ofensivo, difamatorio o ilegal</li>
                <li>Suplantar la identidad de otra persona o entidad</li>
              </ul>
            </CardContent>
          </Card>

          {/* Propiedad Intelectual */}
          <Card>
            <CardHeader>
              <BookOpen className="w-6 h-6 mb-2 text-primary" />
              <CardTitle className="text-xl">5. Propiedad Intelectual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm md:text-base">
              <div>
                <h3 className="font-semibold mb-2">Contenido de MathTexpedia</h3>
                <p className="text-muted-foreground">
                  Todo el contenido disponible en MathTexpedia, incluyendo pero no limitado a textos, gráficos, 
                  logos, iconos, imágenes y software, es propiedad de MathTexpedia o de sus creadores originales 
                  y está protegido por leyes de propiedad intelectual.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Uso del Contenido</h3>
                <p className="text-muted-foreground">
                  El contenido se proporciona únicamente para fines educativos y de estudio personal. Puedes:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4 mt-2">
                  <li>Usar los materiales para tu estudio personal</li>
                  <li>Compartir enlaces a nuestro contenido</li>
                  <li>Citar nuestros materiales con la debida atribución</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Restricciones</h3>
                <p className="text-muted-foreground">
                  Todo el contenido se encuentra bajo licencia Creative Commons BY-NC-SA 4.0 como se indica en cada documento o recurso. Esta licencia establece:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4 mt-2">    
                    <li><strong>Atribución (BY):</strong> Debes dar crédito adecuado, proporcionar un enlace a la licencia e indicar si se han realizado cambios. Puedes hacerlo de cualquier manera razonable, pero no de una manera que sugiera que el licenciante te respalda a ti o a tu uso.</li>
                    <li><strong>No Comercial (NC):</strong> No puedes utilizar el material para fines comerciales.</li>
                    <li><strong>Compartir Igual (SA):</strong> Si remezclas, transformas o creas a partir del material, debes distribuir tus contribuciones bajo la misma licencia que el original.</li>
                </ul>
                <p className="text-muted-foreground mt-2">
                  Para usos no permitidos, por favor contáctanos para obtener autorización.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Enlaces a Terceros */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">6. Enlaces a Sitios de Terceros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm md:text-base">
              <p className="text-muted-foreground">
                MathTexpedia puede contener enlaces a sitios web de terceros. No somos responsables del contenido, 
                políticas de privacidad o prácticas de estos sitios. El acceso a estos enlaces es bajo tu propio 
                riesgo.
              </p>
            </CardContent>
          </Card>

          {/* Limitación de Responsabilidad */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">8. Limitación de Responsabilidad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm md:text-base">
              <p className="text-muted-foreground">
                En la máxima medida permitida por la ley, MathTexpedia no será responsable de:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Daños indirectos, incidentales, especiales o consecuentes</li>
                <li>Pérdida de beneficios, datos, uso o cualquier otra pérdida intangible</li>
                <li>Errores u omisiones en el contenido proporcionado</li>
                <li>Interrupciones o errores en el servicio</li>
                <li>Acciones de terceros o contenido de terceros</li>
              </ul>
              <p className="text-muted-foreground">
                El contenido educativo se proporciona con fines informativos. Los usuarios son responsables de 
                verificar la precisión de la información para sus necesidades específicas.
              </p>
            </CardContent>
          </Card>

          {/* Terminación */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">9. Terminación del Servicio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm md:text-base">
              <p className="text-muted-foreground">
                Nos reservamos el derecho de:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Suspender o terminar tu acceso al servicio en cualquier momento sin previo aviso</li>
                <li>Modificar o discontinuar el servicio (o cualquier parte de él) temporal o permanentemente</li>
                <li>Eliminar contenido que viole estos términos o sea inapropiado</li>
              </ul>
              <p className="text-muted-foreground">
                Puedes dejar de usar el servicio en cualquier momento. Si deseas eliminar tu cuenta, puedes 
                contactarnos para solicitar la eliminación de tus datos.
              </p>
            </CardContent>
          </Card>

          {/* Ley Aplicable */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">10. Ley Aplicable y Jurisdicción</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm md:text-base">
              <p className="text-muted-foreground">
                Estos Términos de Servicio se rigen por las leyes de España. Cualquier disputa relacionada con 
                estos términos o el uso del servicio se resolverá en los tribunales competentes de Oviedo, 
                Asturias, España.
              </p>
            </CardContent>
          </Card>

          {/* Divisibilidad */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">11. Divisibilidad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm md:text-base">
              <p className="text-muted-foreground">
                Si alguna disposición de estos términos se considera inválida o inaplicable, las disposiciones 
                restantes continuarán en pleno vigor y efecto.
              </p>
            </CardContent>
          </Card>

          {/* Acuerdo Completo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">12. Acuerdo Completo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm md:text-base">
              <p className="text-muted-foreground">
                Estos Términos de Servicio, junto con nuestra Política de Privacidad, constituyen el acuerdo 
                completo entre tú y MathTexpedia con respecto al uso de nuestros servicios.
              </p>
            </CardContent>
          </Card>

          {/* Contacto */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <Mail className="w-6 h-6 mb-2 text-primary" />
              <CardTitle className="text-xl">13. Contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm md:text-base">
              <p className="text-muted-foreground">
                Si tienes preguntas sobre estos Términos de Servicio, puedes <Link href="/dashboard/contact/contact-us" className="text-primary hover:underline">contactarnos</Link>:
              </p>
              <div className="bg-background p-4 rounded-lg border space-y-2">
                <p className="font-semibold">MathTexpedia</p>
                <p className="text-muted-foreground">
                  Email:{" "}
                  <a href="mailto:mathtexpedia@mathtexpedia.es" className="text-primary hover:underline">
                    mathtexpedia@mathtexpedia.es
                  </a>
                </p>
                <p className="text-muted-foreground">
                  Universidad de Oviedo, Asturias, España
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Final Notice */}
        <section className="mt-8">
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center">
                Al continuar utilizando MathTexpedia, confirmas que has leído, comprendido y aceptado estos 
                Términos de Servicio en su totalidad.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
