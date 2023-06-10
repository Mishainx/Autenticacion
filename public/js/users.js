let userViewBtn = document.getElementById("userViewBtn")
let userRolBtn = document.getElementById("userRolBtn")
let userDeleteBtn = document.getElementById("userDeleteBtn")
let userIdInput = document.getElementById("userIdInput")
let controlUserMessage = document.getElementById("controlUserMessage")

function deleteUser(){
    userDeleteBtn.addEventListener("click",()=>{
        if(userIdInput.value != ""){
            fetch(`/api/users/delete/${userIdInput.value}`,
            {method:"DELETE" ,
            headers: {"Content-Type": "application/json",}
            } )
            .then((response)=>response.json())
            .then((data)=>{
                if(data.status=="error"){
                    userMessage(data.status, data.message)
                }
                else if(data.status == "success"){
                    location.reload()
                }
            }
            )
            .catch((error)=>console.log(error))
        }
        else{
            userMessage("error", "Campo vacío")
        }
    })
}

function upgradeUser(){
    userRolBtn.addEventListener("click",()=>{
        if(userIdInput.value != ""){
            fetch(`/api/users/premium/${userIdInput.value}`,
            {method:"POST" ,
            headers: {"Content-Type": "application/json",}
            } )
            .then((response)=>response.json())
            .then((data)=>{
                if(data.status=="error"){
                    userMessage(data.status, data.message)
                }
                else if(data.status == "success"){
                    userMessage(data.status, data.message, data.payload)
                }
            }
            )
            .catch((error)=>console.log(error))
        }
        else{
            userMessage("error", "Campo vacío")
        }
    })
}

function viewUser(){
    userViewBtn.addEventListener("click",()=>{
        if(userIdInput.value != ""){
            fetch(`/api/users/${userIdInput.value}`)
            .then((response)=>response.json())
            .then((data)=>{
                if(data.status == "error"){
                    userMessage(data.status, data.message)
                }
                else if(data.status == "success"){
                    userMessage(data.status, data.message, data.payload)
                }
            })
            .catch((error)=>console.log(error))        
        }
        else{
            userMessage("error", "Campo vacío")
        } 
    })
}

function userMessage(status, message, response){
    controlUserMessage.innerHTML = ""
    let userMessageP = document.createElement("p")

    switch(status){
        case"error":
            userMessageP.style.color = "rgb(188, 36, 36)"
            userMessageP.innerText =`${message}`
        break
        
        case "success":
            userMessageP.innerText =
            `Nombre: ${response.first_name}
            Apellido: ${response.last_name}
            Email: ${response.email}
            Role: ${response.role}
            Age: ${response.age}

            ${message}
            `
            userMessageP.style.color = "rgb(23, 123, 25)"
        break
    }

    controlUserMessage.append(userMessageP)

}

deleteUser()
upgradeUser()
viewUser()
userMessage()