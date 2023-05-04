let newPasswordBtn = document.getElementById("newPasswordBtn")
let newPassword = document.getElementById("newPassword")
let newPasswordRepeat = document.getElementById("newPasswordRepeat")
let newPasswordFormMessage = document.getElementById("newPasswordFormMessage")
// Funciones

let pathname = window.location.pathname.split("/")
let token = pathname[pathname.length-1]

const updatePasswordMessage = (value, message) =>{
    newPasswordFormMessage.innerHTML= ""
    const newPasswordP = document.createElement("p")
    newPasswordP.style.textAlign = "center"

    if(value){
        newPasswordP.innerText = `${message}. Redireccionando al Login`
        newPasswordP.style.color = "rgb(23, 123, 25)"
    }
    else{

        newPasswordP.innerText = `${message}`
        newPasswordP.style.color = "rgb(188, 36, 36)"
    }
    newPasswordFormMessage.append(newPasswordP)
}

const sendNewPassword = () =>{
    const password1 = newPassword.value
    const password2 = newPasswordRepeat.value

    if(!!!password1 || !!!password2){
        updatePasswordMessage(false, "Campo vacío")
        return 
    }

    if(password1 === password2){
        fetch( `/newpassword/${token}` ,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password1
            })
        })
        .then((response)=>response.json())
        .then((data)=>{
            if(data.status == "success"){
                updatePasswordMessage(true, data.message)

                setTimeout(() => {
                    window.location = "/login";
                  }, "3000");
            }
            else{
                updatePasswordMessage(false, data.message)
            }
        })
    }
    else{
        updatePasswordMessage(false, "Las contraseñas no coinciden")
    }
}

setTimeout(() => {
    window.location = "/login";
  }, "3600000");

// Eventos
newPasswordBtn.addEventListener("click", sendNewPassword)