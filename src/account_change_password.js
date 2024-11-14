import { auth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "./firebase.js";

document.getElementById('change_password').addEventListener('click', function (event) {
    event.preventDefault();

    const user = auth.currentUser;  // Obtén el usuario autenticado
    if (!user) {
        alert("El usuario no está autenticado.");
        return;
    }

    const currentPassword = document.getElementById('current_password').value;
    const newPassword = document.getElementById('password').value;
    const confirmPassword = document.getElementById('repassword').value;

    if (!currentPassword || !newPassword || !confirmPassword) {
        alert("Por favor, ingrese todos los campos requeridos.");
        return;
    }
    if(newPassword.length < 6){
        alert("La contraseña debe ser de al menos 6 caracteres");
        return;
    }

    if (newPassword !== confirmPassword) {
        alert("Las contraseñas no coinciden.");
        return;
    }
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    reauthenticateWithCredential(user, credential)
        .then(() => {
            updatePassword(user, newPassword).then(() => {
                alert("Contraseña actualizada con éxito");
                window.location.reload();
            }).catch((error) => {
                alert("Error al cambiar la contraseña: " + error.message);
            });
        })
        .catch((error) => {
            alert("Error en la reautenticación: " + error.message);
        });
});
