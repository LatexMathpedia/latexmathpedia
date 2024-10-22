import { auth, onAuthStateChanged } from "./firebase.js";

onAuthStateChanged(auth, async (user) => {
    console.log("onAuthStateChanged detectado");
    if (user) {
        await user.reload();
        if (user.emailVerified) {
            console.log("Email verificado, no pasa nada")
        } else {
            window.location.href = 'verificar_email.html';
        }
    }
});