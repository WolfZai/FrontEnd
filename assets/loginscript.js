let baliseEmail = document.getElementById("email");
let balisePassword = document.getElementById("mdp");
let baliseButton = document.getElementById("button");

baliseButton.addEventListener("click", async function loginClick(event) {
  event.preventDefault();

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: baliseEmail.value,
        password: balisePassword.value,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      localStorage.setItem("token", data.token);
      window.location.href = "./index.html";
    } else {
      document.getElementById("error").innerText =
        "Email ou mot de passe incorrect";
    }
  } catch (error) {
    console.error("Error:", error);
  }
});
