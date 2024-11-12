import { auth, getFirestore, collection, getDocs, query, where, addDoc } from "./firebase.js";

// Inicializar Firestore
const firestoreDb = getFirestore();

/**
 * Cada vez que se detecta un cambio en el usuario, se comprueba si es o no admin
 */
auth.onAuthStateChanged(async (user) => {
  if (user) {
    const email = user.email;
    try {
      // Consultar la colección "users" en busca del documento del usuario con el email correspondiente
      const usersCollection = collection(firestoreDb, "users");
      const emailQuery = query(usersCollection, where("email", "==", email));
      const querySnapshot = await getDocs(emailQuery);
      // Comprobar si existe un documento y si tiene permisos de administrador
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        if (userData.admin) {
        } else {
          alert("Acceso denegado: no tienes permisos de administrador.");
          window.location.href = "index.html";
        }
      } else {
        alert("Usuario no encontrado en la base de datos.");
        window.location.href = "index.html";
      }
    } catch (error) {
      alert("Hubo un problema al verificar tus permisos.");
      window.location.href = "index.html";
    }
  } else {
    // Redirigir a la página de inicio de sesión si no hay un usuario autenticado
    window.location.href = "sign_in.html";
  }
});

/**
 * Evento del botón para submitear el forumulario de subir el PDF
 */
document.getElementById("pdfForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  // Obtener valores de los campos del formulario
  const href = document.getElementById("href").value;
  const name = document.getElementById("name").value;
  const subject = document.getElementById("subject").value;
  const year = parseInt(document.getElementById("year").value, 10);
  if (!href) {
    alert("Por favor, ingrese un link");
    return;
  }
  if (!name) {
    alert("Por favor, ingrese un nombre");
    return;
  }
  if (!subject) {
    alert("Por favor, ingrese el nombre de la asignatura");
    return;
  }
  if (isNaN(year)) {
    alert("Por favor, ingrese un año válido.");
    return;
  }
  try {
    // Referencia a la colección "pdfs" en Firestore y añadir el nuevo documento
    await addDoc(collection(firestoreDb, "pdfs"), {
      href,
      name,
      subject,
      year,
    });

    // Mostrar mensaje de éxito y reiniciar el formulario
    document.getElementById("successMessage").style.display = "block";
    document.getElementById("pdfForm").reset();

    setTimeout(() => {
      document.getElementById("successMessage").style.display = "none";
    }, 3000);

  } catch (error) {
  }
});

