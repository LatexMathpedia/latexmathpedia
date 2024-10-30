import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";

const firestoreDb = getFirestore();

async function loadPdfSubject(subject) {
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
        console.error("Error loading PDFs:", error);
    }
}

async function createPdfList(subject) {
    const pdfs = await loadPdfSubject(subject);
    
    const listContainer = document.getElementById("pdfsList");

    listContainer.innerHTML = "";

    pdfs.forEach((pdf) => {
        const listItem = document.createElement("li");
        const link = document.createElement("a");
        
        link.href = pdf.href; 
        link.textContent = '${pdf.name}';
        link.target = "_blank";
        
        listItem.appendChild(link);
        listContainer.appendChild(listItem);
    });
}

window.onload = () =>{
    createPdfList("Análisis 1");
}
