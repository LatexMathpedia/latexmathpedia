import { auth, sendPasswordResetEmail, RecaptchaVerifier } from "./firebase.js";

// Asegúrate de que el contenedor de reCAPTCHA existe en el DOM
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa el reCAPTCHA
    const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);

    document.getElementById('reset_password').addEventListener('click', async function(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;

        // Renderiza el reCAPTCHA
        recaptchaVerifier.render().then(function(widgetId) {
            recaptchaVerifier.verify().then(async function() {
                try {
                    await sendPasswordResetEmail(auth, email);
                    alert("Correo enviado");
                    window.location.href = 'sign_in.html';
                } catch (error) {
                    alert("Ha habido un error " + error.message);
                }
            }).catch(function(error) {
                alert("Error en la verificación de reCAPTCHA: " + error.message);
            });
        });
    });
});
