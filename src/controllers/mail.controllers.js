import nodemailer from "nodemailer"
import config from "../config/config.js";


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
  let info = await transporter.sendMail({
    from: `ecommerce <${config.MAIL_USER}>`, // direccion de envio
    to: `${req.email}`, // lista de quienes reciben
    subject: `Password reset`, // Asunto
    text: "Reseteo de password", // Texto plano
    html: `<div>
              <p> Para resetear su password ingrese al siguiente link:</p>
              <a href="http://localhost:8080/newpassword/${req.token}">http://localhost:8080/newpassword/${req.token} </a>
          </div>`       
  })
}

export{
    getMail,
    resetMail
}

