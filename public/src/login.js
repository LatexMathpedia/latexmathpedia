const auth = firebase.auth();

//Script para crear cuenta en el sitio web
document.getElementById().addEventListener('click', function (event) {
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

  auth.signInUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
    })
    .catch((error) => {
      alert("Hubo un error: " + error.message);
    });
});
