//Express
import express from "express";
import session from "express-session";
//Passport
import passport from "passport";
import initializePassport from "./config/passport.config.js";
//Mongo
import MongoStore from "connect-mongo";
//Socket
import { Server } from "socket.io";
import { socketModule } from "./socket/socket.js";
//Cookie Parser
import cookieParser from "cookie-parser";
//Handlebars
import { engine } from "express-handlebars";
//Import Routes
import productsRouter from "./routes/products.routes.js";
import routerViews from "./routes/views.routes.js";
import messageRoute from "./routes/messages.routes.js";
import sessionsRouter from "./routes/sessions.routes.js";
import rootRouter from "./routes/root.routes.js";
import mailRouter from "./routes/mail.routes.js";
import mockingRouter from "./routes/mockingProducts.routes.js";
import loggerTestRouter from "./routes/logger.routes.js";
import usersRouter from "./routes/users.routes.js";
import cartsRouter from "./routes/carts.routes.js";
//Errors
import errorHandler from "./middlewares/errors.js";

//Config
import flash from "connect-flash"
import config from "./config/config.js";
import { addLogger } from "./config/logger.js";
import { __dirname } from './config/utils.js';
const mensajes = []

const PORT = config.PORT ;
const DB_USER = config.DB_USER;
const DB_PASS = config.DB_PASS;
const DB_NAME = config.DB_NAME;
const DB_CLUSTER = config.MONGO_CLUSTER
const STRING_CONNECTION = `mongodb+srv://${DB_USER}:${DB_PASS}${DB_CLUSTER}${DB_NAME}?retryWrites=true&w=majority`

export const app = express();

//Configuración del servidor
const httpServer = app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});

//Inicialización Socket server
const socketServer = new Server(httpServer)

//Middelware para trabajar con archivos .Json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser y connect-flash
app.use(cookieParser(config.COOKIE_SECRET));
app.use(flash())
app.use(addLogger)

//Express sessions middleware
let sessionMiddleware = session({
  secret: config.SESSION_SECRET,
  resave: true,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: STRING_CONNECTION,
    mongoOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    ttl: 1000,
  }),
})
app.use(sessionMiddleware);

//MiddleWare para usar el contexto de express sessions en socket
socketServer.use(function(socket,next){
  sessionMiddleware(socket.request, socket.request.res, next);
})

//Configuración passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname+"/src/views")
app.use(express.static(__dirname +'/public'));

app.post("/socketMessage", (req, res) => {
  const { message } = req.body;
  socketServer.emit("message", message);
  res.send("ok");
});

// Middleware para agregar a las variables locales del objeto Response los datos de sesión.
app.use((req, res, next)=>{ 
  res.locals.session = req.session;
  next();
})

//socket
socketModule(socketServer)

//Rutas express
app.use("/messages", messageRoute);
app.use('/api/views', routerViews)
app.use("/api/users", usersRouter)
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/mail", mailRouter)
app.use("/mockingproducts", mockingRouter)
app.use("/loggerTest", loggerTestRouter)
app.use("/", rootRouter) // Manejo de ruta raíz
app.use(errorHandler)

