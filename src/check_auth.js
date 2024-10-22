import { auth, onAuthStateChanged } from "./firebase.js";

onAuthStateChanged(auth, async (user) => {
    console.log("onAuthStateChanged detectado");

    if (user) {
        await user.reload();
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
            }
        }
    }
});
setInterval(onAuthStateChanged, 1500)
