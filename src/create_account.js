import { auth, createUserWithEmailAndPassword, sendEmailVerification, getFirestore, doc, setDoc } from "./firebase"; // Asegúrate de que la ruta sea correcta

const button = document.getElementById('create_account')

if (!button.dataset.listener) {
  button.addEventListener('click', function (event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const firestoreDb = getFirestore();

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

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const userData = {
          email: email
        };
        alert("Cuenta creada con éxito. Se ha enviado correo de verificación.");
        await sendEmailVerification(userCredential.user);
        const docRef = doc(firestoreDb, 'users', userCredential.user.uid);
        await setDoc(docRef, userData);
      })
      .catch((error) => {
        alert("Hubo un error: " + error.message);
      });
  });
  button.dataset.listener = true;
}
