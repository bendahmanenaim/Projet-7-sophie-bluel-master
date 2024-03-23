
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
    // Effectue une requête fetch vers l'API WORKS_API
    fetch (WORKS_API)
    // Traite la réponse de la requête en tant que JSON
     .then (response => response.json())
     // Une fois que les données sont récupérées avec succès
     .then(works =>{
         // Stocke les travaux récupérés dans la variable workList
        workList=works;
         // Parcours les travaux récupérés
        for (let i=0; i<works.length; i++){
              // Crée et affiche chaque travail dans la galerie
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
// Requête pour récupérer les catégories depuis le back-end
fetch (CATEGORY_API)
.then (reponse => reponse.json())
.then (categories => {
    // Convertit les catégories en un ensemble pour éliminer les doublons
    let filterWorks = new Set (categories)
     // Crée une nouvelle catégorie "Tous"
    let nouvelleCategorie = {id:0,name:"Tous"};
     // Crée un bouton de filtre pour la nouvelle catégorie
    createFilterButton(nouvelleCategorie);
     // Ajoute la classe "selected" à la catégorie "Tous"
    addSelectedClass(nouvelleCategorie.id)
     // Parcours les catégories récupérées
    for (let category of filterWorks) {
        createFilterButton (category)
    }   
})

// Fonction pour créer les boutons de filtre
 function createFilterButton(category) {
    let categoryLink = document.createElement ("a")
    // Définit l'ID du lien en fonction de l'ID de la catégorie
    categoryLink.id = "category"+category.id
    // Ajoute la classe "category" au lien
    categoryLink.classList.add("category")
    // Définit le contenu du lien avec le nom de la catégorie
    categoryLink.innerHTML = category.name;
      // Ajoute le lien à l'élément conteneur des filtres
    filterContainer.appendChild(categoryLink)

// Ajout du EventListener sur les filtres
    
    categoryLink.addEventListener("click" ,function() {
        filtreWorksByCategory(category.id);
    });
}
   function filtreWorksByCategory (categoryId){
    galleryContainer.innerHTML=''
    
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
     // Crée un nouvel élément de bouton de suppression (icône trash)
    let button =document.createElement('i');
    button.classList.add("fa-regular","fa-trash-can");
    button.addEventListener('click',DELETE_WORK)
     // Définit l'ID du bouton en fonction de l'ID du travail
    button.id= work.id
      // Ajoute le bouton de suppression à l'élément figure
    figure.appendChild(button)
   }

   //Fonction pour ajouter la classe "selected" à un élément de catégorie spécifié
   function addSelectedClass(categoryId) {
       // Sélectionne l'élément de catégorie correspondant à l'ID fourni
       let categoryElement = document.getElementById("category" + categoryId);
       // Ajoute la classe "selected" à l'élément de catégorie
       categoryElement.classList.add("selected");
   }
// Fonction pour supprimer la classe "selected" de tous les éléments de catégorie
function removeSelectedClass(){
    let filters=document.querySelectorAll(".category");
      // Parcourt tous les éléments de catégorie
    for (let i = 0; i <filters.length; i++) {
           // Supprime la classe "selected" de chaque élément de catégorie
        filters[i].classList.remove ("selected")
    }
}
function gestion_login() {
    if (sessionStorage.getItem("token")) {
        let loginLogoutLink = document.getElementById("login_logout");
        if (loginLogoutLink) {
            loginLogoutLink.textContent = "logout";
            loginLogoutLink.addEventListener("click", function (event) {
                event.preventDefault();
                sessionStorage.removeItem("token");
                window.location.href = "index.html";
            });
        }
        
        let bandeau_edit = document.getElementById("edition");
        if (bandeau_edit) {
            bandeau_edit.style.display = "flex";
        }
        
        let projet_modif = document.getElementById("projet_modif");
        if (projet_modif) {
            projet_modif.style.display = "inline";
        }
        
        let button_filter = document.querySelector(".filter");
        if (button_filter) {
            button_filter.style.display = "none";
        }
        else {
            // Si l'utilisateur n'est pas connecté
            let projet_modif = document.getElementById("projet_modif");
            if (projet_modif) {
                projet_modif.style.display = "none";
            }
         }
    }}

