// CONSTANTES
const GALLERY_MODALE = document.querySelector(".modal-gallery");
const BUTTON_CLOSE = document.querySelector('.js-modal-close-1');
const MODALE_WRAPPER = document.querySelector(".modal-wrapper");
const BUTTON_MODIF_WORKS = document.querySelector('#modif-galerie');

let modal = null;

// Fonction ouverture boite modale 
const OPEN_MODAL = async function (e) {
    e.preventDefault();
    modal = document.querySelector("#modal1");
    modal.style.display = null;
    modal.addEventListener('click', CLOSE_MODAL);
    BUTTON_CLOSE.addEventListener('click', CLOSE_MODAL);
    MODALE_WRAPPER.style.display = "flex"; 

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
             refreshGallery();
            if (categoryId !== undefined) {
                addSelectedClass(categoryId); // Ajouter la classe "selected" à la catégorie sélectionnée si categoryId est défini
            }
        } else {
            alert("Erreur lors de la suppression du projet.");
        }
    });
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
