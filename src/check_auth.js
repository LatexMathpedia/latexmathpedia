import { auth, onAuthStateChanged } from "./firebase.js";

async function checkEmailVerification(user) {
    await user.reload()
    if (user.emailVerified) {
        console.log("Email verificado");
        window.location.href = 'index.html';
    } else {
        console.log("Email no verificado");
    }
}

onAuthStateChanged(auth, (user) => {
    console.log("onAuthStateChanged detectado");

    if (user) {
        const currentPage = window.location.pathname.split('/').pop();

        if (user.emailVerified) {
            console.log("Email verificado");
            if (currentPage === 'verificar_email.html') {
                window.location.href = 'index.html';
            }
        } else {
            console.log("Email no verificado");
            if (currentPage !== 'verificar_email.html') {
                window.location.href = 'verificar_email.html';
            } else {
                const interval = setInterval(async () => {
                    await checkEmailVerification(user);
                }, 3000);
                window.addEventListener('beforeunload', () => {
                    clearInterval(interval);
                });
            }
        }
    } else {
        console.log("No hay usuario autenticado");
    }
});

