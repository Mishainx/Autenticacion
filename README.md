Proyecto final e-commerce Coderhouse

Railway Deploy: https://backend-ecommerce-pf.up.railway.app
Repositorio Github: https://github.com/Mishainx/Autenticacion

Descripción del proyecto: Backend de un E-Commerce desarrollado con Node.JS y MongoDB con diseño de arquitectura en capas.

scripts:
    "start": "node src/app.js" ---> inicia el servidor
    "test": "mocha test/SuperTest.test.js" --> inicia el testing
    "dev": "nodemon src/app.js " --> inicia el modo desarrollo

                    <<<<<<<Comentarios>>>>>>>

POSTMAN adjunto:
En la carpeta postman encontrará un archivo .json que puede importarse a fin facilitar la prueba de las rutas.

TESTING:
1- Iniciar el servidor
2- Seleccionar test
 "npm test": ejecuta los 3 módulos de testing
 "npm test -- -products": ejecuta el módulo de products
 "npm test -- -carts": ejecuta el módulo de carts
 "npm test -- -sessions": ejecuta el módulo de sessions

Para realizar el testing correctamente es necesario configurar el .env con credenciales correspondientes a un usuario PREMIUM. Dentro del archivo .env.dist las variables a configurar serían: TEST_USER y TEST_PASSWORD

Patrón Factory:
Está implementado el patrón factory de modo tal que es posible switchear entre diferentes tipos de persistencia si existieran. Sin embargo sólo se encuentra implementado y desarrollado el DAO de MONGO.

MockingProducts:
/mockingproducts devuelve 100 productos generados con faker.js

Swagger:
/apidocs devuelve doc de las rutas requeridas durante la cursada.

UpgradeUser:
Si bien en los views figura un panel de control para usuarios accesible por el rol admin, la carga de documentos a un usuario para poder realizar el upgrade sólo puede realizarse a través de postman.

ENVIROMENT:
SERVER_PORT = ### Puerto
DB_USER = ### USER MONGO
DB_PASS = ### PASS MONGO
DB_NAME = ### Nombre base de datos
CLIENT_ID_GITHUB = ### Variable de github app
CLIENT_SECRET_GITHUB = ### Variable de github app
CALLBACK_URL_GITHUB = ### Variable de github app
MONGO_CLUSTER = ### Variable Mongo
MAIL_SERVICE = ### Variable de nodemailer (gmail)
MAIL_USER = ### Variable de nodemailer
MAIL_PASS = ### Variable de nodemailer
MAIL_PORT = ### Variable de nodemailer
SESSION_SECRET = ###
COOKIE_SECRET = ###
TEST_USER = ### Requiere usuario premium 
TEST_PASSWORD = ### Requiere usuario premium




