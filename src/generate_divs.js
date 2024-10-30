import { getStorage, ref, listAll, getDownloadURL } from "./firebase.js";

export async function obtenerSubcarpetas(carpeta) {
  try {
    const storage = getStorage();
    const carpetaRef = ref(storage, carpeta);
    const result = await listAll(carpetaRef);

    const subcarpetas = result.prefixes;
    subcarpetas.forEach(async (subcarpeta) => {
      const imagenRef = ref(storage, `${subcarpeta.fullPath}/cover.jpg`);
      try {
        const urlImagen = await getDownloadURL(imagenRef);
        crearDivSubcarpeta(subcarpeta.name, urlImagen); 
      } catch (error) {
        console.warn(`No se encontró imagen en ${subcarpeta.fullPath}`);
        crearDivSubcarpeta(subcarpeta.name, 'ruta/default.jpg');
      }
    });
  } catch (error) {
    console.error("Error al obtener las subcarpetas:", error);
  }
}

function crearDivSubcarpeta(idSubcarpeta, urlImagen) {
  const container = document.getElementById("yearContainer");
  const div = document.createElement("div");
  const img = document.createElement("img");
  const p = document.createElement("p");

  img.src = urlImagen;
  img.alt = idSubcarpeta;
  p.innerText = idSubcarpeta.toUpperCase();

  div.appendChild(img);
  div.appendChild(p);
  
  container.appendChild(div);
}
