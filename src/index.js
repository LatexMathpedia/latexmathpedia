import './firebase.js';
import './create_account.js';
import { getStorage, ref, getDownloadURL } from './firebase.js';

const storage = getStorage();
const fileRef = ref(storage, 'Apuntes_TOPOLOGIA1_tema_1.pdf');

getDownloadURL(fileRef)
    .then((url) => {
        // Puedes usar la URL como src de un iframe o un enlace de descarga
        console.log('URL de descarga:', url);

        const iframe = document.createElement('iframe');
        iframe.src = url;
        console.log("Pdf creado con exito");
        iframe.width = '680';
        iframe.height = '400';

        iframe.style.border = 'none';

        document.getElementById('pdfReader').appendChild(iframe);
    })
    .catch((error) => {
        console.error("Error al obtener la URL de descarga:", error);
    });

