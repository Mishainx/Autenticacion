import dotenv from 'dotenv'

dotenv.config();

export default{
    PORT: process.env.SERVER_PORT || 8181,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_NAME: process.env.DB_NAME,
    CLIENT_ID_GITHUB: process.env.CLIENT_ID_GITHUB,
    CLIENT_SECRET_GITHUB: process.env.CLIENT_SECRET_GITHUB,
    CALLBACK_URL_GITHUB: process.env.CALLBACK_URL_GITHUB,
    MONGO_CLUSTER : process.env.MONGO_CLUSTER,
    MAIL_SERVICE: process.env.MAIL_SERVICE,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASS: process.env.MAIL_PASS,
    MAIL_PORT: process.env.MAIL_PORT,
    SESSION_SECRET: process.env.SESSION_SECRET,
    COOKIE_SECRET: process.env.COOKIE_SECRET,
    PERSISTENCE: process.argv.includes("memory")? "MEMORY" : "MONGO",
    ENVIROMENT: process.argv.includes("prod")? "PROD" : "DEV",
    TEST: process.argv.includes("products")? "products": "prueba",
    TEST_USER : process.env.TEST_USER,
    TEST_PASSWORD : process.env.TEST_PASSWORD
}