import {
  auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  getFirestore,
  doc,
  setDoc,
  query,
  where,
  collection,
  getDocs,
} from "./firebase.js";

document.getElementById('create_account').addEventListener('click', function (event) {
  event.preventDefault();

  const email = document.getElementById('email').value.toLowerCase();
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
  const usersCollection = collection(firestoreDb, "users");
  const emailQuery = query(usersCollection, where("email", "==", email));

  getDocs(emailQuery).then((querySnapshot) => {
    if (!querySnapshot.empty) {
      alert("Email ya registrado, no se puede crear cuenta");
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          const userData = {
            email: email
          };

          alert("Cuenta creada con éxito. Se ha enviado correo de verificación.");

          try {
            const docRef = doc(firestoreDb, 'users', userCredential.user.uid);
            await setDoc(docRef, userData);
            console.log("Usuario registrado y datos guardados en Firestore.");
          } catch (error) {
            console.error("Error guardando datos en Firestore: ", error);
            alert("Hubo un error al guardar los datos: " + error.message);
            return;
          }

          await sendEmailVerification(userCredential.user);

          setTimeout(() => {
            console.log("Todo listo, redirigiendo a verificar_email.html");
            window.location.href = 'verificar_email.html';
          }, 1500);
        })
        .catch((error) => {
          alert("Hubo un error: " + error.message);
        });
    }
  }).catch((error) => {
    console.error("Error verificando el correo: ", error);
  });
});
