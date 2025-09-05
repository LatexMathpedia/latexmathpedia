"use client"

import { useState } from "react"
import { Check, CreditCard, Gift, Heart, Star, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export default function DonationPage() {
  const [donationAmount, setDonationAmount] = useState("10")
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [donationFrequency, setDonationFrequency] = useState("once")

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "")
    setDonationAmount(value)
  }

  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan)
    
    // Establecer el monto según el plan seleccionado
    switch(plan) {
      case "basic":
        setDonationAmount("5")
        break
      case "standard":
        setDonationAmount("15")
        break
      case "premium":
        setDonationAmount("30")
        break
      default:
        setDonationAmount("10")
    }
  }

  return (
    <div className="p-8 max-w-[1200px] mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Apoya a LatexMathpedia</h1>
        <p className="text-muted-foreground">
          Tu apoyo nos ayuda a seguir creando contenido educativo de calidad y mantener nuestros recursos accesibles para todos.
        </p>
      </div>
      
      <Separator className="my-6" />
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Importe personalizado</CardTitle>
            <CardDescription>
              Elige la cantidad que deseas donar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="donation-amount">Cantidad (EUR)</Label>
              <div className="flex items-center">
                <span className="text-muted-foreground mr-2">€</span>
                <Input 
                  id="donation-amount" 
                  type="text" 
                  placeholder="10" 
                  value={donationAmount} 
                  onChange={handleCustomAmountChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Donación rápida</Label>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => setDonationAmount("5")}>€5</Button>
                <Button variant="outline" size="sm" onClick={() => setDonationAmount("10")}>€10</Button>
                <Button variant="outline" size="sm" onClick={() => setDonationAmount("20")}>€20</Button>
                <Button variant="outline" size="sm" onClick={() => setDonationAmount("50")}>€50</Button>
                <Button variant="outline" size="sm" onClick={() => setDonationAmount("100")}>€100</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="donation-frequency">Frecuencia</Label>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className={donationFrequency === "once" ? "bg-primary text-primary-foreground" : ""} onClick={() => setDonationFrequency("once")}>Una vez</Button>
                <Button variant="outline" size="sm" className={donationFrequency === "monthly" ? "bg-primary text-primary-foreground" : ""} onClick={() => setDonationFrequency("monthly")}>Mensual</Button>
                <Button variant="outline" size="sm" className={donationFrequency === "quarterly" ? "bg-primary text-primary-foreground" : ""} onClick={() => setDonationFrequency("quarterly")}>Trimestral</Button>
                <Button variant="outline" size="sm" className={donationFrequency === "yearly" ? "bg-primary text-primary-foreground" : ""} onClick={() => setDonationFrequency("yearly")}>Anual</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Método de pago</CardTitle>
            <CardDescription>
              Selecciona cómo quieres realizar tu donación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start" size="lg">
                <svg
                  className="h-4 w-4 mr-2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.08 10.205c-.14-.303-.308-.53-.503-.68a1.05 1.05 0 0 0-.64-.225c-.14 0-.272.028-.399.083a.923.923 0 0 0-.318.225.99.99 0 0 0-.212.338 1.318 1.318 0 0 0 0 .798c.047.131.117.248.212.351.094.103.204.186.33.249.127.063.266.094.418.094.317 0 .568-.096.753-.287.186-.192.28-.436.28-.733.01-.075.01-.142 0-.201a1.123 1.123 0 0 0-.08-.2z"
                    fill="#003087"
                  />
                  <path
                    d="M23.048 0H.952C.428 0 0 .428 0 .952v22.096C0 23.572.428 24 .952 24h22.096c.524 0 .952-.428.952-.952V.952C24 .428 23.572 0 23.048 0zM7.13 11.477a1.51 1.51 0 0 1-.52.533c-.208.133-.436.23-.683.29s-.49.09-.727.09c-.176 0-.35-.015-.52-.045a1.852 1.852 0 0 1-.467-.142.958.958 0 0 1-.337-.26.626.626 0 0 1-.129-.393c0-.038.01-.075.028-.11a.281.281 0 0 1 .064-.09.263.263 0 0 1 .093-.058.306.306 0 0 1 .11-.02c.06 0 .116.012.167.035.05.024.099.051.144.082.046.03.095.061.148.091.052.03.111.057.178.08.066.022.142.04.226.051.084.012.18.018.288.018.157 0 .293-.019.411-.055a.836.836 0 0 0 .288-.15.581.581 0 0 0 .211-.384.544.544 0 0 0-.093-.338.722.722 0 0 0-.248-.219 1.757 1.757 0 0 0-.356-.147 7.963 7.963 0 0 0-.411-.114 4.334 4.334 0 0 1-.448-.127 1.541 1.541 0 0 1-.407-.201.945.945 0 0 1-.3-.33c-.78.136-.117.308-.117.516 0 .178.031.347.094.506zm-1.96-2.667c.047-.084.101-.159.163-.225a.705.705 0 0 1 .226-.15.808.808 0 0 1 .304-.054c.205 0 .367.07.487.212.12.14.18.336.18.586 0 .112-.014.223-.042.334a1.142 1.142 0 0 1-.13.312.794.794 0 0 1-.459.338.95.95 0 0 1-.296.046c-.205 0-.368-.07-.488-.212-.12-.14-.18-.336-.18-.586 0-.112.014-.223.042-.334.029-.11.071-.216.126-.318zm3.137 2.667a1.51 1.51 0 0 1-.52.533c-.208.133-.436.23-.683.29-.248.06-.49.09-.728.09-.175 0-.349-.015-.519-.045a1.852 1.852 0 0 1-.467-.142.958.958 0 0 1-.337-.26.626.626 0 0 1-.129-.393c0-.038.01-.075.028-.11a.281.281 0 0 1 .064-.09.263.263 0 0 1 .093-.058.306.306 0 0 1 .11-.02c.06 0 .116.012.167.035.05.024.099.051.144.082.046.03.095.061.148.091.052.03.111.057.178.08.066.022.142.04.226.051.084.012.18.018.288.018.157 0 .293-.019.411-.055a.836.836 0 0 0 .288-.15.581.581 0 0 0 .211-.384.544.544 0 0 0-.093-.338.722.722 0 0 0-.248-.219 1.757 1.757 0 0 0-.356-.147 7.963 7.963 0 0 0-.411-.114 4.334 4.334 0 0 1-.448-.127 1.541 1.541 0 0 1-.407-.201.945.945 0 0 1-.3-.33c-.78.136-.117.308-.117.516 0 .178.031.347.094.506zm6.347-1.204h-1.351c-.12 0-.227.084-.247.202l-.72 4.574a.202.202 0 0 0 .2.234h.691c.116 0 .216-.084.234-.198l.206-1.299c.02-.119.128-.202.247-.202h.427c1.186 0 1.869-.573 2.048-1.707a1.39 1.39 0 0 0-.231-1.18c-.284-.285-.784-.424-1.454-.424zm.208 1.688c-.098.645-.589.645-1.064.645h-.27l.19-1.198a.151.151 0 0 1 .15-.127h.124c.323 0 .629 0 .786.184a.555.555 0 0 1 .84.496zm3.729-1.688h-.692a.152.152 0 0 0-.148.127l-.382 2.417-.382-2.417a.254.254 0 0 0-.25-.127h-.68a.151.151 0 0 0-.15.178l.719 4.27-.338 1.473c-.6.035.2.071.24.111a.151.151 0 0 0 .165.08h.685a.152.152 0 0 0 .15-.127l1.364-6.025a.151.151 0 0 0-.15-.178zm3.777 0h-1.35c-.12 0-.228.084-.247.202l-.72 4.574a.202.202 0 0 0 .2.234h.69a.203.203 0 0 0 .201-.17l.193-1.226a.247.247 0 0 1 .243-.206h.426c1.188 0 1.872-.573 2.05-1.707.09-.496.003-.887-.229-1.18-.284-.292-.785-.424-1.457-.424zm.208 1.688c-.098.645-.588.645-1.063.645h-.27l.19-1.198a.151.151 0 0 1 .149-.127h.124c.323 0 .628 0 .786.184a.555.555 0 0 1 .84.496zM21.42 10.04c-.097.651-.59.651-1.064.651h-.27l.189-1.198a.153.153 0 0 1 .15-.127h.124c.323 0 .628 0 .786.184.158.184.198.344.84.49z"
                    fill="#003087"
                  />
                </svg>
                Pagar con PayPal
              </Button>
              <Button variant="outline" className="w-full justify-start" size="lg">
                <CreditCard className="mr-2 h-4 w-4" /> 
                Pagar con tarjeta
              </Button>
              <Button variant="outline" className="w-full justify-start" size="lg">
                <Gift className="mr-2 h-4 w-4" /> 
                Donar como regalo
              </Button>
            </div>
            
            <div className="space-y-4 pt-4">
              <Button className="w-full" size="lg">
                <Heart className="mr-2 h-4 w-4" />
                Donar {donationAmount}€
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                Tu donación ayuda a mantener LatexMathpedia como un recurso educativo gratuito. Gracias por tu apoyo.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 p-6 bg-muted rounded-lg">
        <div className="flex items-start space-x-4">
          <Zap className="h-6 w-6 text-primary mt-1" />
          <div>
            <h3 className="font-medium">¿Por qué donar?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Con tu donación ayudas a que podamos seguir desarrollando contenido educativo de calidad, mejorando la plataforma y manteniendo los recursos accesibles para estudiantes de todo el mundo.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
