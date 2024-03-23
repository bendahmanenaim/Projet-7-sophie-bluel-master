//CONSTANTES
const NEW_MODALE = document.querySelector(".modal-new-photo");
const BUTTON_CLOSE_NEW = document.querySelector('.js-modal-close-new');
const BUTTON_BACK = document.querySelector('.modal-back');
const BUTTON_ADD = document.querySelector('.button-add-photo');
const INPUT_PICTURE = document.querySelector('#input-picture');
const PICTURE_PREVIEW = document.querySelector('#picture-preview');
const PICTURE_SELECTION = document.querySelector('.picture-selection');
const CATEGORIES_SELECT = document.querySelector('.select-category');
const TITLE_NEW_PHOTO = document.querySelector('.input-titre');
const BUTTON_SUBMIT = document.querySelector('.button-submit');

let modal_new = null

//Fonction ouverture boite modale 
const OPEN_MODAL_NEW = function (e) {
    e.preventDefault()
    //On cache la MODAL-GALLERY
    modal.style.display="none";
    //On affiche la modale de creation
    modal_new=document.querySelector("#modal2");
    modal_new.style.display=null
    modal_new.addEventListener('click', CLOSE_MODAL_NEW)
    BUTTON_CLOSE_NEW.addEventListener('click', CLOSE_MODAL_NEW)
    let modal_wrapper=document.querySelector(".modal-wrapper-new")
    modal_wrapper.style.display="flex"
    resetPhotoSelection(); //Remise a vide de la selection photo
    resetForm();// Remise a vide formulaire ajout photo 
    loadCategories();
}

//Fonction fermeture boite modale 
const CLOSE_MODAL_NEW = function (e) {
    if (modal_new==null) return
    //Si on clique sur autre chose que la modale ou le bouton on ne veut pas fermer 
    if (e.target != modal_new && e.target != BUTTON_CLOSE_NEW && e.target != document.querySelector('.top .fa-x') ) return
    e.preventDefault
    modal_new.style.display="none"
    modal_new.removeEventListener('click',CLOSE_MODAL_NEW)
    BUTTON_CLOSE_NEW.removeEventListener ('click',CLOSE_MODAL_NEW)
}

//Bouton retour
BUTTON_BACK.addEventListener("click",function(){
    modal_new.style.display="none";
    modal.style.display="flex";
})

//Bouton ajout photo 
BUTTON_ADD.addEventListener("click", function(){
    INPUT_PICTURE.click();
})
// Écouteur d'événement pour le sélecteur de fichier photo
INPUT_PICTURE.addEventListener("change", function(){
    // Vérifie la taille du fichier et affiche une alerte si elle est trop grande
    if(this.files[0].size > 4194304){
        alert("Fichier trop volumineux");
        this.value = "";
    };

    // Affiche l'aperçu de la photo si un fichier est sélectionné
    if (this.files[0]) {
        PICTURE_PREVIEW.src = URL.createObjectURL(this.files[0])
        PICTURE_PREVIEW.style.display = "block";
        PICTURE_SELECTION.style.display = "none";
    }
})

// Fonction de remise à zéro de la sélection d'image
function resetPhotoSelection(){
    INPUT_PICTURE.value = "";
    PICTURE_PREVIEW.src = "";
    PICTURE_PREVIEW.style.display = "none";
    PICTURE_SELECTION.style.display = "block";
}

// Fonction de remise à zéro du formulaire de téléversement
function resetForm(){
    CATEGORIES_SELECT.value = 0;
    TITLE_NEW_PHOTO.value = "";
}

// Fonction de chargement des catégories depuis l'API
function loadCategories(){
    // Vide le contenu de la liste déroulante avant de récupérer les catégories pour éviter l'accumulation
    CATEGORIES_SELECT.innerHTML = '';
    
    // Crée une option vide pour la catégorie dans le formulaire
    let option = document.createElement("option");
    option.value = 0;
    option.text = "";
    CATEGORIES_SELECT.add(option);// Ajout de la catégorie vide dans le formulaire
    
    // Effectue une requête fetch vers l'API des catégories
    fetch (CATEGORY_API)
    .then (response => response.json())
    .then (categories => {
        // Parcourt les catégories récupérées et les ajoute à la liste déroulante
        for (let category of categories) {
            let option = document.createElement("option");
            option.value = category.id;
            option.text = category.name;
            CATEGORIES_SELECT.add(option);
        }   
    })
}


// Fonction de téléversement d'un nouveau projet
const UPLOAD_WORK = function(){

    // Récupère le jeton d'authentification depuis la session
    let token = sessionStorage.getItem("token");

    // Crée un objet FormData pour envoyer les données du formulaire
    const formData = new FormData();
    formData.append("image", INPUT_PICTURE.files[0]);
    formData.append("title", TITLE_NEW_PHOTO.value);
    formData.append("category", CATEGORIES_SELECT.value);
    
    // Effectue une requête fetch vers l'API des travaux
    fetch (WORKS_API, {
        method: "POST",
        headers: {
            'Accept': '*/*',
            'Authorization': `Bearer ${token}`,
        },
        body : formData
    })
    .then (response => {
        // Vérifie la réponse du serveur
        if (response.status === 200 || response.status === 201){
            // Réinitialise la sélection de la photo
            resetPhotoSelection();
            // Réinitialise le formulaire
            resetForm();
              // Rafraîchit l'affichage des travaux dans la modal
            refreshGallery(GALLERY_MODALE, true);
            // Rafraîchit l'affichage des travaux dans l'index
            refreshGallery(galleryContainer, false);
            // Effectue une vérification du formulaire
            VERIFICATION();
        } else if (response.status === 401){
            // Affiche une alerte en cas de session expirée ou invalide
            alert('Session expirée ou invalide');
        } else {
            // Affiche une alerte en cas d'erreur technique inconnue
            alert('Erreur technique inconnue');
        }
    });
}

// Fonction de vérification du formulaire complet
const VERIFICATION = function (e) {
    // Vérifie si l'image, la catégorie et le titre de la nouvelle photo sont renseignés
    if(INPUT_PICTURE.value != "" && CATEGORIES_SELECT.value != 0 && TITLE_NEW_PHOTO.value != ""){
        // Met à jour le style du bouton de soumission lorsque le formulaire est complet
        BUTTON_SUBMIT.style.backgroundColor = "#1D6154";
        BUTTON_SUBMIT.style.cursor = "pointer";
        // Ajoute un écouteur d'événement pour la soumission du travail lorsque le formulaire est complet
        BUTTON_SUBMIT.addEventListener("click", UPLOAD_WORK);
    } else {
        // Met à jour le style du bouton de soumission lorsque le formulaire est incomplet
        BUTTON_SUBMIT.style.backgroundColor = "#A7A7A7";
        BUTTON_SUBMIT.style.cursor = "default";
        // Supprime l'écouteur d'événement pour la soumission du travail lorsque le formulaire est incomplet
        BUTTON_SUBMIT.removeEventListener("click", UPLOAD_WORK);
    }
}

// Ajoute des écouteurs d'événement pour les changements dans les champs du formulaire
INPUT_PICTURE.addEventListener("change", VERIFICATION);
CATEGORIES_SELECT.addEventListener("change", VERIFICATION);
TITLE_NEW_PHOTO.addEventListener("change", VERIFICATION);

// Ajoute des écouteurs d'événement pour l'ouverture de la modal lors du clic sur les éléments avec l'ID 'ajout_projet'
document.querySelectorAll('#ajout_projet').forEach(a => {
    a.addEventListener('click', OPEN_MODAL_NEW);
});