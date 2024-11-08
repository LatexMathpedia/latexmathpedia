import {
    getFirestore,
    query,
    where,
    collection,
    getDocs,
    auth,
    onAuthStateChanged
} from "./firebase.js";

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

async function createPdfList(subject, year) {
    const pdfs = await loadPdfs(subject, year);
    const listContainer = document.getElementById("pdfsList");
    listContainer.innerHTML = "";
    if (pdfs.length === 0) {
        alert("Página vacía\nDe momento no hay nada aquí oh");
        return;
    }
    pdfs.sort((a, b) => a.name.localeCompare(b.name));
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
    const year = parseInt(urlParams.get("year"), 10);

    if (!subject && isNaN(year)) {
        alert("Página vacía\nDe momento no hay nada aquí oh");
        return;
    }

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            await createPdfList(subject, !isNaN(year) ? year : null);
        } else {
            alert("Debes iniciar sesión para ver esta página.");
            window.location.href = "sign_in.html";
        }
    });
};
