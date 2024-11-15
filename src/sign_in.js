import {
  auth,
  signInWithEmailAndPassword,
  getFirestore,
  query,
  where,
  collection,
  getDocs,
  onAuthStateChanged
} from './firebase.js';

/**
 * Evento del boton sign in.
 * Alerta al usuario si no rellena email o contraseña.
 * Cuando se inicia sesión con éxito, se envia a index.html.
 * 
 * @listens click
 */
document.getElementById('sign_in').addEventListener('click', function (event) {
  event.preventDefault();
  const email = document.getElementById('email').value.toLowerCase();
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

onAuthStateChanged(auth, async (user) => {
  if (user) {
    await user.reload();
    if (user.emailVerified) {
      window.location.href = 'index.html';
    } else {
      window.location.href = 'verificar_email.html';
    }
  }
});


