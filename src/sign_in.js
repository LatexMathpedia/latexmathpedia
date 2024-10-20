import {
  auth,
  signInWithEmailAndPassword,
  getFirestore,
  query,
  where,
  collection,
  getDocs
} from './firebase.js';

document.getElementById('sign_in').addEventListener('click', function (event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const firestoreDb = getFirestore();

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
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          alert("Has iniciado sesión con exito");
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
