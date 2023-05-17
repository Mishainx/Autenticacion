import { cartsTest } from "./modules/SuperTestCarts.test.js";
import { productsTest } from "./modules/SuperTestProducts.test.js";
import { sessionsTest } from "./modules/SuperTestSessions.test.js";

/* Testing :
1) Iniciar el servidor
2) Seleccionar test
- npm test: ejecuta los 3 módulos de testing
- npm test -- -products: ejecuta el módulo de products
- npm test -- -carts: ejecura el módulo de carts
- npm test -- -sessions: ejecuta el módulo de sessions
*/

let testType = process.argv[3]

    switch(testType) {
        case "-products":
            productsTest()
        break;
        case "-sessions":
            sessionsTest()
        break;
        case "-carts":
            cartsTest()
        break;
        default:
            productsTest()
            sessionsTest()
            cartsTest()
}