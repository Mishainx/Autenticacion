import {productModel} from "../dao/mongo/models/products.model.js"
import cartModel from "../dao/mongo/models/carts.model.js"
import userModel from "../dao/mongo/models/user.model.js";
export let assignedCart;
const messages = []


const getHome = async (req,res)=>{
    try{
        let cartDirection = req.user.cart
        const productsList = await productModel.find().lean()
        res.status(200).render('home',{styleSheets:'css/styles',productsList, cartDirection})
    }
    catch(err){
        res.status(500).send({error:err})
    }
}

const getRealTimeProducts = async (req,res)=>{
    try{
      let cartDirection = req.user.cart
        const productsList = await productModel.find().lean()
        res.status(200).render('realTimeProducts',{styleSheets:'css/styles',productsList, cartDirection})
    }
    catch(err){
        res.status(500).send({error:err})
    }
}

const getProducts = async (req,res)=>{
    try{
      let findUser = await userModel.findOne({email:req.session.user.email})
      let user ={
        email: req.session.user.email,
        role: findUser.role,
        name: findUser.first_name,
        surname: findUser.last_name,
        age: findUser.age,
        cart:  req.user.cart
      }
        assignedCart = user.cart
        let cartDirection = user.cart
        const limit = req.query.limit || 10
        const page = req.query.page || 1
        let category = req.query.category || undefined
        const sort = req.query.sort || ""
        let stockQuery = req.query.stock || undefined
        let message;
        let pageCounter = 0
    
        //Validación en caso de que se haya ingresado limit
        if(isNaN(Number(limit))){
          res.status(400).send({status:"error", payload:"El limit ingresado es inválido"})
          return
        }
        //Validación en caso de que se haya ingresado page
        if(isNaN(Number(page))){
          res.status(400).send({status:"error", payload:"El valor de page inválido"})
          return
        }
    
        //Validación en caso de que se haya ingresado sort
        if(sort != ""){
          if(sort != 1 & sort !=-1){
            res.status(400).send({status:'error',payload:'El valor de sort debe ser 1 o -1'})
            return
          }
        }
    
        //Validación en caso de que se haya ingresado query por stock
        if(stockQuery!=undefined){
          if(stockQuery !=1 & stockQuery!=0){
            res.status(400).send({status:"Error",payload:"El valor ingresado es incorrecto. Sin stock:0/ Con stock:1"})
            return
          }
          stockQuery==1?stockQuery={stock:{$gte:1}}:stockQuery={stock:{$lt:1}}
        }
    
            //Validación en caso de que se haya ingresado query por categoría
            if(category!=undefined){
              const checkCategory = await productModel.exists({category:category})
              if(!checkCategory){
                res.status(400).send({status:"Error",payload:"La categoría ingresada es inexistente"})
                return
              }
              category={category:category}
            }
    
        // Se realiza la paginación conforme los querys seleccionados
        let productList = await productModel.paginate({...category,...stockQuery},{lean:true, limit:limit, page:page, sort: {price:sort}})
        let actualUrl = req.originalUrl
        let actualUrlParams = new URLSearchParams(req.originalUrl)
        let nextLink;
        let prevLink;

        //Configuración NextLink
        if(actualUrl== "/api/views/products"){
          let actualUrl = new URLSearchParams(req.originalUrl)
          actualUrl.set('/api/views/products',2)
          let nextLink = actualUrl.toString().replace("%2Fapi%2Fviews%2Fproducts=", "/api/views/products?page=")
          productList.nextLink = nextLink
        }

        else if(actualUrlParams.has("/api/views/products?page")){
          let newPage = actualUrlParams.get("/api/views/products?page")
          let newUrl = new URLSearchParams(req.originalUrl)
          newUrl.set('/api/views/products?page',parseInt(...newPage)+1)
    
          let nextLink = newUrl.toString().replace(/%2F/g,'/').replace(/%3F/g,'?').replace('/api/products=&', '/api/products?')
          productList.nextLink = nextLink
        }

        else if(actualUrlParams.has("page")){
          let newPage = actualUrlParams.get("page")
          let newUrl = new URLSearchParams(req.originalUrl)
          newUrl.set('page',parseInt(...newPage)+1)
    
          let nextLink = newUrl.toString().replace(/%2F/g,'/').replace(/%3F/g,'?').replace('/api/products=&', '/api/products?')
          productList.nextLink = nextLink
        }

        else{
          let newUrl = new URLSearchParams(req.originalUrl)
          newUrl.set('page',2)
          let nextLink = newUrl.toString().replace(/%2F/g,'/').replace(/%3F/g,'?')
          productList.nextLink = nextLink
        }


        //Configuración prevLink
        if(actualUrlParams.has("/api/views/products?page")){
          let newPage = actualUrlParams.get("/api/views/products?page")
          let newUrl = new URLSearchParams(req.originalUrl)
          newUrl.set('/api/views/products?page',parseInt(...newPage)-1)
          let prevLink = newUrl.toString().replace(/%2F/g,'/').replace(/%3F/g,'?').replace('/api/products=&', '/api/products?')
          productList.prevLink = prevLink
        }

        if(actualUrlParams.has("page")){
          let newPage = actualUrlParams.get("page")
          let newUrl = new URLSearchParams(req.originalUrl)
          newUrl.set('page',parseInt(...newPage)-1)
    
          let prevLink = newUrl.toString().replace(/%2F/g,'/').replace(/%3F/g,'?').replace('/api/products=&', '/api/products?')
          productList.prevLink = prevLink
        }

        if(page < 1 || page> parseInt(productList.totalPages)){
          message = "La página ingresada no es válida"
          res.status(300).render('products',{styleSheets:'css/styles', message})
          return
        }

        res.status(200).render('products',{styleSheets:'css/styles', productList,cartDirection,user})
    }
    catch(err){
        res.status(500).send({error:err})
    }
}

const getChat = async(req,res)=>{
    let cartDirection = await assignedCart._id
    res.status(200).render('chat',{title:"Chat",styleSheets:'css/styles',cartDirection})
}

const getCartsId = async (req,res)=>{
    let cartDirection = req.user.cart
    const cartId = req.params.cid
    let cart;

    //Comprobación de la estructura del parámetro Id recibido 
    if(cartId.trim().length!=24){ 
        let message = "La Id ingresada es inválida"
        res.status(400).render('carts_Id',{title:"Cart Id",styleSheets:'css/styles', message})
        return
      }
  
      //Comprobación de la existencia de un carrito con el parámetro ingresado.
      const cartExist = await cartModel.findById(cartId).lean().populate("products.product")
      if(cartExist==null){
        let message = "No existe un carrito con la Id seleccionada"
        res.status(400).render('carts_Id',{title:"Cart Id",styleSheets:'css/styles', message})
        return
      }
      else{
        cart = cartExist
      }

    res.status(200).render('carts_Id',{title:"Cart Id",styleSheets:'css/styles', cart, cartDirection})
}

const getCarts = async (req,res)=>{
    let message = "Para solicitar un Cart por favor indique el Id (/api/views/carts/:cid)"
    res.status(200).render('carts_Id',{title:"Cart Id",styleSheets:'css/styles', message})
}

export {
    getHome,
    getRealTimeProducts,
    getProducts, 
    getChat,
    getCartsId,
    getCarts
}