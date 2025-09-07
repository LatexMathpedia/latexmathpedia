import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function renameCategoryInverted(category: string) {
  switch (category) {
    case "AC":
      return "Análisis y Cálculo";
    case "AG":
      return "Álgebra y Geometría";
    case "TE":
      return "Topología";
    case "PE":
      return "Probabilidad y Estadística";
    case "EM":
      return "Ecuaciones Diferenciales y Métodos Numéricos";
    case "OP":
      return "Optimización y Programación Matemática";
    case "FA":
      return "Fundamentos y Algoritmos";
    case "EL":
      return "Estructuras, Computación y Lenguajes";
    case "AS":
      return "Arquitectura y Sistemas";
    case "IP":
      return "Ingeniería del Software";
    case "BD":
      return "Bases de Datos";
    case "RS":
      return "Redes y Seguridad";
    case "WI":
      return "Web e Interfaces";
    default:
      throw new Error("Categoría desconocida");
  }
}

export function renameCategory(category: string) {
  switch (category) {
    case "Análisis y Cálculo":
      return "AC";
    case "Álgebra y Geometría":
      return "AG";
    case "Topología":
      return "TE";
    case "Probabilidad y Estadística":
      return "PE";
    case "Ecuaciones Diferenciales y Métodos Numéricos":
      return "EM";
    case "Optimización y Programación Matemática":
      return "OP";
    case "Fundamentos y Algoritmos":
      return "FA";
    case "Estructuras, Computación y Lenguajes":
      return "EL";
    case "Arquitectura y Sistemas":
      return "AS";
    case "Ingeniería del Software":
      return "IP";
    case "Bases de Datos":
      return "BD";
    case "Redes y Seguridad":
      return "RS";
    case "Web e Interfaces":
      return "WI";
    default:
      throw new Error("Categoría desconocida");
  }
}