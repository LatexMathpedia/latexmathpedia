import { auth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "./firebase.js";

document.getElementById('change_password').addEventListener('click', function (event) {
    event.preventDefault();

    const user = auth.currentUser;  // Obtén el usuario autenticado
    if (!user) {
        alert("El usuario no está autenticado.");
        return;
    }

    const currentPassword = document.getElementById('current_password').value;  // Contraseña actual
    const newPassword = document.getElementById('password').value;  // Nueva contraseña
    const confirmPassword = document.getElementById('repassword').value;  // Confirmación de nueva contraseña

    if (!currentPassword || !newPassword || !confirmPassword) {
        alert("Por favor, ingrese todos los campos requeridos.");
        return;
    }

    if (newPassword !== confirmPassword) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    // Crea las credenciales de reautenticación
    const credential = EmailAuthProvider.credential(user.email, currentPassword);

    // Reautenticación con las credenciales actuales
    reauthenticateWithCredential(user, credential)
        .then(() => {
            // Si la reautenticación es exitosa, actualiza la contraseña
            updatePassword(user, newPassword).then(() => {
                alert("Contraseña actualizada con éxito");
                window.location.reload();  // Recarga la página o realiza una acción posterior
            }).catch((error) => {
                alert("Error al cambiar la contraseña: " + error.message);
            });
        })
        .catch((error) => {
            alert("Error en la reautenticación: " + error.message);
        });
});
