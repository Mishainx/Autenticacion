const elementExists = (id) => document.getElementById(id) !== null;
const loginContainer = document.getElementById("loginContainer")
const loginError = document.getElementById("loginError")
const signUpContainer = document.getElementById("signUpContainer")
const signUpMessage = document.getElementById("signUpMessage")
const profileLink = document.getElementById("profileLink")
const logGitContainer = document.getElementById("logGitContainer")
const btnLogGit = document.getElementById("btnLogGit")

elementExists("send") &&
  document.getElementById("send").addEventListener("click", function () {
    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
      })
      .catch((error) => alert("usuario no encontrado"))
      .catch((error) => alert("usuario no encontrado"));
  });

elementExists("signup") &&
  document.getElementById("signup").addEventListener("click", function () {
    const myForm = document.getElementById("myForm");
    const formData = new FormData(myForm);
    const data = Object.fromEntries(formData);

      fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      .then((response) => response.json())
      .then((data) =>{
        if(data.status == "success"){
          signUpMessage.innerHTML = ""
          let signUpP = document.createElement("p")
          signUpP.innerText = "Usuario creado exitósamente, diríjase al login"
          signUpP.style.color="rgb(23, 123, 25)"
          signUpP.style.fontSize = "15px"
          signUpP.style.textAlign = "center"
          signUpP.style.padding = "10px"
          signUpMessage.append(signUpP)
        }

        else if(data.status == "error"){
          signUpMessage.innerHTML = ""
          let signUpP = document.createElement("p")
          signUpP.innerText = data.message == "Missing credentials"? "Para registrar un usuario todos los campos deben estar completos" : data.message
          signUpP.style.color="rgb(188, 36, 36)"
          signUpP.style.fontSize = "15px"
          signUpP.style.textAlign = "center"
          signUpP.style.padding = "10px"
          signUpP.style.maxWidth = "250px"

          signUpMessage.append(signUpP)	
        }
      })
      .catch((error) => console.error(error));
  });