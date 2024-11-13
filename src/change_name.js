import { auth, getFirestore, doc, updateDoc } from "./firebase.js";

// Inicializar Firestore
const firestoreDb = getFirestore();

async function actualizarDocumento(id) {
    try {
        const name = document.getElementById('name').value;

        if (!name.trim()) {
            alert("Por favor, ingrese un nombre válido.");
            return;
        }

        console.log("Nombre a actualizar:", name);
        
        const docRef = doc(firestoreDb, 'users', id);
        console.log("Referencia del documento obtenida:", docRef);

        await updateDoc(docRef, { nombre: name });
        console.log("Documento actualizado en Firestore");
        
        alert("Nombre cambiado con éxito");

    } catch (error) {
        console.error("Error actualizando el documento:", error.message);
        alert("Hubo un error al actualizar el nombre: " + error.message);

        if (error.code === "permission-denied") {
            alert("No tienes permisos para actualizar este documento.");
        }
    }
}

document.getElementById('change_name').addEventListener('click', async function(event) {
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

