import { auth, getFirestore, doc, setDoc, onAuthStateChanged } from "./firebase.js";

// Inicializa Firestore
const firestoreDb = getFirestore();
let currentUser = null;

// Observa los cambios en el estado de autenticación del usuario
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
    } else {
        currentUser = null;
    }
});

/**
 * Función asincrónica para actualizar el documento del usuario
 * @param {Event} event - El evento que desencadena la función
 * @returns {Promise<void>}
 * 
 * @async
 * @function actualizarDocumento
 */
const actualizarDocumento = async (event) => {
    event.preventDefault(); // Previene el comportamiento por defecto del evento

    // Verifica si el usuario está autenticado
    if (!currentUser) {
        alert("El usuario no está autenticado.");
        return;
    }

    try {
        // Obtiene el valor del nombre del input con id 'name'
        const name = document.getElementById('name').value;
        // Expresión regular para validar el nombre (sin espacios y entre 1 y 150 caracteres)
        const nameRegex = /^[^\s]{1,150}$/;

        // Verifica si el nombre cumple con la expresión regular
        if (!name.match(nameRegex)) {
            alert("Por favor, ingrese un nombre válido sin espacios y con una longitud entre 1 y 150 caracteres.");
            return;
        }

        // Referencia al documento del usuario en Firestore
        const docRef = doc(firestoreDb, 'users', currentUser.uid);

        // Actualiza el documento del usuario con el nuevo nombre
        await setDoc(docRef, { nombre: name }, { merge: true });
        alert("Nombre cambiado con éxito");
        window.location.reload(); // Recarga la página

    } catch (error) {
        // Muestra un mensaje de error si ocurre un problema al actualizar el nombre
        alert("Hubo un error al actualizar el nombre: " + error.message);
    }
}

/**
 * Añade un event listener para ejecutar la función actualizarDocumento cuando el DOM esté cargado
 * 
 * @listens DOMContentLoaded
 */
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('change_name').addEventListener('click', actualizarDocumento);
});
