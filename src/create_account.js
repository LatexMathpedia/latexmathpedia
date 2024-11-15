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

/**
 * Evento del botón create account, que intenta crear un nuevo usuario con la información
 * que el usuario proporciono.
 * Si no rellenó algún campo, se le avisa al usuario.
 * Si las contraseñas no coinciden, se le avisa al usuario.
 * Si el email ya está registrado, se le avisa al usuario.
 */
document.getElementById('create_account').addEventListener('click', function (event) {
  event.preventDefault();

  const email = document.getElementById('email').value.toLowerCase();
  const name = document.getElementById('name').value;
  const surname = document.getElementById('surname').value;
  const password = document.getElementById('password').value;
  const rePassword = document.getElementById('repassword').value;
  const firestoreDb = getFirestore();

  const emailPattern = new RegExp('^[a-zA-Z0-9._%+-]+@uniovi.es$');
  const nameRegex = new RegExp('^[^\s]{1,150}$');

  if (!email) {
    alert("Por favor ingresa tu correo");
    return;
  }
  if (!email.match(emailPattern)) {
    alert("Por favor ingresa un correo de UNIOVI válido");
    return;
  }
  if (!password) {
    alert("Por favor ingresa tu contraseña");
    return;
  }
  if (!rePassword) {
    alert("Por favor ingresa de nuevo tu contraseña");
    return;
  }
  if (!name) {
    alert("Por favor ingresa un nombre");
    return;
  }
  if (!name.match(nameRegex)) {
    alert("Por favor, ingrese un nombre válido sin espacios y con una longitud entre 1 y 150 caracteres.");
    return;
  }
  if (!surname) {
    alert("Por favor ingresa tus apellidos");
    return;
  }
  if (surname.length > 255) {
    alert("El apellido es demasiado largo");
    return;
  }
  if (password !== rePassword) {
    alert("Las contraseñas no coinciden");
    return;
  }
  if (password.length < 6) {
    alert("La contraseña tiene que tener al menos 6 carácteres");
    return;
  }
  const usersCollection = collection(firestoreDb, "users");
  const emailQuery = query(usersCollection, where("email", "==", email));
  getDocs(emailQuery).then((querySnapshot) => {
    if (!querySnapshot.empty) {
      alert("Email ya registrado, no se puede crear cuenta");
      window.location.href = 'sign_in.html';
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          const userData = {
            email: email,
            nombre: name,
            apellidos: surname,
            admin: false,
          };

          alert("Cuenta creada con éxito. Se ha enviado correo de verificación.");

          try {
            const docRef = doc(firestoreDb, 'users', userCredential.user.uid);
            await setDoc(docRef, userData);
          } catch (error) {
            alert("Hubo un error al guardar los datos: " + error.message);
            return;
          }

          await sendEmailVerification(userCredential.user);

          setTimeout(() => {
            window.location.href = 'verificar_email.html';
          }, 1000);
        })
        .catch((error) => {
          alert("Hubo un error: " + error.message);
        });
    }
  }).catch((error) => {
    alert("Hubo un error: " + error.message);
  });
});
