document.addEventListener("DOMContentLoaded", function () {
  async function Init() {
    await fetchWorks();
    fetchCategories();
  }

  let logout = document.getElementById("connexion");
  let categoriesContainer = document.querySelector(".category");

  if (localStorage.getItem("token")) {
    logout.innerText = "logout";
    console.log(localStorage.getItem("token"));
    categoriesContainer.style.display = "none";
  } else {
    logout.innerText = "login";
    categoriesContainer.style.display = "flex";
  }

  logout.addEventListener("click", function () {
    if (logout.innerText === "login") {
      window.location.href = "./login.html";
    } else {
      localStorage.removeItem("token");
      logout.innerText = "login";
      categoriesContainer.style.display = "flex";
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
      console.log(works);
      allWorks = works;
      displayFilterWorks(works);
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
      console.log(categories);
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
  Init();
});

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
//       document.querySelector(".gallery").appendChild(work);
//     }
//   });

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
