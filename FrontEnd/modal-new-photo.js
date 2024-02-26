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
const CATEGORY_API = BASE_URL+"categories";

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

//Selecteur fichier photo
INPUT_PICTURE.addEventListener("change",function(){
    if(this.files[0].size > 4194304){
        alert("Fichier trop volumineux");
        this.value = "";
     };
     if (this.files[0]) {
        PICTURE_PREVIEW.src = URL.createObjectURL(this.files[0])
        PICTURE_PREVIEW.style.display="block";
        PICTURE_SELECTION.style.display="none";
     }
})

//Remise a zero selection image
function resetPhotoSelection(){
    INPUT_PICTURE.value= "";
    PICTURE_PREVIEW.src ="";
    PICTURE_PREVIEW.style.display="none"
    PICTURE_SELECTION.style.display ="block";
}

//Remise a zero formulaire UPLOAD
function resetForm(){
    CATEGORIES_SELECT.value= 0;
    TITLE_NEW_PHOTO.value ="";
}

//Chargement CATEGORIES depuis API
function loadCategories(){
    CATEGORIES_SELECT.innerHTML = ''; //On vide avant de fetch pour ne pas accumuler les CATEGORIES
    let option = document.createElement("option");
    option.value = 0;
    option.text = "";
    CATEGORIES_SELECT.add(option);// Ajout CATEGORIE vide dans le formulaire V
    fetch (CATEGORY_API)
    .then (reponse => reponse.json())
    .then (categories => {
        for (let category of categories) {
            let option = document.createElement("option");
            option.value = category.id;
            option.text = category.name;
            CATEGORIES_SELECT.add(option);
        }   
    })
}


//UPLOAD nouveau projet 
const UPLOAD_WORK = function(){

    let token = sessionStorage.getItem("token");

    const formData = new FormData();
    formData.append("image", INPUT_PICTURE.files[0]);
    formData.append("title", TITLE_NEW_PHOTO.value);
    formData.append("category", CATEGORIES_SELECT.value);
    
    fetch (WORKS_API, {
        method: "POST",
        headers: {
            'Accept': '*/*',
            'Authorization': `Bearer ${token}`,
        },
        body : formData
    })
    .then (response => {
        if (response.status===200 ||response.status===201){
            resetPhotoSelection();//Remise a zero apercu photo 
            resetForm();//Remise a zero formulaire 
            refreshWorks(GALLERY_MODALE, true); //Reaffichage travaux dans modale
            refreshWorks(GALLERY_DIV,false); //Reaffichage traveaux dans index 
            VERIFICATION();
        }else if (response.status===401){
            alert('Session expirée ou invalide');
        }else{
            alert('Erreur technique inconnue');
        }
        })
    
}



//Verification formulaire complet
const VERIFICATION = function (e) {
    if(INPUT_PICTURE.value != "" && CATEGORIES_SELECT.value !=0 && TITLE_NEW_PHOTO.value!=""){
        BUTTON_SUBMIT.style.backgroundColor="#1D6154";
        BUTTON_SUBMIT.style.cursor="pointer";
        BUTTON_SUBMIT.addEventListener("click",UPLOAD_WORK);

    }else{
        BUTTON_SUBMIT.style.backgroundColor="#A7A7A7";
        BUTTON_SUBMIT.style.cursor="default";
        BUTTON_SUBMIT.removeEventListener("click", UPLOAD_WORK);
    }
}

INPUT_PICTURE.addEventListener("change",VERIFICATION);
CATEGORIES_SELECT.addEventListener("change",VERIFICATION);
TITLE_NEW_PHOTO.addEventListener("change",VERIFICATION);


document.querySelectorAll('#ajout_projet').forEach(a=>{
    a.addEventListener('click', OPEN_MODAL_NEW)
})