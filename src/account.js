import { auth,onAuthStateChanged } from "firebase.js";

/**
 * Hace los cambios pertinentes cuando se entra en cualquier página que tenga este script
 */
document.addEventListener('DOMContentLoaded', function () {
    onAuthStateChanged(auth, async (user) => {
            if (user) {
                if (user.emailVerified) {
                    return;
                } else {
                    if (currentPage !== 'verificar_email.html') {
                        window.location.href = 'verificar_email.html';
                    } else {
                        let interval = setInterval(async () => {
                            await checkEmailVerification(user);
                        }, 3000);
                    }
                }
            } else {
                window.location.href = 'sign_in.html';
            }
    });
});