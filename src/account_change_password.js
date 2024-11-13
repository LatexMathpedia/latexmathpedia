import { auth, updatePassword } from "./firebase.js";

/**
 * Evento del boton para cambiar la contraseña
 */
document.getElementById('change_password').addEventListener('click', function (event) {
    event.preventDefault();
    const user = auth.currentUser;
    const password = document.getElementById('password').value;
    const rePassword = document.getElementById('repassword').value;
    if (!password) {
        alert("Tienes que rellenar la contraseña que vas a utilizar");
        return;
    }
    if (!rePassword) {
        alert("Tienes que confirmar la contraseña");
        return;
    }
    if (password !== rePassword) {
        alert("Las contraseñas no coinciden");
        return;
    }
    updatePassword(user, newPassword).then(() => {
        alert("Has cambiado la contraseña con éxito");
    }).catch((error) => {
        alert("Algo ha salido mal.\nIntenta contactarnos por nuestras redes sociales o por el correo.");
    });

});