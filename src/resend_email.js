import { auth, sendEmailVerification } from "./firebase";

/**
 * Evento del botón para reenviar el correo de verificación.
 * 
 * @listens click
 */
document.getElementById('resend_verification').addEventListener('click', function (event) {
    event.preventDefault();
    const user = auth.currentUser;
    if (user) {
        if (!user.emailVerified) {
            sendEmailVerification(user)
                .then(() => {
                    alert('Correo de verificación reenviado. Por favor revisa tu bandeja de entrada.'); // Alerta de correo reenviado
                })
                .catch((error) => {
                    alert('Hubo un error al intentar reenviar el correo: ' + error.message); // Alerta de error al reenviar correo
                });
        } else {
            alert('Tu correo ya está verificado. No necesitas reenviar la verificación.'); // Alerta de correo ya verificado
        }
    } else {
        alert('No hay ningún usuario autenticado.'); // Alerta de usuario no autenticado
    }
});
