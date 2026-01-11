"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, Lock, UserCheck, Database, Mail } from "lucide-react"
import Link from "next/link"

export default function PrivacyPolicyPage() {
  const lastUpdated = "11 de enero de 2026"

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/10 to-background border-b">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <Shield className="w-12 h-12 mx-auto text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Política de Privacidad
            </h1>
            <p className="text-base md:text-lg text-muted-foreground">
              Tu privacidad es importante para nosotros
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
                En MathTexpedia, respetamos tu privacidad y nos comprometemos a proteger tus datos personales. 
                Esta Política de Privacidad explica qué información recopilamos, cómo la usamos y cuáles son 
                tus derechos respecto a ella.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Quick Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Resumen Rápido</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <Eye className="w-6 h-6 mb-2 text-primary" />
                <CardTitle className="text-base">Información Mínima</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Solo recopilamos lo necesario para ofrecerte el servicio
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Lock className="w-6 h-6 mb-2 text-primary" />
                <CardTitle className="text-base">Datos Seguros</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Tus datos están protegidos con las mejores prácticas
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <UserCheck className="w-6 h-6 mb-2 text-primary" />
                <CardTitle className="text-base">Tú Decides</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Tienes control total sobre tu información
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Detailed Sections */}
        <div className="space-y-8">
          {/* Información que Recopilamos */}
          <Card>
            <CardHeader>
              <Database className="w-6 h-6 mb-2 text-primary" />
              <CardTitle className="text-xl">1. Información que Recopilamos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base">
              <div>
                <h3 className="font-semibold mb-2">Información de Cuenta</h3>
                <p className="text-muted-foreground">
                  Cuando te registras en MathTexpedia, recopilamos información básica como:
                </p>
                <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1 ml-4">
                  <li>Nombre de usuario</li>
                  <li>Dirección de correo electrónico</li>
                  <li>Contraseña (encriptada)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Información de Uso</h3>
                <p className="text-muted-foreground">
                  Para mejorar nuestro servicio, recopilamos datos anónimos sobre:
                </p>
                <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1 ml-4">
                  <li>PDFs descargados o visualizados</li>
                  <li>Artículos del blog leídos</li>
                  <li>Búsquedas realizadas</li>
                  <li>Tiempo de permanencia en el sitio</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Cookies y Tecnologías Similares</h3>
                <p className="text-muted-foreground">
                  Utilizamos cookies para mantener tu sesión activa y mejorar tu experiencia. Puedes 
                  configurar tu navegador para rechazar cookies, aunque esto puede afectar la funcionalidad 
                  del sitio.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cómo Usamos tu Información */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">2. Cómo Usamos tu Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm md:text-base">
              <p className="text-muted-foreground">
                Utilizamos la información recopilada para:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Proporcionar y mantener nuestros servicios</li>
                <li>Personalizar tu experiencia en la plataforma</li>
                <li>Comunicarnos contigo sobre actualizaciones o cambios importantes</li>
                <li>Responder a tus consultas y solicitudes de soporte</li>
                <li>Mejorar la calidad y funcionalidad de nuestros servicios</li>
                <li>Prevenir fraude y garantizar la seguridad</li>
                <li>Cumplir con obligaciones legales</li>
              </ul>
            </CardContent>
          </Card>

          {/* Compartir Información */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">3. Compartir tu Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm md:text-base">
              <p className="text-muted-foreground">
                <strong>No vendemos tu información personal a terceros.</strong> Solo compartimos tus datos en 
                las siguientes circunstancias:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Con proveedores de servicios que nos ayudan a operar la plataforma (hosting, análisis)</li>
                <li>Cuando sea requerido por ley o por autoridades competentes</li>
                <li>Para proteger los derechos y seguridad de MathTexpedia y sus usuarios</li>
                <li>Con tu consentimiento explícito</li>
              </ul>
            </CardContent>
          </Card>

          {/* Seguridad */}
          <Card>
            <CardHeader>
              <Lock className="w-6 h-6 mb-2 text-primary" />
              <CardTitle className="text-xl">4. Seguridad de tus Datos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm md:text-base">
              <p className="text-muted-foreground">
                Implementamos medidas de seguridad técnicas y organizativas para proteger tu información:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Encriptación de contraseñas mediante algoritmos seguros</li>
                <li>Conexiones HTTPS para todas las comunicaciones</li>
                <li>Acceso restringido a datos personales solo para personal autorizado</li>
                <li>Monitoreo continuo de vulnerabilidades de seguridad</li>
              </ul>
            </CardContent>
          </Card>

          {/* Tus Derechos */}
          <Card>
            <CardHeader>
              <UserCheck className="w-6 h-6 mb-2 text-primary" />
              <CardTitle className="text-xl">5. Tus Derechos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm md:text-base">
              <p className="text-muted-foreground">
                De acuerdo con el RGPD (Reglamento General de Protección de Datos), tienes derecho a:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>Acceso:</strong> Solicitar una copia de tus datos personales</li>
                <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
                <li><strong>Supresión:</strong> Solicitar la eliminación de tus datos</li>
                <li><strong>Portabilidad:</strong> Recibir tus datos en un formato estructurado</li>
                <li><strong>Oposición:</strong> Oponerte al procesamiento de tus datos</li>
                <li><strong>Limitación:</strong> Solicitar la restricción del procesamiento</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Para ejercer cualquiera de estos derechos, contáctanos en:{" "}
                <a href="mailto:mathtexpedia@mathtexpedia.es" className="text-primary hover:underline">
                  mathtexpedia@mathtexpedia.es
                </a>
              </p>
            </CardContent>
          </Card>

          {/* Retención de Datos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">6. Retención de Datos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm md:text-base">
              <p className="text-muted-foreground">
                Conservamos tu información personal solo durante el tiempo necesario para cumplir con los 
                propósitos descritos en esta política, a menos que la ley requiera o permita un período de 
                retención más largo.
              </p>
              <p className="text-muted-foreground">
                Cuando elimines tu cuenta, procederemos a eliminar o anonimizar tus datos personales, salvo 
                que estemos obligados legalmente a conservarlos.
              </p>
            </CardContent>
          </Card>

          {/* Menores de Edad */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="text-xl">7. Menores de Edad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm md:text-base">
              <p className="text-muted-foreground">
                MathTexpedia no está dirigido a menores de 14 años. No recopilamos conscientemente información 
                personal de menores de esta edad. Si descubrimos que hemos recopilado datos de un menor sin 
                consentimiento parental, eliminaremos dicha información de inmediato.
              </p>
            </CardContent>
          </Card> */}

          {/* Enlaces a Terceros */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">7. Enlaces a Sitios de Terceros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm md:text-base">
              <p className="text-muted-foreground">
                Nuestro sitio puede contener enlaces a sitios web de terceros. No somos responsables de las 
                prácticas de privacidad de estos sitios. Te recomendamos revisar sus políticas de privacidad.
              </p>
            </CardContent>
          </Card>

          {/* Cambios en la Política */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">8. Cambios en esta Política</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm md:text-base">
              <p className="text-muted-foreground">
                Podemos actualizar esta Política de Privacidad periódicamente. Te notificaremos sobre cambios 
                significativos mediante un aviso en nuestro sitio o por correo electrónico. Te recomendamos 
                revisar esta página regularmente para estar informado.
              </p>
            </CardContent>
          </Card>

          {/* Contacto */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <Mail className="w-6 h-6 mb-2 text-primary" />
              <CardTitle className="text-xl">9. Contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm md:text-base">
              <p className="text-muted-foreground">
                Si tienes preguntas, inquietudes o comentarios sobre esta Política de Privacidad o sobre 
                cómo manejamos tus datos personales, no dudes en <Link href="/dashboard/contact/contact-us" className="text-primary hover:underline">contactarnos</Link>:
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
      </div>
    </div>
  )
}
