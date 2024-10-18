// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCBWnK5WsDsJw-byDy6FpPzh_lBOUIeicw",
  authDomain: "mathtexpedia.firebaseapp.com",
  projectId: "mathtexpedia",
  storageBucket: "mathtexpedia.appspot.com",
  messagingSenderId: "1051913187424",
  appId: "1:1051913187424:web:e55eb4a9d779da3290d305",
  measurementId: "G-4KF8ZJB6VD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

//Inputs
const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

const submit = document.getElementById("loginButton");
submit.addEventListener("click",function (event) {
    event.preventDefault();
    const auth = getAuth();
createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    alert("Creando la cuenta...")
    // ..
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage);
    // ..
  });
})