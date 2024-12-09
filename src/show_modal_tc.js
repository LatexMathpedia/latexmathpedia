import { setCookie, checkCookie, getCookie } from "./cookies.js";
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById("tCModal");
    const closeBtn = document.getElementsByClassName("close")[0];

    if (modal && closeBtn) {
        if (!checkCookie("modalTC")) {
            modal.style.display = "block";
            setCookie("modalTC", "accepted", 30);
        }

        console.log(getCookie("modalTC"));

        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });

        window.addEventListener("click", (event) => {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        });
    } else {
        console.error("Modal or close button not found in the DOM.");
    }
});

