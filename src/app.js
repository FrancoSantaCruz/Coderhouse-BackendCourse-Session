import express from 'express';
import { __dirname } from './utils.js';
import handlebars from 'express-handlebars';
import './db/config.js'
import { Server } from 'socket.io'

import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';

// Routers Import
import viewsRouter from './routes/views.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import messagesRouter from './routes/messages.router.js';
import authRouter from './routes/auth.router.js';

// Managers Import
import { messagesManager } from './dao/manager/messages.manager.js';
import { userManager } from './dao/manager/users.manager.js'
import { productsManager } from './dao/manager/products.manager.js';
import { cartsManager } from './dao/manager/carts.manager.js';

// Middleware Import
import checkSession from './middlewares/auth.middleware.js';

const app = express();

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

const URI = 'mongodb+srv://sczfranco:eKJpl0PNLwq3JxVB@codercluster.fapa9ve.mongodb.net/session?retryWrites=true&w=majority'
app.use(session({
    secret: "SECRETKEY",
    cookie: {
        maxAge: 5 * 60 * 1000
    },
    store: new MongoStore({
        mongoUrl: URI
    })
}))



// Middleware global
app.use(checkSession)


// Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');


const httpServer = app.listen(8080, () => {
    console.log("Listening server on port 8080. \nhttp://localhost:8080/ ");
});

const socketServer = new Server(httpServer);

// Routes
app.use('/', viewsRouter)
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/chats', messagesRouter);
app.use('/api/auth', authRouter);


// ----------------------------- WebSocket ------------------------------------
socketServer.on("connection", (socket) => {

    // -------------------------USER SOCKET--------------------------------
    let userFound
    socket.on("userJoin", async (user) => {
        userFound = await userValidator(user.email)
        socket.broadcast.emit("newUserBroadcast", userFound)
    })
    // -------------------------------------------------------------


    // -----------------------CHAT SOCKET--------------------------------
    socket.on("message", async (info) => {
        // Creo un objeto con la misma estructura que el schema de message.
        let obj = {
            chats: [
                {
                    autor: userFound._id,
                    content: info.message,
                    date: new Date()
                }
            ]
        }
        // Valido si el chat existe en la DB
        let chatFound = await chatValidator(info.cid)
        // Si no existe, crea un nuevo chat con el mensaje nuevo.
        // Si existe el chat, agrega a ese chat los mensajes.
        if (!chatFound) {
            await messagesManager.createOne(obj)
            
        } else {
            chatFound.chats = [...chatFound.chats, ...obj.chats]
            await messagesManager.updateOne(info.cid, chatFound)
        }

        const chat = await messagesManager.findByID(info.cid)
        socketServer.emit("chat", chat.chats);
    })
    // ----------------------------------------------------------------------


    // -----------------------PRODUCTS SOCKET--------------------------------
    socket.on("product", async (product) => {
        await productsManager.createOne(product)

        const products = await productsManager.findAll()
        socketServer.emit("allProducts", products)
    })

    socket.on("addCart", async (obj) => {
        const {product_id, cart_id} = obj
        
        const x = await cartsManager.addProdToCart(cart_id, product_id)
        console.log("----------------------")
        console.log("X")
        console.log(x);
        console.log("----------------------")

        const cartProducts = await cartsManager.findByID(cart_id)
        console.log("----------------------")
        console.log("cartPorducts.cart")
        console.log(cartProducts.cart);
        console.log("----------------------")
        socket.emit('cartProducts', cartProducts.cart)
    })
})

async function userValidator(email) {
    const obj = { email: email }
    const user = await userManager.findByField(obj)
    return user
}

async function chatValidator(id) {
    const obj = { _id: id }
    const chat = await messagesManager.findByField(obj)
    return chat
}