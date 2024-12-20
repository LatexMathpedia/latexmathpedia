import {
    getFirestore,
    query,
    where,
    collection,
    getDocs,
    auth,
    onAuthStateChanged
} from "./firebase.js";

/**
 * Método que obtiene los pdfs en la base de datos por su año, materia o ambos.
 * 
 * @param {String} [subject]
 * @param {Number} [year]
 * @returns {Promise<String[]>} pdfsList
 * 
 * @async
 * @function loadPdfs
 */
async function loadPdfs(subject, year) {
    const firestoreDb = getFirestore();
    const pdfsCollection = collection(firestoreDb, "pdfs");
    let pdfQuery;
    if (subject && year) {
        pdfQuery = query(pdfsCollection, where("subject", "==", subject), where("year", "==", year));
    } else if (subject) {
        pdfQuery = query(pdfsCollection, where("subject", "==", subject));
    } else if (year) {
        pdfQuery = query(pdfsCollection, where("year", "==", year));
    } else {
        return [];
    }
    try {
        const querySnapshot = await getDocs(pdfQuery);
        const pdfs = [];
        querySnapshot.forEach((doc) => {
            pdfs.push({
                ...doc.data(),
            });
        });
        return pdfs;
    } catch (error) {
        return [];
    }
}


/**
 * Crea la lista con los links de los pdfs sacados anteriormente
 * 
 * @param {String} subject 
 * @param {Number} year
 * @param {String} [searchTerm]
 * 
 * @returns {Promise<void>}
 * 
 * @async
 * @function createPdfList 
 */
const createPdfList = async (subject, year, searchTerm = "") => {
    const pdfs = await loadPdfs(subject, year);
    const listContainer = document.getElementById("pdfsList");
    listContainer.innerHTML = "";
    if (pdfs.length === 0) {
        alert("Página vacía\nDe momento no hay nada aquí oh");
        return;
    }
    pdfs.sort((a, b) => a.name.localeCompare(b.name));
    pdfs.forEach((pdf) => {
        const name = removeSpaces(pdf.name.toLowerCase().trim());
        const search = removeSpaces(searchTerm.toLowerCase().trim());
        if (name.includes(search)) {
            const listItem = document.createElement("p");
            const link = document.createElement("a");
            link.href = pdf.href;
            link.textContent = pdf.name;
            link.target = "_blank";
            link.className = "pItem";
            listItem.appendChild(link);
            listContainer.appendChild(listItem);
        }
    });
}

/**
 * Método que elimina los espacios de un texto.
 * 
 * @param {String} text 
 * @returns {String} text sin espacios
 * 
 * @function removeSpaces
 */
const removeSpaces = (text) => {
    if (typeof text !== 'string') {
        return '';
    }
    return removesAccents(text).replace(/[\s_\/-]+/g, '');
}

/**
 * Método que elimina los acentos de un texto.
 * 
 * @param {String} text 
 * @returns {String} text sin acentos
 */
const removesAccents = (text) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Eventos de la página
 * 
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {
    /**
     * Evento que se activa cuando el usuario escribe en el input de búsqueda.
     * 
     * @listens input
     */
    document.getElementById('search').addEventListener('input', async (event) => {
        const searchTerm = event.target.value;
        const urlParams = new URLSearchParams(window.location.search);
        const subject = urlParams.get('subject');
        const year = parseInt(urlParams.get('year'), 10);

        createPdfList(subject, year, searchTerm);
    });

    /**
     * Evento de la página cuando se carga, que crea una lista con los links de los pdfs.
     * Si el usuario no tiene la sesión iniciada, no hace nada.
     * 
     * @event window.onload
     */
    window.onload = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const subject = urlParams.get("subject");
        const year = parseInt(urlParams.get("year"), 10);

        if (!subject && isNaN(year)) {
            alert("Página vacía\nDe momento no hay nada aquí oh"); // Avisar al usuario que no hay nada en la página
            return;
        }

        onAuthStateChanged(auth, async (user) => {
            if (user) {
                await createPdfList(subject, !isNaN(year) ? year : null);
            } else {
                alert("Debes iniciar sesión para ver esta página."); // Avisar al usuario que debe iniciar sesión
                window.location.href = "sign_in.html";
            }
        });
    };
});

