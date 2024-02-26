
document.addEventListener('DOMContentLoaded', function() {
//CONSTANTES
const BASE_URL = "http://localhost:5678/api/"
const WORKS_API = BASE_URL+"works";
const CATEGORY_API = BASE_URL+"categories";

// Fonction pour récupérer les données depuis le back-end
async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        return null;
    }
}

// Fonction pour mettre à jour la galerie en fonction de la catégorie sélectionnée
async function updateGalleryByCategory(categoryId) {
    const works = await fetchData(WORKS_API);

    if (works) {
        const galleryContainer = document.getElementById('gallery');     /********** */
        if (galleryContainer) {
            galleryContainer.innerHTML = '';

              
              const displayedWorks = new Set();

            works.forEach(work => {
                // Vérification  si la catégorie correspond à celle sélectionnée
                if (work.categoryId === categoryId || categoryId === 0) {
                     // Vérification si le travail n'a pas déjà été ajouté à la galerie
                     if (!displayedWorks.has(work.id)) {
                    // Création des éléments HTML pour chaque projet et les ajoutez à la galerie
                    let figurework = document.createElement('figure');
                    let imgwork = document.createElement('img');
                    let figcaption = document.createElement('figcaption');

                    // Ajout des attributs et du contenu aux éléments créés
                    imgwork.src = work.imageUrl;
                    imgwork.alt = work.title;
                    figcaption.innerText = work.title;

                    // Ajout des  éléments à la figure et la figure à la galerie
                    figurework.appendChild(imgwork);
                    figurework.appendChild(figcaption);
                    galleryContainer.appendChild(figurework);
                    
                        // Ajout de l'identifiant du travail à l'ensemble
                        displayedWorks.add(work.id);
                     }
                }
            });
        } else {
            console.error('Element avec ID "gallery" non trouvé dans le DOM.');
        }
    }
}

// Fonction pour créer les boutons de filtre
async function createFilterButtons() {
    const categories = await fetchData(CATEGORY_API);

    if (categories) {
        const filterContainer = document.getElementById('filter');  /**********/ 
        if (filterContainer) {
            const allButton = document.createElement('button');
            allButton.innerText = 'Tous';
            allButton.classList.add('styled', 'tous-button');
            allButton.addEventListener('click', () => updateGalleryByCategory(0));
            filterContainer.appendChild(allButton);

            categories.forEach(category => {
                const categoryButton = document.createElement('button');
                categoryButton.innerText = category.name;
                categoryButton.addEventListener('click', () => updateGalleryByCategory(category.id));
                filterContainer.appendChild(categoryButton);
            });
        } else {
            console.error('Element avec ID "filter" non trouvé dans le DOM.');
        }
    }
}

// Appele la fonction pour créer les boutons de filtre
createFilterButtons();

// Appele la fonction pour mettre à jour la galerie initiale
updateGalleryByCategory(0);
});
function gestion_login() {
    const token = sessionStorage.getItem("token");
    const loginLogoutLink = document.getElementById("connexionBtn");
    const filterElement = document.getElementById("filter"); 
    const modifElement = document.getElementById("modif-galerie");
    const modeEdition = document.getElementById("edition");  

    if (filterElement && modifElement && modeEdition ) { 
    if (token) {
        // Changement du texte du bouton en "Logout"
        loginLogoutLink.textContent = "Logout";
        

        // Ajout de l'événement de déconnexion
        loginLogoutLink.addEventListener("click", function (event) {
            event.preventDefault();

            // Suppression du token du sessionStorage
            sessionStorage.removeItem("token");

            // Redirection vers la page d'accueil
            window.location.href = "index.html";
        });// Afficher ou masquer les boutons)
        filterElement.style.display = "none"; 
        modifElement.style.display = "inline-block";
        modeEdition.style.display = "block";
    } else {
        // Utilisateur déconnecté
        loginLogoutLink.textContent = "Login";

        // Masquer ou afficher les boutons)
        filterElement.style.display = "block";
        modifElement.style.display = "none"; 
        modeEdition.style.display = "none";
    }
}
else {
    console.error("Les éléments avec les IDs spécifiés n'ont pas été trouvés.");
}
}

// Appel de la fonction lors du chargement de la page
document.addEventListener("DOMContentLoaded", gestion_login);
 
//*********************************** */
