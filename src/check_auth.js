import { auth, onAuthStateChanged, signOut, getFirestore, doc, getDoc } from "./firebase.js";

const db = getFirestore();

async function checkEmailVerification(user) {
    await user.reload();
    if (user.emailVerified) {
        window.location.href = 'index.html';
    } else {
    }
}

function handleSignOut() {
    signOut(auth).then(() => {
        alert("Has deslogueado con éxito");
        window.location.href = 'sign_in.html';
    }).catch((error) => {
    });
}

function actualizarEnlace(authenticated, isVerified, displayName) {
    let enlace = document.getElementById('create_account');
    let cuenta = document.getElementById('sign_in')
    if (authenticated && isVerified) {
        if (displayName) {
            cuenta.id = 'account';
            cuenta.innerText = displayName;
            cuenta.href = 'account.html';
            cuenta.ariaLabel = 'Link para acceder a tu cuenta';
            enlace.id = 'sign_out';
            enlace.innerText = 'Cerrar sesión';
            enlace.href = '#';
            enlace.ariaLabel = 'Link que te permite cerrar la sesión';
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
        }
    } else {
        enlace.id = 'create_account';
        enlace.innerText = 'Registrarse';
        enlace.href = 'create_account.html';
        enlace.ariaLabel = 'Link que te lleva a la página para registrarse';
        cuenta.id = 'sign_in';
        cuenta.innerText = 'Iniciar sesión';
        cuenta.href = 'sign_in.html';
        cuenta.ariaLabel = 'Link que te lleva a la página de iniciar sesión';
    }
}

async function getUsername(uid) {
    try {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
            return userDoc.data().nombre;
        } else {
            return "Cuenta";
        }
    } catch (error) {
        return "Cuenta";
    }
}

document.addEventListener('DOMContentLoaded', function () {
    onAuthStateChanged(auth, async (user) => {
        const mainContainer = document.getElementById('main_container');
        if (user) {
            const currentPage = window.location.pathname.split('/').pop();
            if (user.emailVerified) {
                if (currentPage === 'verificar_email.html') {
                    window.location.href = 'index.html';
                } else {
                    if (mainContainer) mainContainer.style.display = 'flex';
                    const displayName = await getUsername(user.uid);
                    actualizarEnlace(true, true, displayName);
                }
            } else {
                if (mainContainer) mainContainer.style.display = 'none';
                if (currentPage !== 'verificar_email.html') {
                    window.location.href = 'verificar_email.html';
                } else {
                    let interval = setInterval(async () => {
                        await checkEmailVerification(user);
                    }, 3000);
                }
            }
        } else {
            if (mainContainer) mainContainer.style.display = 'none';
            actualizarEnlace(false, false);
        }
    });
});