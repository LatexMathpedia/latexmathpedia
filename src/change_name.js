import { auth, getFirestore, doc, setDoc, onAuthStateChanged } from "./firebase.js";

// Inicializar Firestore
const firestoreDb = getFirestore();

async function actualizarDocumento(userId) {
    try {
        const name = document.getElementById('name').value;

        if (!name.trim()) {
            alert("Por favor, ingrese un nombre válido.");
            return;
        }

        const docRef = doc(firestoreDb, 'users', userId);
        console.log("Referencia del documento:", docRef);
        console.log("Datos a actualizar:", { nombre: name });

        await setDoc(docRef, { nombre: name }, { merge: true });
        alert("Nombre cambiado con éxito");

    } catch (error) {
        console.error("Error actualizando el documento:", error.message);
        alert("Hubo un error al actualizar el nombre: " + error.message);
    }
}

document.getElementById('change_name').addEventListener('click', function () {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("Usuario autenticado con UID:", user.uid);
            actualizarDocumento(user.uid);
        } else {
            alert("El usuario no está autenticado.");
        }
    });
});
