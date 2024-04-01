// CONSTANTES
const GALLERY_MODALE = document.querySelector(".modal-gallery");
const BUTTON_MODIF_WORKS = document.querySelector("#projet_modif");
const BUTTON_CLOSE = document.querySelector('.js-modal-close-1');

let modal = null;
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

// Fonction ouverture boite modale 
const OPEN_MODAL = async function (e) {
    e.preventDefault();
    modal = document.querySelector("#modal1");
    if(modal){
    modal.style.display = null;
    modal.addEventListener('click', CLOSE_MODAL);
    }

    
    if (BUTTON_CLOSE){
    BUTTON_CLOSE.addEventListener('click', CLOSE_MODAL);
    }

    let MODALE_WRAPPER = document.querySelector(".modal-wrapper");
    if(MODALE_WRAPPER){
    MODALE_WRAPPER.style.display = "flex"
    }

  
    if (GALLERY_MODALE){
    GALLERY_MODALE.innerHTML ='';
    fetchData(GALLERY_MODALE,true);
    }

};

// Ajout listener sur clique bouton modifier pour appeler ouverture modale 
BUTTON_MODIF_WORKS.addEventListener('click', OPEN_MODAL);


// Fonction de suppression de travaux
const DELETE_WORK = function (e) {
    // Affiche dans la console l'élément à supprimer
    console.log("Element to delete: ", e.target);

    // Demande une confirmation de suppression
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce projet ?");

    // Vérifie si l'utilisateur a confirmé la suppression
    if (confirmation) {
        try {
            // Appelle une fonction pour effectuer la suppression côté serveur
            deleteWorkFetch(e.target.id);

            // Recherche l'élément HTML correspondant au projet supprimé
            const deletedWorkFigure = document.querySelector(`[data-work-id="${e.target.id}"]`);

            // Vérifie si l'élément existe et le supprime du DOM
            if (deletedWorkFigure) {
                GALLERY_MODALE.removeChild(deletedWorkFigure);
            }
            
        } catch (error) {
            // Affiche une erreur en cas de problème lors de la suppression
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
             refreshGallery(GALLERY_MODALE,true);
             refreshGallery(galleryContainer,false);
            if (categoryId !== undefined) {
                addSelectedClass(categoryId); // Ajouter la classe "selected" à la catégorie sélectionnée si categoryId est défini
            }
        } else {
            alert("Erreur lors de la suppression du projet.");
        }
    });
}
