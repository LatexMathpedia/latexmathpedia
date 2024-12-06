import {
  auth,
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  addDoc,
} from "./firebase.js";

// Inicializar Firestore
const firestoreDb = getFirestore();

/**
 * Cada vez que se detecta un cambio en el usuario, se comprueba si es o no admin
 * Si no es admin, se redirige a la página de inicio
 * Si es admin, se permite acceder a la página
 * Si no hay usuario autenticado, se redirige a la página de inicio de sesión
 *
 * @param {Object} user - Objeto de usuario de Firebase
 *
 * @returns {void}
 */
auth.onAuthStateChanged(async (user) => {
  if (user) {
    const email = user.email;
    try {
      const usersCollection = collection(firestoreDb, "users");
      const emailQuery = query(usersCollection, where("email", "==", email));
      const querySnapshot = await getDocs(emailQuery);
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        if (userData.admin) {
        } else {
          alert("Acceso denegado: no tienes permisos de administrador."); // Si no es admin, se le advierte y se redirige a la página de inicio
          window.location.href = "index.html";
        }
      } else {
        alert("Usuario no encontrado en la base de datos."); // Si no se encuentra el usuario en la base de datos, se le advierte y se redirige a la página de inicio
        window.location.href = "index.html";
      }
    } catch (error) {
      alert("Hubo un problema al verificar tus permisos."); // Si hay un error, se le advierte y se redirige a la página de inicio
      window.location.href = "index.html";
    }
  } else {
    window.location.href = "sign_in.html";
  }
});

/**
 * Evento del botón para submitear el forumulario de subir el PDF
 *
 * @listens submit
 */
document.getElementById("pdfForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const href = document.getElementById("href").value;
  const name = document.getElementById("name").value;
  const subject = document.getElementById("subject").value;
  const year = parseInt(document.getElementById("year").value, 10);
  if (!href) {
    alert("Por favor, ingrese un link"); // Si no se ingresa un link, se muestra un mensaje de alerta
    return;
  }
  if (!name) {
    alert("Por favor, ingrese un nombre"); // Si no se ingresa un nombre, se muestra un mensaje de alerta
    return;
  }
  if (!subject) {
    alert("Por favor, ingrese el nombre de la asignatura"); // Si no se ingresa el nombre de la asignatura, se muestra un mensaje de alerta
    return;
  }
  if (isNaN(year)) {
    alert("Por favor, ingrese un año válido."); // Si no se ingresa un año válido, se muestra un mensaje de alerta
    return;
  }
  try {
    await addDoc(collection(firestoreDb, "pdfs"), {
      href,
      name,
      subject,
      year,
    });

    document.getElementById("successMessage").style.display = "block";
    document.getElementById("pdfForm").reset();

    setTimeout(() => {
      document.getElementById("successMessage").style.display = "none";
    }, 3000);
  } catch (error) {
    alert("Hubo un problema al subir el PDF."); // Si hay un error, se muestra un mensaje de alerta
  }
});

/**
 * Funcion para obtener los emails de los usuarios en la database.
 * Es importante cambiar esto para el backend. Eso ya lo haremos en el futuro.
 *
 * @returns {Promise<Array<String>>} - Array de emails
 * @async
 * @function
 */
const catchEmails = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestoreDb, "users"));
    const emails = [];

    querySnapshot.forEach((doc) => {
      emails.push(doc.data().email);
    });

    return emails;
  } catch (error) {
    alert("Error al recolectar correos:", error);
  }
};

/**
 * Función para descargar los correos de los usuarios en un archivo CSV.
 *
 * @param {Array<String>} emails
 * @returns {Promise<void>} void
 */
const downloadCsv = async (emails) => {
  if (!emails || emails.length === 0) {
    alert("No hay correos para descargar.");
    return;
  }

  // Construir el contenido del CSV correctamente
  const csvContent = [
    ["Email"], // Header
    ...emails.map((email) => [email]), // Cada email en una nueva línea
  ]
    .map((e) => e.join(","))
    .join("\n");

  // Crear un blob y descargarlo
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "emails.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

document
  .getElementById("downloadEmails")
  .addEventListener("click", async () => {
    const emails = await catchEmails();
    downloadCsv(emails);
  });
