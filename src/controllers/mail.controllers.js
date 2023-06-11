import nodemailer from "nodemailer"
import config from "../config/config.js";
import { urlencoded } from "express";
import { resolveHostname } from "nodemailer/lib/shared/index.js";


let transporter = nodemailer.createTransport({
  service: config.MAIL_SERVICE,
  port: config.MAIL_PORT,
  auth: {
    user: config.MAIL_USER,
    pass: config.MAIL_PASS
  }
});

const getMail = async (req,res)=>{
  try{
    let info = await transporter.sendMail({
      from: `ecommerce <${config.MAIL_USER}>`, // direccion de envio
      to: `${req.purcharser}`, // lista de quienes reciben
      subject: `Compra`, // Asunto
      text: "Su compra en ecommerce", // Texto plano
      html: `<div>
                <p>Código de compra: ${req.code}</p>
                <p>Fecha: ${req.purchase_datetime}</p>
                <p>Monto: $ ${req.amount}</p>
                <p>Usuario: ${req.purcharser}</p>
              </div>`       
    })
  }
  catch(error){
    req.logger.error(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()}`)
    throw error
  }
    
}

const resetMail = async(req,res)=>{
  console.log(req)
  let info = await transporter.sendMail({
    from: `ecommerce <${config.MAIL_USER}>`, // direccion de envio
    to: `${req.email}`, // lista de quienes reciben
    subject: `Password reset`, // Asunto
    text: "Reseteo de password", // Texto plano
    html: `<div>
              <p> Para resetear su password ingrese al siguiente link:</p>
              <a href="http://${req.host}/newpassword/${req.token}">http://${req.host}/newpassword/${req.token} </a>
          </div>`       
  })
}

const deleteMail = async(userEmail, req,res)=>{
  let info = await transporter.sendMail({
    from: `ecommerce <${config.MAIL_USER}>`,
    to: `${userEmail}`, 
    subject: `Cuenta inactiva eliminada`,
    text: "Cuenta inactiva eliminada", 
    html: `<div>
              <p> Le informamos que su cuenta ha sido eliminada debido a que ha permanecido inactiva durante más de 48hs</p>
          </div>`       
  })
}

const deleteProductMail = async(userEmail,productId, req,res)=>{
  let info = await transporter.sendMail({
    from: `ecommerce <${config.MAIL_USER}>`,
    to: `${userEmail}`, 
    subject: `Producto eliminado`,
    text: "Producto eliminado", 
    html: `<div>
              <p> Le informamos que el producto ${productId} ha sido eliminado</p>
          </div>`       
  })
}

export{
    getMail,
    resetMail,
    deleteMail,
    deleteProductMail
}

