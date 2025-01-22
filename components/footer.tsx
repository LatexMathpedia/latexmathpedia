import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-[#3498db] dark:bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold">Math Texpedia</h3>
            <p className="text-sm text-blue-100 dark:text-gray-300">Tu plataforma de aprendizaje matemático</p>
          </div>
          <div>
            <ul className="flex space-x-4">
              <li>
                <Link href="/about" className="text-blue-100 dark:text-gray-300 hover:text-white transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-blue-100 dark:text-gray-300 hover:text-white transition-colors">
                  Términos
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-blue-100 dark:text-gray-300 hover:text-white transition-colors">
                  Privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-blue-100 dark:text-gray-300">
          © {new Date().getFullYear()} Math Texpedia. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}

