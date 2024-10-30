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
    } else {
        enlace.id = 'create_account';
        enlace.innerText = 'Registrarse';
        enlace.href = 'create_account.html';
        enlace.ariaLabel = 'Link que te lleva a la página para registrarse';
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
                    // const url = process.env.TOPOLOGIA_1;

                    // const pdfContainer = document.getElementById('pdfCanvas');

                    // const loadingTask = pdfjsLib.getDocument(url);
                    // loadingTask.promise.then(function (pdf) {
                    //     const numPages = pdf.numPages;
                    //     console.log('Número total de páginas: ' + numPages);

                    //     for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                    //         pdf.getPage(pageNum).then(function (page) {
                    //             const viewport = page.getViewport({ scale: 1.5 });

                    //             const canvas = document.createElement('canvas');
                    //             const context = canvas.getContext('2d');
                    //             canvas.className = 'page';
                    //             canvas.height = viewport.height;
                    //             canvas.width = viewport.width;

                    //             const renderContext = {
                    //                 canvasContext: context,
                    //                 viewport: viewport
                    //             };
                    //             page.render(renderContext);

                    //             pdfContainer.appendChild(canvas);
                    //         });
                    //     }
                    // }).catch(function (error) {
                    //     console.error('Error al cargar el PDF:', error);
                    // });

                    // // Prevenir clic derecho en el contenedor del PDF
                    // pdfContainer.addEventListener('contextmenu', function (event) {
                    //     event.preventDefault();
                    // });

                    // // Prevenir combinaciones de teclas como Ctrl + S o Ctrl + P
                    // document.addEventListener('keydown', function (e) {
                    //     if (e.ctrlKey && (e.key === 's' || e.key === 'p')) {
                    //         e.preventDefault();
                    //     }
                    // });
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
