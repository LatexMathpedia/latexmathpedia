import { auth, onAuthStateChanged, signOut } from "./firebase.js";

async function checkEmailVerification(user) {
    await user.reload();
    if (user.emailVerified) {
        console.log("Email verificado");
        window.location.href = 'index.html';
    } else {
        console.log("Email no verificado");
    }
}

function handleSignOut() {
    signOut(auth).then(() => {
        alert("Has deslogueado con éxito");
        window.location.href = 'sign_in.html';
    }).catch((error) => {
        console.log("Un error ha ocurrido", error);
    });
}

function actualizarEnlace(authenticated, isVerified) {
    let enlace = document.getElementById('create_account');

    if (authenticated && isVerified) {
        enlace.id = 'sign_out';
        enlace.innerText = 'Cerrar sesión';
        enlace.href = '#';
        enlace.replaceWith(enlace.cloneNode(true));
        enlace = document.getElementById('sign_out');
        enlace.addEventListener('click', function (event) {
            event.preventDefault();
            if (auth.currentUser) {
                handleSignOut();
            } else {
                alert("No hay ninguna cuenta en sesión.");
            }
        });
    } else {
        enlace.id = 'create_account';
        enlace.innerText = 'Registrarse';
        enlace.href = 'create_account.html';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    onAuthStateChanged(auth, (user) => {
        console.log("onAuthStateChanged detectado");
        if (user) {
            const currentPage = window.location.pathname.split('/').pop();

            if (user.emailVerified) {
                console.log("Email verificado");

                if (currentPage === 'verificar_email.html') {
                    window.location.href = 'index.html';
                } else if (currentPage === 'index.html') {
                    actualizarEnlace(true, true);
                }
            } else {
                console.log("Email no verificado");
                if (currentPage !== 'verificar_email.html') {
                    window.location.href = 'verificar_email.html';
                } else {
                    let interval = setInterval(async () => {
                        await checkEmailVerification(user);
                    }, 3000);
                }
            }
        } else {
            actualizarEnlace(false, false);
        }
    });
});
