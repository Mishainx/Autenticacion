  export const isLog = (req,res,next)=>{
    if(req.session?.user == undefined){
      return next()
    }
    return res.status(401).redirect("/api/views/products")
  }
  
  export const auth = async (req,res,next)=>{
      if(req.session?.user != undefined){
        return next()
      }
      return res.status(401).redirect("/login")
  }
  
  export const checkRole =(role)=>{
    return async(req,res,next)=>{
      if(role == req.session.user.role){
        return next()
      }
      let noNav = true
      return res.status(403).render("policies",{styleSheets:'css/styles',noNav })
    }
  } 