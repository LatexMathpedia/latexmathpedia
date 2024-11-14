/**
 * Firebase authentication imports for password reset functionality
 * @module reset_password
 */
import { auth, sendPasswordResetEmail, RecaptchaVerifier } from "./firebase.js";

/**
 * Initializes the password reset functionality when DOM content is loaded
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', function () {
    let recaptchaVerifier;

    // Deshabilitar el botón inicialmente
    document.getElementById('reset_password').disabled = true;

    /**
     * Initialize reCAPTCHA verifier with callbacks
     * @type {RecaptchaVerifier}
     */
    recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'normal',
        callback: () => {
            document.getElementById('reset_password').disabled = false;
        },
        'expired-callback': () => {
            document.getElementById('reset_password').disabled = true;
        }
    });

    recaptchaVerifier.render();

    /**
     * Validates if the email has the correct uniovi.es domain format
     * @param {string} email - The email address to validate
     * @returns {boolean} True if email is valid, false otherwise
     */
    function validateEmail(email) {
        return email && email.match(/^[^\s@]+@uniovi\.es$/);
    }

    /**
     * Handles the password reset process
     * @param {string} email - The email address for password reset
     * @throws {Error} If email is invalid or reset process fails
     * @returns {Promise<void>} 
     */
    async function handlePasswordReset(email) {
        if (!validateEmail(email)) {
            throw new Error('Email inválido');
        }

        try {
            await sendPasswordResetEmail(auth, email);
            alert("Se ha enviado un correo de recuperación");
            window.location.href = 'sign_in.html';
        } catch (error) {
            throw new Error(`Error al enviar el correo: ${error.message}`);
        }
    }

    /**
     * Event listener for the password reset button
     * @listens click
     */
    document.getElementById('reset_password').addEventListener('click', async function (event) {
        event.preventDefault();

        try {
            const email = document.getElementById('email').value.trim();

            // Initializes reCAPTCHA verifier if it's not already initialized
            if (!recaptchaVerifier) {
                recaptchaVerifier = new RecaptchaVerifier('recaptcha-container',
                    {
                        size: 'normal',
                        callback: () => {
                            // Enables the reset password button when reCAPTCHA is solved
                            document.getElementById('reset_password').disabled = false;
                        },
                        'expired-callback': () => {
                            // Cleans up reCAPTCHA verifier if an error occurs
                            recaptchaVerifier.clear();
                            recaptchaVerifier = null;
                        }
                    }
                    , auth);
                await recaptchaVerifier.render();
            }

            await recaptchaVerifier.verify();
            await handlePasswordReset(email);

        } catch (error) {
            alert(error.message);
            // Cleans up reCAPTCHA verifier if an error occurs
            if (recaptchaVerifier) {
                recaptchaVerifier.clear();
                recaptchaVerifier = null;
            }
            window.location.reload();
        }
    });
});
