function Init() {
  fetchWorks();
  fetchCategories();
  removeModal();
  SelectOption();
}

let logout = document.getElementById("connexion");
let categoriesContainer = document.querySelector(".category");
let bandeauHeader = document.getElementById("edit-mode");
let modalContainer = document.querySelector(".modifmodal");

if (localStorage.getItem("token")) {
  logout.innerText = "logout";
  console.log(localStorage.getItem("token"));
  bandeauHeader.classList.add("active");
  categoriesContainer.style.display = "none";
  modalContainer.style.display = "flex";
} else {
  logout.innerText = "login";
  categoriesContainer.style.display = "flex";
  modalContainer.style.display = "none";
}

logout.addEventListener("click", function () {
  if (logout.innerText === "login") {
    window.location.href = "./login.html";
  } else {
    localStorage.removeItem("token");
    bandeauHeader.classList.remove("active");
    logout.innerText = "login";
    categoriesContainer.style.display = "flex";
    modalContainer.style.display = "none";
  }
});

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
    displayFilterWorks(allWorks);
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

function filterCategory(categoryId) {
  const filteredWorks = allWorks.filter((work) => {
    console.log(`Comparaison ${work.categoryId} === ${categoryId}`);
    return work.categoryId == categoryId;
  });
  console.log("Résultat filtrée :", filteredWorks);

  displayFilterWorks(filteredWorks);
}

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
    figure.innerHTML = `
    <img src="${work.imageUrl}" alt="${work.title}" />
    <figcaption>${work.title}</figcaption>
    `;
    container.appendChild(figure);
  });
}

function displayModalWorks(modalWorks) {
  document.querySelector(".workmodal").innerHTML = "";
  for (let i = 0; i < modalWorks.length; i++) {
    const work = document.createElement("figure");
    work.className = "work";
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

function deleteWork(id) {
  fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      fetchWorks();
    })
    .catch((error) => console.error("error suppression", error));
}

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
        const imageUrl = URL.createObjectURL(file);

        display.src = imageUrl;
        display.src = e.target.result;
        display.classList.toggle("active");
      };
      reader.readAsDataURL(file);
    }
  });
}

function SelectOption() {
  const selectElement = document.getElementById("category");

  const optionDefaut = document.createElement("option")
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
};

// function Formulaire() {
let uploadForm = document.querySelector("form");
console.log(uploadForm);

uploadForm.addEventListener("submit", function(e){
  e.preventDefault();
  
  
  // // let divError = document.querySelector(".ajoutphoto");
  // // let photoUpload = document.getElementById("file")
  // let titreInput = document.getElementById("title");
  // // let myRegex = /^[a-zA-Z-\s]+$/;
  // // let categorySelect = document.getElementById("category")

  // if (titreInput.value.trim() == "") {
  //   titreInput.classList.add("error");
  //   console.log("ajoute bien la class error");
  // }
})
// }

Init();

// display.classList.toggle("active")
/* <figcaption>${data[i].title}</figcaption> */
// fetch("http://localhost:5678/api/works")
//   .then((response) => response.json())
//   .then((data) => {
//     console.log(data);
//     for (let i = 0; i < data.length; i++) {
//       const work = document.createElement("figure");
//       work.className = "work";
//       work.innerHTML = `
//     <img src="${data[i].imageUrl}" alt="${data[i].title}" />
//     <figcaption>${data[i].title}</figcaption>
//   `;
//       document.querySelector(".workmodal").appendChild(work);
//     }
//   });

// function secondModal() {
//   modalContainer.classList.remove("active");
//   containerModal.classList.remove("active");
// }

// function displayModalWorks(modalWorks) {
//   const modalContainer = document.querySelector(".modal-container");
//   modalContainer.innerHTML = "";

//   modalWorks.forEach((work) => {
//     const modalWork = document.createElement("figure");
//     modalWork.className = "work";

//     const modalImg = document.createElement("img");
//     modalImg.src = work.imageUrl;
//     modalImg.alt = work.title;

//     modalImg.style.width = "100%";
//     modalImg.style.height = "auto";
//     modalImg.style.objectFit = "cover";

//     const modalTitle = document.createElement("figcaption");
//     modalTitle.textContent = work.title;

