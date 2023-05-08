import { generateProduct } from "../config/utils.js";

export const mockingProducts = async (req, res) => {
    try {
        let products = []
        console.log("hola")
        for (let i=0; i<100;i++){
            products.push(generateProduct())
        }
        res.status(200).send(products)
    } catch (err) {
        req.logger.error(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()}`)
        res.status(500).send(err);
    }
}