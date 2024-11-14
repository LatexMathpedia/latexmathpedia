import { auth, getFirestore, doc, setDoc, onAuthStateChanged } from "./firebase.js";


const firestoreDb = getFirestore();
let currentUser = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
    } else {
        currentUser = null;
    }
});

async function actualizarDocumento(event) {
    event.preventDefault();

    if (!currentUser) {
        alert("El usuario no está autenticado.");
        return;
    }

    try {
        const name = document.getElementById('name').value;

        if (!name.trim()) {
            alert("Por favor, ingrese un nombre válido.");
            return;
        }

        if(name.length > 150){
            alert("El nombre no puede tener más de 150 carácteres.\nIngrese uno más corto por favor.");
            return;
        }

        const docRef = doc(firestoreDb, 'users', currentUser.uid);

        await setDoc(docRef, { nombre: name }, { merge: true });
        alert("Nombre cambiado con éxito");
        window.location.reload();

    } catch (error) {
        alert("Hubo un error al actualizar el nombre: " + error.message);
    }
}


window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('change_name').addEventListener('click', actualizarDocumento);
});


