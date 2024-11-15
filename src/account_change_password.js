import { auth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "./firebase.js";

document.getElementById('change_password').addEventListener('click', (event) => {
    event.preventDefault();

    const user = auth.currentUser;  // Obtén el usuario autenticado
    if (!user) {
        alert("El usuario no está autenticado."); //Si el usuario no está autenticado, muestra un mensaje de alerta
        return;
    }
    const currentPassword = document.getElementById('current_password').value;
    const newPassword = document.getElementById('password').value;
    const confirmPassword = document.getElementById('repassword').value;

    if (!currentPassword || !newPassword || !confirmPassword) {
        alert("Por favor, ingrese todos los campos requeridos."); //Si no se ingresan todos los campos requeridos, muestra un mensaje de alerta
        return;
    }
    if (newPassword.length < 6) {
        alert("La contraseña debe ser de al menos 6 caracteres"); //Si la contraseña es menor a 6 caracteres, muestra un mensaje de alerta
        return;
    }

    if (newPassword !== confirmPassword) {
        alert("Las contraseñas no coinciden."); //Si las contraseñas no coinciden, muestra un mensaje de alerta
        return;
    }
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    reauthenticateWithCredential(user, credential)
        .then(() => {
            updatePassword(user, newPassword).then(() => {
                alert("Contraseña actualizada con éxito");  //Si la contraseña se actualiza correctamente, muestra un mensaje de alerta
                window.location.reload();
            }).catch((error) => {
                alert("Error al cambiar la contraseña: " + error.message); //Si hay un error al cambiar la contraseña, muestra un mensaje de alerta
            });
        })
        .catch((error) => {
            alert("Error en la reautenticación: " + error.message); //Si hay un error en la reautenticación, muestra un mensaje de alerta
        });
});
