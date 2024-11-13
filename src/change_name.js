import { auth, getFirestore, doc, updateDoc } from "./firebase.js";

// Inicializar Firestore
const firestoreDb = getFirestore();

/**
 * Modifica en la base de datos el nombre del usuario
 * @param {String} id del usuario
 * @returns 
 */
async function actualizarDocumento(id) {
    try {
        const name = document.getElementById('name').value;

        if (!name.trim()) {
            alert("Por favor, ingrese un nombre válido.");
            return;
        }
        const docRef = doc(firestoreDb, 'users', id);
        await updateDoc(docRef, { nombre: name });
        alert("Nombre cambiado con éxito");

    } catch (error) {
        alert("Hubo un error al actualizar el nombre: " + error.message + "\nPor favor contactnos por privado para intentar solucionar el problema");

        if (error.code === "permission-denied") {
            alert("No tienes permisos para actualizar este documento.");
        }
    }
}

/**
 * Evento del botón cambiar nombre
 */
document.getElementById('change_name').addEventListener('click', async function (event) {
    const user = auth.currentUser;
    if (user) {
        const id = user.uid;
        console.log("Usuario autenticado con ID:", id);

        await actualizarDocumento(id);
    } else {
        alert("Ha habido un error con la autenticación");
        console.error("Usuario no autenticado.");
    }
});

