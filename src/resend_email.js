import { auth, sendEmailVerification } from "./firebase";

document.getElementById('resend_verification').addEventListener('click', function (event) {
    event.preventDefault();
    const user = auth.currentUser;
    if (user) {
        if (!user.emailVerified) {
            sendEmailVerification(user)
                .then(() => {
                    alert('Correo de verificación reenviado. Por favor revisa tu bandeja de entrada.');
                })
                .catch((error) => {
                    alert('Hubo un error al intentar reenviar el correo: ' + error.message);
                });
        } else {
            alert('Tu correo ya está verificado. No necesitas reenviar la verificación.');
        }
    } else {
        alert('No hay ningún usuario autenticado.');
    }
});
