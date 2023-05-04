import { Products } from "../dao/persistence.js";
import ProductRepository from "../repository/product.repository.js";
import CustomError from "../services/errors/customErrors.js";
import EErrors from "../services/errors/enum.js";
import { generateProductsErrorInfo } from "../services/errors/info.js";

let products = new Products()
let productRepository = new ProductRepository(products)

const getProducts = async (req, res) => {
    try {
      const limit = req.query.limit || 10
      const page = req.query.page || 1
      let category = req.query.category || undefined
      const sort = req.query.sort || ""
      let stockQuery = req.query.stock || undefined
  
      //Validación en caso de que se haya ingresado limit
      if(isNaN(Number(limit))){
        res.status(400).send({status:"error", payload:"El limit ingresado es inválido"})
        return
      }
      //Validación en caso de que se haya ingresado page
      if(isNaN(Number(page)) || parseInt(page)<1){
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
            const checkCategory = await productRepository.propProducts({category:category})
            if(!checkCategory){
              res.status(400).send({status:"Error",payload:"La categoría ingresada es inexistente"})
              return
            }
            category={category:category}
          }
  
      // Se realiza la paginación conforme los querys seleccionados
      let productlist= await productRepository.getPaginateProducts(category,stockQuery,limit,page,sort)//await productModel.paginate({...category,...stockQuery},{limit:limit, page:page, sort: {price:sort}})
      
      //Configuración prevLink
      let actualUrl = req.originalUrl
      let actualUrlParams = new URLSearchParams(req.originalUrl)
      let prevLink;
      let nextLink;
      
      //Configuración NextLink
      if(productlist.hasNextPage != false){
        if(actualUrlParams.has("/api/products")){
          let actualUrl = new URLSearchParams(req.originalUrl)
          actualUrl.set('/api/products',2)
          nextLink = actualUrl.toString().replace("%2Fapi%2Fproducts=", "/api/products?page=")
        }
  
        else if(actualUrlParams.has("/api/products?page")){
          let newPage = actualUrlParams.get("/api/products?page")
          let newUrl = new URLSearchParams(req.originalUrl)
          newUrl.set('/api/products?page',parseInt(...newPage)+1)
          nextLink = newUrl.toString().replace(/%2F/g,'/').replace(/%3F/g,'?').replace('/api/products=&', '/api/products?')
        }
  
        else if(actualUrlParams.has("page")){
          let newPage = actualUrlParams.get("page")
          let newUrl = new URLSearchParams(req.originalUrl)
          newUrl.set('page',parseInt(...newPage)+1)
    
        nextLink = newUrl.toString().replace(/%2F/g,'/').replace(/%3F/g,'?').replace('/api/products=&', '/api/products?')
        }
        
        else{
          let newUrl = new URLSearchParams(req.originalUrl)
          newUrl.set('page',2)
           nextLink = newUrl.toString().replace(/%2F/g,'/').replace(/%3F/g,'?')
        }
    }
  
          //Configuración prevLink
          if(productlist.hasPrevPage != false){
            if(actualUrlParams.has("/api/products?page")){
            let newPage = actualUrlParams.get("/api/products?page")
            let newUrl = new URLSearchParams(req.originalUrl)
            newUrl.set('/api/products?page',parseInt(...newPage)-1)
            prevLink = newUrl.toString().replace(/%2F/g,'/').replace(/%3F/g,'?').replace('/api/products=&', '/api/products?page=')
            }
  
            if(actualUrlParams.has("page")){
              let newPage = actualUrlParams.get("page")
              let newUrl = new URLSearchParams(req.originalUrl)
              newUrl.set('page',parseInt(...newPage)-1)
              prevLink = newUrl.toString().replace(/%2F/g,'/').replace(/%3F/g,'?').replace('/api/products=&', '/api/products?')
            }
          }
  
          if(productlist.page >productlist.totalPages || productlist.page<1 ){
            res.status(404).send({error:"El page ingresado no es válido"})
          return
          }
  
      //Estructuración de la respuesta del servidor
      let response ={
        status:"succes",
        payload:productlist.docs,
        totalPages:productlist.totalPages,
        prevPage:productlist.prevPage,
        nextPage:productlist.nextPage,
        page:productlist.page,
        hasPrevPage:productlist.hasPrevPage,
        hasNextPage:productlist.hasNextPage,
        prevLink:  prevLink,
        nextLink: nextLink
      }
      //Envío la respuesta
      res.status(200).send(response)
    }
  
    catch (err) {
      req.logger.error(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()}`)
      res.status(500).send(err.message);
    }
}

const getProduct = async(req,res)=>{

    const id  = req.params.pid;
  
    //Comprobación de la estructura de la Id
    if(id.trim().length!=24){ 
      res.status(400).send({error: "La Id de producto ingresada no es válida"})
      return
    }
  
    //Comprobación de la existencia del producto
    const productExist = await productRepository.getIdProducts(id)
  
    if(productExist==null){
      res.status(400).send({error:"No existe un producto con la Id ingresada"})
      return
    }
  
    // Si la Id es válida y el producto existe se devuelve el producto solicitado
    try{
      const result = await productRepository.getIdProducts(id)
      res.status(200).send({status:"success",payload:result})
    }
    catch (err) {
      req.logger.error(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()} - Error al enviar el producto ${id}`)
      res.status(500).send(err.message);
    }
}

