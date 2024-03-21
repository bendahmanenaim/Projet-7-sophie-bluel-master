
//CONSTANTES
const BASE_URL = "http://localhost:5678/api/"
const WORKS_API = BASE_URL+"works";
const CATEGORY_API = BASE_URL+"categories";
const galleryContainer = document.querySelector(".gallery"); 
const filterContainer = document.querySelector(".filter");

//Affichage les travaux dans la galerie
fetchData(galleryContainer,false);

// Fonction pour rafraichire les travaux
function refreshGallery(targetDiv, deleteButton){
    targetDiv.innerHTML ='';
    fetchData(targetDiv,deleteButton);
}


// Fonction pour récupérer les données depuis le back-end
function fetchData(targetDiv, deleteButton) {
     // Vérifie si targetDiv est défini et qu'il s'agit d'un élément DOM valide
    
    fetch (WORKS_API)
     .then (response => response.json())
     .then(works =>{
        workList=works;
        for (let i=0; i<works.length; i++){
            createWork(works[i], targetDiv, deleteButton);

        }
       });
    } 


// Fonction pour mettre à jour la galerie en fonction de la catégorie sélectionnée
function createWork(work, targetDiv, deleteButton) {

                    // Création des éléments HTML pour chaque projet et les ajoutez à la galerie
                    let figure = document.createElement("figure");
                    let imgWorks = document.createElement("img");
                    let figcaption = document.createElement("figcaption");

                    // Ajout des attributs et du contenu aux éléments créés
                    imgWorks.src = work.imageUrl;
                    figcaption.innerText = work.title;

                    // Ajout des  éléments à la figure et la figure à la galerie
                    figure.appendChild(imgWorks)
                    figure.appendChild(figcaption)
                    targetDiv.appendChild(figure);

                if(deleteButton){
                    createDeleteButton(figure,work)
                }
            }
            //RECUPERATION DES CATEGORIES
fetch (CATEGORY_API)
.then (reponse => reponse.json())
.then (categories => {
    let filterWorks = new Set (categories)
    let nouvelleCategorie = {id:0,name:"Tous"};
    createFilterButton(nouvelleCategorie);
    addSelectedClass(nouvelleCategorie.id)
    for (let category of filterWorks) {
        createFilterButton (category)
    }   
})

// Fonction pour créer les boutons de filtre
 function createFilterButton(category) {
    let categoryLink = document.createElement ("a")
    categoryLink.id = "category"+category.id
    categoryLink.classList.add("category")
    categoryLink.innerHTML = category.name;
    filterContainer.appendChild(categoryLink)

// Ajout du EventListener sur les filtres
    
    categoryLink.addEventListener("click" ,function() {
        filtreWorksByCategory(category.id);
    });
}
   function filtreWorksByCategory (categoryId){
    galleryContainer.innerHTML=''
    
    //
    for (let i=0 ;i<workList.length; i++){
        if (workList[i].categoryId===categoryId || categoryId===0){
            createWork (workList[i],galleryContainer,false)
        }
    }
     // Gestion de la l'apparence des filtres (selection)
     removeSelectedClass()
     addSelectedClass(categoryId)
   }
   // Modification login en logout 
  gestion_login();

  //Creation d'un bouton supprimer pour chaque image
   function createDeleteButton (figure,work){
    let button =document.createElement('i');
    button.classList.add("fa-regular","fa-trash-can");
    button.addEventListener('click',DELETE_WORK)
    button.id= work.id
    figure.appendChild(button)
   }
//
function addSelectedClass (categoryId) {
    document.getElementById("category"+categoryId).classList.add("selected")
}
//
function removeSelectedClass(){
    let filters=document.querySelectorAll(".category");
    for (let i = 0; i <filters.length; i++) {
        filters[i].classList.remove ("selected")
    }
}
function gestion_login() {
    if (sessionStorage.getItem("token")) {
        let loginLogoutLink = document.getElementById("login_logout");
        
            loginLogoutLink.textContent = "logout";
        
        let bandeau_edit = document.getElementById("edition");
        if (bandeau_edit) {
            bandeau_edit.style.display = "flex";
        }
        
        let projet_modif = document.querySelector(".js-modal");
        if (projet_modif) {
            projet_modif.style.display = "inline";
        }
        
        let button_filter = document.querySelector(".filter");
        if (button_filter) {
            button_filter.style.display = "none";
        }
        loginLogoutLink.addEventListener("click", function (event) {
            event.preventDefault();
            sessionStorage.removeItem("token");
            window.location.href = "index.html";
        });
    
        
    }
}

