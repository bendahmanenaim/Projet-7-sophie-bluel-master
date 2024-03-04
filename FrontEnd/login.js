//Constantes
const BASE_URL = "http://localhost:5678/api/"
const USERS_API = BASE_URL+"users/login";
const LOGIN_BUTTON = document.getElementById("se_connecter")


// Ajout d'un évenement au clic pour se connecter            
LOGIN_BUTTON.addEventListener("click", function() {
    loginUser();
});

async function loginUser() {
    // Récuperation e-mail et mot de passe                  
    let user = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    }; 
    // Faire une requête API pour obtenir les informations de connexion
    
    try {
        const response = await fetch(USERS_API , {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(user)
        });

        const data = await response.json();

        if (response.status===200) {
            // Connexion réussie
            document.getElementById("login_error").innerText = "Connexion réussie!";
              // Stockage du token dans le session storage 
              sessionStorage.setItem("token", data.token);

              // Redirection vers la page d'accueil 
              window.location.href = "index.html";
        } else {
            // Connexion échouée
            document.getElementById("login_error").innerText = data.message || "Erreur dans l’identifiant ou le mot de passe";
        }
    } catch (error) {
        console.error("Erreur lors de la requête:", error);
        document.getElementById("login_error").innerText = "Erreur dans l’identifiant ou le mot de passe";
    }
}


