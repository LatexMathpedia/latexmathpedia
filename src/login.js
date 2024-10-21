import {
  auth,
  signInUserWithEmailAndPassword,
  getFirestore,
  query,
  where,
  collection,
  getDocs
} from './firebase.js';

//Script para crear cuenta en el sitio web
document.getElementById('singIn').addEventListener('click', function (event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const firebaseDb = getFirestore();

  if (!email) {
    alert("Por favor ingresa tu correo");
    return;
  }
  if (!password) {
    alert("Por favor ingresa tu contraseña");
    return;
  }

  const usersCollection = collection(firestoreDb, "users");
  const emailQuery = query(usersCollection, where("email", "==", email));
  getDocs(emailQuery).then((querySnapshot) => {
    if (!querySnapshot.empty) {
      alert("Email ya registrado, no se puede crear cuenta");
      signInUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
        })
        .catch((error) => {
          alert("Hubo un error: " + error.message);
        });
    } else {  
      alert("No hay un usuario registrado con ese correo")
    }
  });
});
