// CONSTANTES
const GALLERY_MODALE = document.querySelector(".modal-gallery");
const BUTTON_CLOSE = document.querySelector('.js-modal-close-1');
const MODALE_WRAPPER = document.querySelector(".modal-wrapper");
const BUTTON_MODIF_WORKS = document.querySelector('#modif-galerie');
const BASE_URL = "http://localhost:5678/api/";
const WORKS_API = BASE_URL + "works";

let modal = null;
document.addEventListener('DOMContentLoaded', function () {


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
        const galleryContainer = document.getElementById('gallery');
        if (galleryContainer) {
            galleryContainer.innerHTML = '';

            works.forEach(work => {
                if (work.categoryId === categoryId || categoryId === 0) {
                    createWorkElement(work, galleryContainer);
                }
            });
        } else {
            console.error('Element avec ID "gallery" non trouvé dans le DOM.');
        }
    }
}
// Fonction ouverture boite modale 
const OPEN_MODAL = async function (e) {
    e.preventDefault();
    modal = document.querySelector("#modal1");
    modal.style.display = null;
    modal.addEventListener('click', CLOSE_MODAL);
    BUTTON_CLOSE.addEventListener('click', CLOSE_MODAL);
    MODALE_WRAPPER.style.display = "flex";

    const galleryContainer = document.getElementById('gallery');
    const modalGalleryContainer = GALLERY_MODALE;

    if (galleryContainer && modalGalleryContainer) {
        modalGalleryContainer.innerHTML = ''; // Clear modal content before copying

        const works = await fetchData(WORKS_API);

        if (works) {
            works.forEach(work => {
                if (work.categoryId === getCurrentSelectedCategoryId() || getCurrentSelectedCategoryId() === 0) {
                    createWorkElement(work, modalGalleryContainer, true);
                }
            });
        } else {
            console.error('Erreur lors de la récupération des travaux.');
        }
    } else {
        console.error('Elements avec ID "gallery" ou "modal-gallery" non trouvés dans le DOM.');
    }
};

// Ajustement de la fonction createWorkElement pour ajouter le bouton de suppression si nécessaire
function createWorkElement(work, container, withDeleteButton = false) {
    let figurework = document.createElement('figure');
    let imgwork = document.createElement('img');
    let figcaption = document.createElement('figcaption');

    imgwork.src = work.imageUrl;
    imgwork.alt = work.title;
    figcaption.innerText = work.title;

    figurework.appendChild(imgwork);
    figurework.appendChild(figcaption);

    if (withDeleteButton) {
        // Ajout de l'identifiant du travail à l'élément figure
        figurework.dataset.workId = work.id;
        createDeleteButton(figurework, work);
    }

    container.appendChild(figurework);
}


// Fonction fermeture boite modale 
const CLOSE_MODAL = function (e) {
    if (modal == null) return;

    // SI ON CLIQUE SUR AUTRE CHOSE QUE LA MODALE OU LE BOUTON ON NE VEUT PAS FERMER
    if (e.target != modal && e.target != BUTTON_CLOSE && e.target != document.querySelector('.fa-solid')) return;

    e.preventDefault();
    modal.style.display = "none";
    modal.removeEventListener('click', CLOSE_MODAL);
    BUTTON_CLOSE.removeEventListener('click', CLOSE_MODAL);
};


// Fonction suppression travaux
const DELETE_WORK = function (e) {
    console.log("Element to delete: ", e.target);
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce projet ?");

    if (confirmation) {
        try {
            deleteWorkFetch(e.target.id);
        } catch (error) {
            console.error("Erreur lors de la suppression du projet:", error);
        }
    }
};

// Appel API Supperrssion travaux 
function deleteWorkFetch(idWork, categoryId) {
    let token = sessionStorage.getItem("token");

    fetch(WORKS_API + '/' + idWork, {
        method: "DELETE",
        headers: {
            'Accept': '*/*',
            'Authorization': `Bearer ${token}`,
        }
    })
    .then(response => {
        if (response.status === 200 || response.status === 201 || response.status === 204) {
            // Rafraîchit la galerie après la suppression
            refreshGallery();
            copyGalleryToModal(); // Rafraîchit également la modal
          
            if (categoryId !== undefined) {
                addSelectedClass(categoryId); // Ajouter la classe "selected" à la catégorie sélectionnée si categoryId est défini
            }
        } else {
            alert("Erreur lors de la suppression du projet.");
        }
    });
}

// Fonction pour rafraîchir la galerie
function refreshGallery() {
    const galleryContainer = document.getElementById('gallery');

    if (galleryContainer) {
        galleryContainer.innerHTML = '';

        const selectedCategoryId = getCurrentSelectedCategoryId();
        updateGalleryByCategory(selectedCategoryId);
    } else {
        console.error('Element avec ID "gallery" non trouvé dans le DOM.');
    }
}

// Appel initial pour mettre à jour la galerie avec la catégorie par défaut (0)
updateGalleryByCategory(0);
// Fonction pour obtenir la catégorie actuelle
function getCurrentSelectedCategoryId() {

    return 0; 
}


//CREATION D'UN BOUTON SUPPRIMER POUR CHAQUE IMAGE
function createDeleteButton(figure, work) {
    let button = document.createElement('i');
    button.classList.add("fa-regular", "fa-trash-can");
    button.addEventListener('click', DELETE_WORK)
    button.id = work.id
    figure.appendChild(button);
}
   // Ajout listener sur clique bouton modifier pour appeler ouverture modale 
   BUTTON_MODIF_WORKS.addEventListener('click', OPEN_MODAL);
});
