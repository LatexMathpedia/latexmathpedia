import { auth, signOut, onAuthStateChanged } from "./firebase.js";

document.getElementById('sign_out').addEventListener('click', function(event) {
  event.preventDefault();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      signOut(auth).then(() => {
        alert("Has deslogueado con éxito");
      }).catch((error) => {
        console.log("Un error ha ocurrido", error);
      });
    } else {
      alert("No hay ninguna cuenta en sesión.");
    }
  });
});

