let i = 0;
let category = document.getElementById("category");

fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    for (let i = 0; i < data.length; i++) {
      const work = document.createElement("figure");
      work.className = "work";
      work.innerHTML = `
    <img src="${data[i].imageUrl}" alt="${data[i].title}" />
    <figcaption>${data[i].title}</figcaption>
  `;
      document.querySelector(".gallery").appendChild(work);
    }
  });

let logout = document.getElementById("connexion");
if (localStorage.getItem("token")) {
  logout.innerText = "logout";
  console.log(localStorage.getItem("token"));
} else {
  logout.innerText = "login";
}

logout.addEventListener("click", function () {
  if (logout.innerText === "login") {
    window.location.href = "./login.html";
  } else {
    localStorage.removeItem("token");
    logout.innerText = "login";
  }
});

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