const createProduct = async (req, res,next) => {
    try {
      const {
        title,
        description,
        code,
        price,
        thumbnail,
        stock,
        category,
        status,
      } = req.body;
    
      if (
        !title ||
        !description ||
        !code ||
        !price ||
        !thumbnail ||
        !stock||
        !category ||
        !status
      ) {        CustomError.createError({
        name:"Product creation error",
        cause: generateProductsErrorInfo({title,description,code,price,thumbnail,stock,category,status}),
        message: "Error trying to create Product",
        code: EErrors.INVALID_TYPES_ERROR
      })
    }
    
      // Comprobación del código de producto para evitar que se repita
      const codeExist = await productRepository.findCodeProducts(code)
    
      if(codeExist){ 
        res.status(400).send({error: "El código ingresado ya existe"})
        return
      }

      let owner;
      if(req.session.user){
        if(req.session.user.role == "Premium"){
          owner = req.session.user?.email?req.session.user.email:undefined //Para el caso que el usuario proviene de github el email es null  
        }
      }

      const response = await productRepository.createProducts({
        owner,
        title,
        description,
        code,
        price,
        thumbnail,
        stock,
        category,
        status,
      });

      req.logger.info(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()} - Producto creado exitosamente: ${response}`)
      res.status(200).send({ message: "Producto creado", response });
    } catch (error) {
      req.logger.error(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()} - Error al crear el producto`)
      next(error);
    }
}

const deleteProduct = async (req, res) => {
    const  id  = req.params.pid;
  
    //Comprobación de la estructura de la Id.
    if(id.trim().length!=24){ 
      res.status(400).send({error: "La Id de producto ingresada no es válida"})
      return
    }
  
    //Comprobación de la existencia del producto.
    const productExist = await productRepository.getIdProducts(id)
  
    if(productExist==null){
      res.status(400).send({error:"No existe un producto con la Id ingresada"})
      return 
    }

    //Comprobación del rol del usuario para eliminar productos
   if(req.session.user.role == "Premium" && req.session.user.email != productExist.owner){
    req.logger.warning;(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()} - Usuario ${req.session.user.email} sin autorización para eliminar el producto ${productExist}`)
    res.status(401).send({status:"error", message:"Usuario sin autorización"})
    return
  }

    //Si se comprueba la Id se ejecutan las acciones para eliminar el producto.
    try {
      const result = await productRepository.deleteProducts(id);
      req.logger.info(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()} - Producto id: ${id} eliminado exitosamente`)
      res.status(200).send({ message: "Producto eliminado", result });
    } catch (err) {
      req.logger.error(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()} - Error al eliminar el producto`)
      res.status(500).send(err.message);
    }
}

const updateProduct = async (req, res) => {
    const { pid } = req.params;
    const property = req.body;
  
    //Comprobación de la estructura de la Id.
    if(pid.trim().length!=24){ 
      res.status(400).send({error: "La Id de producto ingresada no es válida"})
      return
    }
  
    //Comprobación de la existencia del producto.
    const productExist = await productRepository.getIdProducts(pid)
  
    if(productExist==null){
      res.status(400).send({error:"No existe un producto con la Id ingresada"})
      return
    }
  
    //Si se comprueba la Id se ejecutan las acciones para actualizar el producto.
    try{
      let newProperty = await productRepository.updateProducts(pid,property)
      const response = await productRepository.getIdProducts(pid)
      req.logger.info(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()} - Producto actualizado exitosamente`)
      res.status(200).send({message:"Producto actualizado exitósamente", response})
    }
    catch (err) {
      req.logger.error(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()} - Error al actualizar el producto`)
      res.status(500).send(err.message);
    }
}

export {
    getProducts,
    getProduct,
    createProduct,
    deleteProduct,
    updateProduct
}