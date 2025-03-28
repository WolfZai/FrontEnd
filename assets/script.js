//Initialisation de la page
function Init() {
  fetchWorks();
  fetchCategories();
  removeModal();
  SelectOption();
  removeError();
  uploadFormulaire();
}

//Gestion de l'authentification
let logout = document.getElementById("connexion");
let categoriesContainer = document.querySelector(".category");
let bandeauHeader = document.getElementById("edit-mode");
let modalContainer = document.querySelector(".modifmodal");

if (localStorage.getItem("Token")) {
  logout.innerText = "logout";
  console.log(localStorage.getItem("Token"));
  bandeauHeader.classList.add("active");
  categoriesContainer.style.display = "none";
  modalContainer.style.display = "flex";
} else {
  logout.innerText = "login";
  categoriesContainer.style.display = "flex";
  modalContainer.style.display = "none";
}

//Gestion du bouton de connexion/déconnexion
logout.addEventListener("click", function () {
  if (logout.innerText === "login") {
    window.location.href = "./login.html";
  } else {
    localStorage.removeItem("Token");
    bandeauHeader.classList.remove("active");
    logout.innerText = "login";
    categoriesContainer.style.display = "flex";
    modalContainer.style.display = "none";
  }
});

//Récupération des oeuvres et des catégories
let allWorks = [];

async function fetchWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const works = await response.json();
    allWorks = works;
    displayFilterWorks(works);
    displayModalWorks(works);
  } catch (error) {
    console.error("error récup", error);
  }
}

async function fetchCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const categories = await response.json();
    createFilters(categories);
  } catch (error) {
    console.error("error récup", error);
  }
}

//Création des filtres de catégories
function createFilters(categories) {
  const container = document.querySelector(".category");
  container.innerHTML = "";

  const allButton = document.createElement("a");
  allButton.textContent = "Tous";
  allButton.classList.add("active");
  allButton.addEventListener("click", function () {
    document
      .querySelectorAll(".category a")
      .forEach((lien) => lien.classList.remove("active"));
    allButton.classList.add("active");
    // Afficher tous les travaux
    document.querySelectorAll(".gallery .work").forEach(work => {
      work.style.display = "block";
  });
});
  container.appendChild(allButton);

  categories.forEach((category) => {
    const lienCategory = document.createElement("a");
    lienCategory.textContent = category.name;
    lienCategory.addEventListener("click", function () {
      document.querySelectorAll(".category a").forEach((lien) => {
        lien.classList.remove("active");
      });
      lienCategory.classList.add("active");
      filterCategory(category.id);
    });
    container.appendChild(lienCategory);
  });
}

//Filtre des oeuvres par catégorie
function filterCategory(categoryId) {
  // Au lieu de filtrer et réafficher, on parcourt tous les travaux et on ajuste leur visibilité
  const allWorkElements = document.querySelectorAll(".gallery .work");
  
  allWorkElements.forEach(workElement => {
    const workId = workElement.dataset.id;
    const work = allWorks.find(w => w.id == workId);
    
    if (work.categoryId == categoryId) {
      workElement.style.display = "block"; // Afficher les travaux de la catégorie sélectionnée
    } else {
      workElement.style.display = "none"; // Cacher les autres travaux
    }
  });
}

//Affichage des oeuvres filtrées
function displayFilterWorks(filteredWorks) {
  const container = document.querySelector(".gallery");
  container.innerHTML = "";

  if (filteredWorks.length === 0) {
    console.log("les works ne sont pas encore chargés");

    return;
  }

  filteredWorks.forEach((work) => {
    const figure = document.createElement("figure");
    figure.className = "work";
    figure.dataset.id = work.id;
    figure.innerHTML = `
    <img src="${work.imageUrl}" alt="${work.title}" />
    <figcaption>${work.title}</figcaption>
    `;
    container.appendChild(figure);
  });
}

//Gestion de la modal
//Affichage de la modal
function displayModalWorks(modalWorks) {
  document.querySelector(".workmodal").innerHTML = "";
  for (let i = 0; i < modalWorks.length; i++) {
    const work = document.createElement("figure");
    work.className = "work";
    work.dataset.id = modalWorks[i].id;
    work.innerHTML = `
  <img src="${modalWorks[i].imageUrl}" alt="${modalWorks[i].title}" />
  `;
    const deleteIcon = document.createElement("span");
    deleteIcon.classList.add("delete");
    deleteIcon.innerHTML = `<i class="fas fa-trash-alt"></i>`;
    deleteIcon.dataset.id = modalWorks[i].id;
    deleteIcon.addEventListener("click", () => deleteWork(modalWorks[i].id));
    document.querySelector(".workmodal").appendChild(work);
    work.appendChild(deleteIcon);
  }
}

//Suppression d'une oeuvre via l'API
function deleteWork(id) {
   fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
  })
    .then((response) => {
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      fetchWorks();
    })
    .catch((error) => console.error("error suppression", error));
}

//Gestion de l'ouverure et de la fermeture de la modal
const display = document.getElementById("photo");
function removeModal() {
  const containerModal = document.querySelector(".container-modal");
  const modaleOpen = document.getElementById("picture");
  const secondModalTrigger = document.querySelectorAll(".modal-trigger-second");
  const modalContainer = document.querySelector(".modal-container");
  const modalTriggers = document.querySelectorAll(".modal-trigger");

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      modalContainer.classList.toggle("active");
      containerModal.classList.remove("active");
    });
  });

  modaleOpen.addEventListener("click", () => {
    modalContainer.classList.remove("active");
    containerModal.classList.toggle("active");
  });

  secondModalTrigger.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      modalContainer.classList.remove("active");
      containerModal.classList.remove("active");
      display.classList.toggle("active");
      document.getElementById("uploadform").reset();
    });
  });
}

