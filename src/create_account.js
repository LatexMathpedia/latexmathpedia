import { auth } from "./firebase"; // Asegúrate de que la ruta sea correcta

// Script para crear cuenta en el sitio web
document.getElementById('create_account').addEventListener('click', function (event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!email) {
    alert("Por favor ingresa tu correo");
    return;
  }
  if (!email.endsWith('@uniovi.es')) {
    alert("Por favor ingresa un correo de UNIOVI válido");
    return;
  }
  if (!password) {
    alert("Por favor ingresa tu contraseña");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert("Cuenta creada con éxito");
      return userCredential.user.sendEmailVerification();
    })
    .then(() => {
      alert("Se ha enviado un correo de verificación.");
    })
    .catch((error) => {
      alert("Hubo un error: " + error.message);
    });
});
