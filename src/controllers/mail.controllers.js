import nodemailer from "nodemailer"

const getMail = async (req,res,)=>{
    let ticket = req.body
    let transporter = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        auth: {
          user: "xiaomishain@gmail.com",
          pass: "efmlkuasnwhazpgq"
        }
      });

      let info = await transporter.sendMail({
        from: '"Xiao" <xiaomishain@gmail.com>', // direccion de envio
        to: `${ticket.user}`, // lista de quienes reciben
        subject: `Compra`, // Asunto
        text: "Hello world?", // Texto plano
        html: `<p>Su compra se ha realizado con éxitoa</p>` // Email html
      });

    res.send("success")
}

export{
    getMail
}

