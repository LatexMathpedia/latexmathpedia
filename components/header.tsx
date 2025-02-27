"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/components/auth-context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ToggleTheme } from "@/components/ui/toggle_theme";

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-[#3498db] dark:bg-gray-800 py-4 shadow-md">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          <div className="flex flex-row items-center space-x-6">
            <Link href="/" className="text-2xl font-bold text-white">
              Math Texpedia
            </Link>
            <ToggleTheme />
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/pdfs" className="text-white hover:text-blue-100">
              PDFs
            </Link>
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="text-white hover:text-blue-100"
                >
                  Perfil
                </Link>
                {user.admin && (
                  <Link
                    href="/admin"
                    className="text-white hover:text-blue-100"
                  >
                    Panel de Administración
                  </Link>
                )}
                <Button
                  onClick={handleLogout}
                  className="text-white bg-red-500 hover:bg-red-600"
                >
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-white hover:text-blue-100">
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  className="bg-white text-[#3498db] px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
          <button className="md:hidden text-white" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>
      {isMenuOpen && (
        <div className="md:hidden mt-4 bg-blue-600 dark:bg-gray-700 p-4">
          <div className="flex flex-col space-y-4">
            <Link
              href="/pdfs"
              className="text-white hover:text-blue-100 text-center py-2 bg-blue-500 dark:bg-gray-600 rounded-md"
            >
              PDFs
            </Link>
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="text-white hover:text-blue-100 text-center py-2 bg-blue-500 dark:bg-gray-600 rounded-md"
                >
                  Perfil
                </Link>
                {user.admin && (
                  <Link
                    href="/admin"
                    className="text-white hover:text-blue-100 text-center py-2 bg-blue-500 dark:bg-gray-600 rounded-md"
                  >
                    Panel de Administración
                  </Link>
                )}
                <Button onClick={handleLogout} className="w-full">
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="bg-white text-[#3498db] px-4 py-2 rounded-md hover:bg-blue-50 transition-colors text-center w-full block"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  className="bg-white text-[#3498db] px-4 py-2 rounded-md hover:bg-blue-50 transition-colors text-center w-full block"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
