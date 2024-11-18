import { getFirestore, collection, query, where, getDocs } from "./firebase.js";

const firestoreDb = getFirestore();

/**
 * Función que selecciona el año de la carrera
 * @param {HTMLElement} button - Botón que se ha seleccionado
 * @param {number} year - Año de la carrera
 * 
 * @returns {Promise<void>}
 * @async
 * @function selectYear
 */
const selectYear = async (button, year) => {
    // Manejar deselección
    if (button.classList.contains('selected')) {
        button.classList.remove('selected');
        localStorage.removeItem('selectedYear');
        showAllSubjects();
        return;
    }

    // Actualizar UI
    const yearButtons = document.querySelectorAll('.year-section');
    yearButtons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    localStorage.setItem('selectedYear', year);

    try {
        // Obtener PDFs del año seleccionado
        const pdfsRef = collection(firestoreDb, 'pdfs');
        const q = query(pdfsRef, where('year', '==', year));
        const querySnapshot = await getDocs(q);

        // Crear conjunto de asignaturas que tienen PDFs
        const subjectsWithPdfs = new Set();
        querySnapshot.forEach(doc => {
            const data = doc.data();
            if (data.subject) {
                const normalizedSubject = removeAccents(data.subject.toUpperCase());
                subjectsWithPdfs.add(normalizedSubject);
            }
        });

        // Verificar si hay asignaturas
        if (subjectsWithPdfs.size === 0) {
            alert(`No hay asignaturas disponibles para el año ${year}`);
            button.classList.remove('selected');
            localStorage.removeItem('selectedYear');
            showAllSubjects();
            return;
        }

        // Mostrar/ocultar asignaturas según si tienen PDFs
        document.querySelectorAll('.section').forEach(section => {
            const subjectName = section.querySelector('.item-title').textContent;
            const normalizedName = removeAccents(subjectName);
            section.style.display = subjectsWithPdfs.has(normalizedName) ? 'block' : 'none';
            const subjectTitle = document.getElementById('subject-title');
            if (subjectTitle) {
                const yearNames = {
                    1: 'Asignaturas de primero',
                    2: 'Asignaturas de segundo',
                    3: 'Asignaturas de tercero',
                    4: 'Asignaturas de cuarto'
                };
                subjectTitle.textContent = yearNames[year] || 'Asignaturas';
            }
        });
    } catch (error) {
        console.error('Error al cargar asignaturas:', error);
        showAllSubjects();
    }
}

/**
 * Muestra todas las asignaturas y actualiza el título
 */
const showAllSubjects = ()=> {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'block';
    });
    
    // Actualizar el título cuando no hay año seleccionado
    const subjectTitle = document.getElementById('subject-title');
    if (subjectTitle) {
        subjectTitle.textContent = 'Asignaturas';
    }
}

/**
 * Función que selecciona la asignatura
 * @param {string} subject - Asignatura seleccionada
 */
export const selectSubject = (subject)=> {
    const year = localStorage.getItem('selectedYear');
    if (year) {
        window.location.href = `subject.html?year=${year}&subject=${subject}`;
    } else {
        window.location.href = `subject.html?subject=${subject}`;
    }
}

/**
 * Función para búsqueda de asignaturas
 * @param {string} searchTerm - Término de búsqueda
 */
export const searchSubjects = (searchTerm)=> {
    // Deseleccionar botones de año
    const yearButtons = document.querySelectorAll('.year-section');
    yearButtons.forEach(btn => btn.classList.remove('selected'));
    localStorage.removeItem('selectedYear');

    // Actualizar el título cuando se realiza una búsqueda
    const subjectTitle = document.getElementById('subject-title');
    if (subjectTitle) {
        subjectTitle.textContent = 'Asignaturas';
    }

    // Realizar búsqueda
    const subjects = document.querySelectorAll('.section');
    subjects.forEach(subject => {
        const title = subject.querySelector('.item-title').textContent.toLowerCase().trim();
        const normalizedTitle = removeAccents(removeSpaces(title));
        const normalizedSearch = removeAccents(removeSpaces(searchTerm.toLowerCase().trim()));
        
        if (normalizedTitle.includes(normalizedSearch)) {
            subject.style.display = 'block';
        } else {
            subject.style.display = 'none';
        }
    });
}

const removeAccents = (text) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const removeSpaces = (text) => removeAccents(text).replace(/\s/g, '');

document.addEventListener('DOMContentLoaded', () => {
    localStorage.removeItem('selectedYear');
    document.getElementById('search').addEventListener('input', (event) => {
        searchSubjects(event.target.value);
    });
});

globalThis.selectYear = selectYear;
window.selectSubject = selectSubject;