import {auth, getFirestore} from "./firebase.js";

const db = getFirestore();

async function actualizarDocumento(id) {
    try {
      const docRef = db.collection('users').doc(id);
      const name = document.getElementById('name');
  
      await docRef.update({
        nombre: name,
      });
    } catch (error) {
    }
  }

document.getElementById('change_name').addEventListener('click',function(event){
    const user = auth.currentUser;
    if(user){
        const id = user.uid;
        actualizarDocumento(id);
        alert("Se ha actualizado el nombre correctamente");
    }else{
        alert("Ha habido un error");
    }

});

