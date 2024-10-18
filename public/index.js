// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCBWnK5WsDsJw-byDy6FpPzh_lBOUIeicw",
  authDomain: "mathtexpedia.firebaseapp.com",
  projectId: "mathtexpedia",
  storageBucket: "mathtexpedia.appspot.com",
  messagingSenderId: "1051913187424",
  appId: "1:1051913187424:web:e55eb4a9d779da3290d305",
  measurementId: "G-4KF8ZJB6VD"
};

// Aquí se asume que Firebase ya está inicializado en el archivo init.js
const auth = firebase.auth(); // Acceder a la autenticación de Firebase

document.getElementById('submit').addEventListener('click', function (event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!email) {
    alert("Por favor ingresa tu correo");
    return;
  }
  if (!password) {
    alert("Por favor ingresa tu contraseña");
    return;
  }

  // Crear usuario con Firebase Auth usando el objeto global `firebase`
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert("Cuenta creada con éxito");
    })
    .catch((error) => {
      alert("Hubo un error: " + error.message);
    });
});
