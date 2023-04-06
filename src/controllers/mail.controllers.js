import nodemailer from "nodemailer"
import config from "../config/config.js";

const getMail = async (req,res)=>{
    let transporter = nodemailer.createTransport({
        service: config.MAIL_SERVICE,
        port: config.MAIL_PORT,
        auth: {
          user: config.MAIL_USER,
          pass: config.MAIL_PASS
        }
      });

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

export{
    getMail
}

