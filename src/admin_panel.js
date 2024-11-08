import { auth, getFirestore, collection, getDocs, query, where, addDoc } from "./firebase.js";

// Inicializar Firestore
const firestoreDb = getFirestore();

// Verificar si el usuario está autenticado y si tiene rol de administrador en Firestore
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
          console.log("Acceso permitido para el administrador.");
        } else {
          alert("Acceso denegado: no tienes permisos de administrador.");
          window.location.href = "index.html";
        }
      } else {
        alert("Usuario no encontrado en la base de datos.");
        window.location.href = "index.html";
      }
    } catch (error) {
      console.error("Error al verificar permisos de administrador:", error);
      alert("Hubo un problema al verificar tus permisos.");
      window.location.href = "index.html";
    }
  } else {
    // Redirigir a la página de inicio de sesión si no hay un usuario autenticado
    window.location.href = "sign_in.html";
  }
});

// Manejar el envío del formulario para agregar un nuevo PDF
document.getElementById("pdfForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    // Obtener valores de los campos del formulario
    const href = document.getElementById("href").value;
    const name = document.getElementById("name").value;
    const subject = document.getElementById("subject").value;
    const year = parseInt(document.getElementById("year").value, 10); // Convertir año a número
  
    if (isNaN(year)) { // Verificar que el año sea un número válido
      alert("Por favor, ingrese un año válido.");
      return;
    }
  
    try {
      // Referencia a la colección "pdfs" en Firestore y añadir el nuevo documento
      await addDoc(collection(firestoreDb, "pdfs"), {
        href,
        name,
        subject,
        year, // Ahora year es numérico
      });
  
      // Mostrar mensaje de éxito y reiniciar el formulario
      document.getElementById("successMessage").style.display = "block";
      document.getElementById("pdfForm").reset();
  
      setTimeout(() => {
        document.getElementById("successMessage").style.display = "none";
      }, 3000);
  
    } catch (error) {
      console.error("Error al agregar el PDF: ", error);
    }
  });
  
