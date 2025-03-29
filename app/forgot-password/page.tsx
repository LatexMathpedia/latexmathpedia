"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { FormResetPassword } from "@/components/form-reset-password";
import { API_ROUTES } from "@/lib/api-config";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(API_ROUTES.register, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email }),
            })
        if(res.ok){
            console.log(res)
            alert("Correo de recuperación de contraseña enviado. Por favor, revisa tu bandeja de entrada.");
        }
        else {
            throw new Error("Error al enviar correo de recuperación de contraseña. Por favor, inténtalo de nuevo.");
        }
    } catch (error) {
      console.error("Error al enviar correo de recuperación de contraseña:", error);
      alert("Error al enviar correo de recuperación de contraseña. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Recupera la contraseña
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormResetPassword handleSubmit={handleSubmit} email={email} setEmail={setEmail} />
          <div className="mt-4 text-center">
            <p>
                ¿No tienes una cuenta?{" "}
              <Link
                href="/register"
                className="text-blue-600 hover:underline"
              >
                Regístrate aquí
              </Link>
            </p>
            <p>
                ¿Ya tienes una cuenta?{" "}
                <Link
                    href="/login"
                    className="text-blue-600 hover:underline"
                >
                    Inicia sesión aquí
                </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
