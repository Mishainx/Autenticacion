import EErrors from "../services/errors/enum.js";

const errorHandler = async  (error,req,res,next)=>{
    switch(error.code){
        case EErrors.INVALID_TYPES_ERROR:
            res.send({status: "error", error: error.name})
    break;
    default:
    res.send({status: "error",error: "unhandled error"});
    }  
}

export default errorHandler