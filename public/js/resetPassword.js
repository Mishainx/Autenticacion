let resetPasswordBtn = document.getElementById("resetPasswordBtn")
let resetEmail = document.getElementById("resetEmail")
let resetFormMessage = document.getElementById("resetFormMessage")
let resetSpinner = document.getElementById("resetSpinner")
let resetPasswordBtnP = document.getElementById("resetPasswordBtnP")
// Funciones


const isValidEmail=(mail)=> { 
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(mail); 
}

const validEmailMessage = (value) =>{


    resetFormMessage.innerHTML= ""
    const validEmail = document.createElement("p")
    validEmail.style.textAlign = "center"

    if(value){
        validEmail.innerText = "Se ha enviado un email de recuperación. Revise su casilla. Redireccionando a Login"
        validEmail.style.color = "rgb(23, 123, 25)"
    }
    else{
        validEmail.innerText = "Ingrese un email válido"
        validEmail.style.color = "rgb(188, 36, 36)"
    }
    resetFormMessage.append(validEmail)
}

const resetReq = () =>{
    const user = resetEmail.value

    resetSpinner.style.display = "block"
    resetSpinner.classList.add("spinnerMove")
    resetPasswordBtnP.style.display = "none"

    if( isValidEmail(user)){
        fetch("/resetpassword",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user
            })
        })
        .then((response)=>response.json())
        .then((data)=>{     

            if(data.message=="success"){          
                validEmailMessage(true)              
                setTimeout(() => {
                    window.location = "/login";
                  }, "3000");
            }
            else{
                validEmailMessage(false)
            }
        })
    }
    else{
        validEmailMessage(false)
    }
}

// Eventos
resetPasswordBtn.addEventListener("click", resetReq)