//     modalWork.appendChild(modalTitle);
//     modalContainer.appendChild(modalWork);
//     modalWork.appendChild(modalImg);
//   });
// }

// async function filterCategory(categoryId) {
//   try {
//     const response = await fetch(
//       `http://localhost:5678/api/works?category=${categoryId}`
//     );
//     if (!response.ok) {
//       throw new Error(`Error: ${response.status}`);
//     }
//     const data = await response.json();
//     const url = `http://localhost:5678/api/works?category=${categoryId}`;
//     console.log(url + category);
//     displayFilterWorks(data);
//   } catch (error) {
//     console.error("erreur de récupération filtrage", error);
//   }
// }

// function filterCategory(filterCategory) {
//   const container = document.querySelector(".category");
//   container.innerHTML = "";
//   filterCategory.forEach((lienCategory) => {
//     const lienCategory = document.createElement("a");
//     (lienCategory.textContent = "Tous"),
//       (lienCategory.textContent = "Objet"),
//       (lienCategory.textContent = "Appartement"),
//       (lienCategory.textContent = "Hotel & Restaurant");
//     container.appendChild(lienCategory);
//   });
// }

// function displayFilterWorks(filteredWorks) {
//   const container = document.querySelector(".gallery");
//   container.innerHTML = "";
//   filteredWorks.forEach((work) => {
//     const categoryElement = document.createElement("figure");
//     categoryElement.textContent = `${work.categoryId}`;
//     container.appendChild(categoryElement);
//   });
// }

// function fetchTestCategory(categoryId) {
//   const url = `http://localhost:5678/api/works?category=${categoryId}`;
//   console.log(url);
//   fetch(url)
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data);
//     });
// }

// let objetCategory = document.getElementById("objet");
// objetCategory.addEventListener("click", () => {
//   filterCategory();
//   // fetchTestCategory(7);
//   // fetch(`http://localhost:5678/api/works?category=${categoryId}`)
//   //   .then((response) => response.json())
//   //   .then((data) => {
//   //     console.log(data);
//   //   });
// });
// function displayFilterWorks(filteredWorks) {
//   const container = document.querySelector(".gallery");
//   container.innerHTML = "";
//   filteredWorks.forEach((work) => {
//     const figure = document.createElement("figure");
//     figure.className = "work";
//     figure.innerHTML = `
//     <img src="${work.imageUrl}" alt="${work.title}" />
//     <figcaption>${work.title}</figcaption>
//   `;
//     container.appendChild(figure);
//   });
// }

// fetch("http://localhost:5678/api/works")
//   .then((response) => response.json())
//   .then((data) => {
//     document.getElementById("objet").addEventListener("click", function () {
//       const filteredWorks = filterCategory(data);
//       displayFilterWorks(filteredWorks);
//     });
//     // category.addEventListener("change", function () {
//     //   const filteredWorks = filterCategory(data, category.value);
//   });

// let objetCategory = document.getElementById("objet");
// objetCategory.addEventListener("click", function () {
//   fetch("http://localhost:5678/api/works?category=objet")
//     .then((response) => response.json())
//     .then((data) => {
//       // console.log(data);
//       document.querySelector(".gallery").innerHTML = "";

//       //   for (let i = 0; i < data.length; i++) {
//       //     const work = document.createElement("figure");
//       //     work.className = "work";
//       //     work.innerHTML = `
//       //   <img src="${data[i].imageUrl}" alt="${data[i].title}" />
//       //   <figcaption>${data[i].title}</figcaption>
//       // `;
//       //     document.querySelector(".gallery").appendChild(work);
//       //   }
//     });
// });

// category.addEventListener("change", async function filtre(category) {
//   fetch(`http://localhost:5678/api/works?category=${category.value}`)
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data);
//       document.querySelector(".gallery").innerHTML = "";
//       for (let i = 0; i < data.length; i++) {
//         const work = document.createElement("figure");
//         work.className = "work";
//         work.innerHTML = `
//       <img src="${data[i].imageUrl}" alt="${data[i].title}" />
//       <figcaption>${data[i].title}</figcaption>
//     `;
//         document.querySelector(".gallery").appendChild(work);
//       }
//     });
// });
