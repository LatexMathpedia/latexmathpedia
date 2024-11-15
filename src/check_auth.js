import { auth, onAuthStateChanged, signOut, getFirestore, doc, getDoc } from "./firebase.js";

const db = getFirestore(); //Inicializa la database de firestore

/**
 * Función que comprueba si el email del usuario ha sido verificado o no.
 * Si ha sido verificado, redirige al usuario a la página principal.
 * 
 * @param {Object} user
 * @returns {Promise<void>}
 * 
 * @async
 * @function checkEmailVerification
 */
const checkEmailVerification = async (user) => {
    await user.reload();
    if (user.emailVerified) {
        window.location.href = 'index.html';
    }
}


/**
 * Funcion que desloguea al usuario y le avisa si no hubo problemas en el proceso
 * 
 * @returns {void}
 * 
 * @function handleSignOut
 */
const handleSignOut = () => {
    signOut(auth).then(() => {
        alert("Has deslogueado con éxito");
        window.location.href = 'sign_in.html';
    }).catch((error) => {
        alert("Ha habido un error al desloguear: " + error.message);
    });
}

/**
 * Función que actualiza los enlaces del header.
 * Cambia el crear cuenta por cerrar sesión.
 * Cambia el iniciar sesión por el perfil del usuario.
 * 
 * @param {boolean} authenticated 
 * @param {boolean} isVerified 
 * @param {String} [displayName]
 * 
 * @returns {Promise<void>}
 * 
 * @function actualizarEnlace
 */
const actualizarEnlace = (authenticated, isVerified, displayName) => {
    let enlace = document.getElementById('create_account'); //Obitiene la etiqueta enlace del hmtl
    let cuenta = document.getElementById('sign_in'); //Obitiene la etiquieta cuenta del html
    if (authenticated && isVerified) { //Si está verificado y tiene iniciada la sesión, hace el cambio
        if (displayName) {
            //Cambia el enlace de crear cuenta por cerrar sesión y el de iniciar sesión por el perfil del usuario
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
            enlace.addEventListener('click', (event) => {
                event.preventDefault();
                if (auth.currentUser) {
                    handleSignOut();
                } else {
                    alert("No hay ninguna cuenta en sesión.");
                }
            });
        }
    } else {
        //Si no está verificado o no tiene iniciada la sesión, cambia el enlace de cerrar sesión por crear cuenta y el de perfil por iniciar sesión
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

/**
 * Función que obtiene el nombre del usuario loggeado
 * 
 * @param {String} uid 
 * 
 * @returns {Promise<String>} nombre del usuario loggeado
 * 
 * @async
 * @function getUsername
 */
const getUsername = async (uid) => {
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

/**
 * Hace los cambios pertinentes cuando se entra en cualquier página que tenga este script
 *
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', function () {
    const currentPage = window.location.pathname.split('/').pop();
    onAuthStateChanged(auth, async (user) => {
        if (currentPage === 'index.html') {
            if (user) {
                const displayName = user.emailVerified ? await getUsername(user.uid) : "Cuenta";
                actualizarEnlace(true, user.emailVerified, displayName);
            } else {
                actualizarEnlace(false, false);
            }
        } else {
            if (user) {
                if (user.emailVerified) {
                    if (currentPage === 'verificar_email.html') {
                        window.location.href = 'index.html';
                    } else {
                        const displayName = await getUsername(user.uid);
                        actualizarEnlace(true, true, displayName);
                    }
                } else {
                    if (currentPage !== 'verificar_email.html') {
                        window.location.href = 'verificar_email.html';
                    } else {
                        let interval = setInterval(async () => {
                            await checkEmailVerification(user);
                        }, 1500);
                    }
                }
            } else {
                actualizarEnlace(false, false);
            }
        }
    });
});
