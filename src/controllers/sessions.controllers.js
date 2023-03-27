const postSessionsSignUp = async(req,res)=>{
    res.send({status:"success", message:"Usuario registrado exitosamente"})
}

const postSessionsLogin = async(req,res)=>{
    if(!req.user) return res.status(400).send({status:"error", error: "Credenciales inválidas"})
    req.session.user ={
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
      role: req.user.role
    }
    res.send({status:"success", payload:req.session.user})
}

const getSessionsCurrent = async(req,res)=>{
    let user = req.session.user
    if(user){
    return   res.send(req.session.user)
    }
    else{
      res.status(401).send({status:"error", message: "No hay una sesión iniciada"})
    }
}

export {
    postSessionsSignUp,
    postSessionsLogin,
    getSessionsCurrent
}