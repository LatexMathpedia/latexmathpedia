import {
    getFirestore,
    query,
    where,
    collection,
    getDocs,
    auth,
    onAuthStateChanged
} from "./firebase.js";

async function loadPdfSubject(subject) {
    const firestoreDb = getFirestore();
    const pdfsCollection = collection(firestoreDb, "pdfs");
    const subjectQuery = query(pdfsCollection, where("subject", "==", subject));
    try {
        const querySnapshot = await getDocs(subjectQuery);
        const pdfs = [];
        querySnapshot.forEach((doc) => {
            pdfs.push({
                ...doc.data(),
            });
        });
        return pdfs;
    } catch (error) {
    }
}

async function createPdfList(subject) {
    const pdfs = await loadPdfSubject(subject);
    const listContainer = document.getElementById("pdfsList");
    listContainer.innerHTML = "";
    pdfs.forEach((pdf) => {
        const listItem = document.createElement("p");
        const link = document.createElement("a");
        link.href = pdf.href;
        link.textContent = pdf.name;
        link.target = "_blank";
        link.className = "pItem";
        listItem.appendChild(link);
        listContainer.appendChild(listItem);
    });
}

window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const subject = urlParams.get("subject");
    if (!subject) {
        alert("Página vacía\nDe momento no hay nada aquí oh");
        return;
    }
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            createPdfList(subject);
        } else {
            alert("Debes iniciar sesión para ver esta página.");
            window.location.href = "sign_in.html";
        }
    });
};