function resetImageAndForm() {
  if (display) {
    display.src = "";
    display.classList.remove("active");
  }
  const ajoutPhotoDiv = document.querySelector(".ajoutphoto");
  if (ajoutPhotoDiv) {
    Array.from(ajoutPhotoDiv.children).forEach(child => {
      if (child.id !== "photo") {
        child.style.display = "";
      }
    });
  }
}
function closeAllModals() {
  const containerModal = document.querySelector(".container-modal");
  const modalContainer = document.querySelector(".modal-container");

  if (containerModal && containerModal.classList.contains("active")) {
    containerModal.classList.remove("active");
  }

  if (modalContainer && modalContainer.classList.contains("active")) {
    modalContainer.classList.remove("active");
  }

  if (display && display.classList.contains("active")) {
    display.classList.remove("active");
    display.src = "";
  }
}

//Gestion du bouton de téléchargement d'image
const fileInput = document.getElementById("file");
const fileImg = document.getElementById("imagebtn");

console.log(fileInput);
console.log(display);

if (fileInput && fileImg) {
  fileImg.addEventListener("click", function (event) {
    event.preventDefault();
    fileInput.click();
  });

  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
    reader.onload = function (e) {
      // Récupérer la div ajoutphoto
      const ajoutPhotoDiv = document.querySelector(".ajoutphoto");
      
      // Mettre à jour l'image
      display.src = e.target.result;
      display.classList.add("active");
      display.style.maxWidth = "100%";
      display.style.maxHeight = "100%";
      display.style.objectFit = "contain";
      display.style.margin = "auto";
      
      // Masquer tous les autres éléments dans la div ajoutphoto
      if (ajoutPhotoDiv) {
        // Sélectionner tous les enfants directs sauf l'image
        const elementToHide = ajoutPhotoDiv.querySelectorAll(".icon-upload, .p, #imagebtn");
        elementToHide.forEach(element => {
          element.style.display = "none";
        });
        ajoutPhotoDiv.style.display = "flex";
      }
    };
      reader.readAsDataURL(file);
    }
  });
}

function SelectOption() {
  const selectElement = document.getElementById("category");

  const optionDefaut = document.createElement("option");
  optionDefaut.value = "";
  optionDefaut.textContent = "";
  selectElement.appendChild(optionDefaut);

  fetch("http://localhost:5678/api/categories")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      data.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        selectElement.appendChild(option);
      });
    })
    .catch((error) =>
      console.error("erreur lors de la récup des categories", error)
    );
}

const titre = document.querySelector(".title");
const categories = document.getElementById("category");
const divPhoto = document.querySelector(".ajoutphoto");
const formError = document.querySelectorAll(".error");
let imageDelete = document.getElementById("file");

function removeError() {
  divPhoto.classList.remove("error");
  titre.classList.remove("error");
  categories.classList.remove("error");
}

function isAuthenticated() {
  return localStorage.getItem("Token") !== null;
}

const photoInput = document.getElementById("file");
const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
let uploadForm = document.querySelector("form");
const submitButton = uploadForm.querySelector('button[type="submit"]');

// Fonction pour vérifier si les champs sont remplis
function checkButton() {
  const photoNull = photoInput.files.length > 0;
  const titreNull = titleInput.value.trim() !== "";
  const categoryNull = categoryInput.value !== "";

  submitButton.disabled = !(photoNull && titreNull && categoryNull);

  console.log(
    "Photo: ",
    photoNull,
    "Titre: ",
    titreNull,
    "Catégorie: ",
    categoryNull
  );
  console.log("Bouton désactiver: ", submitButton.disabled);
}

//Envoi des données du formulaire
async function addWork(formData) {
  try {
    if (!isAuthenticated()) {
      alert("Vous devez être connecté pour ajouter un projet");
      window.location.href = "./login.html";
      return null;
    }
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Token")}`,
      },
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Erreur: ${response.status} - ${
          errorData?.message || "Echec de la création du work"
        }`
      );
    }
    const newWork = await response.json();
    return newWork;
  } catch (error) {
    console.error("Erreur lors de l'ajout du work:", error);
    alert(`Echec de l'ajout: ${error.message}`);
    return null;
  }
}

//Configuration du formulaire
//Validation et envoi du formulaire
function uploadFormulaire() {
  submitButton.disabled = true;

  photoInput.addEventListener("change", checkButton);
  titleInput.addEventListener("input", checkButton);
  categoryInput.addEventListener("change", checkButton);

  checkButton();

  uploadForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!isAuthenticated()) {
      alert("Vous devez être connecté pour ajouter un projet");
      window.location.href = "./login.html";
      return;
    }

    removeError();

    let isValid = true;

    if (isValid) {
      const formData = new FormData();
      formData.append("image", photoInput.files[0]);
      formData.append("title", titleInput.value);
      formData.append("category", categoryInput.value);

      const originalButtonText = submitButton.value;
      submitButton.value = "Chargement...";

      addWork(formData)
        .then((newWork) => {
          if (newWork) {

            allWorks.push(newWork);
            displayFilterWorks(allWorks);
            displayModalWorks(allWorks);

            resetImageAndForm();
            closeAllModals();
            uploadForm.reset();

            checkButton();
          }
        })
        .finally(() => {
          submitButton.value = originalButtonText;
        });
    }
  });
}

Init();