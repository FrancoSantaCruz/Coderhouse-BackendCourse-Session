import { Router } from "express";
import { productsManager } from '../dao/manager/products.manager.js'
import { cartsManager } from "../dao/manager/carts.manager.js";
import { messagesManager } from "../dao/manager/messages.manager.js";

const router = Router()

// HOME
router.get('/', (req, res) => {
    res.render('home')
})



router.get('/login', async (req, res) => {
    res.render('login')
})

router.get('/signup', async (req, res) => {
    res.render('signup')
})

// No puedo implementar Paginate a websocket
router.get('/productsWS', async (req, res) => {
    const products = await productsManager.findAll()
    // console.log(products);
    res.render('productsWS', { products: products, style: "products"})
})

// View de products con paginate pero sin websocket
router.get('/products', async (req, res) => {
    const products = await productsManager.findAllPg(req.query)
    
    const obj = JSON.parse(JSON.stringify(products))
    res.render('products', { products: obj.payload, style: "products", info: obj})
}) 

router.get('/product/:pid', async (req, res) => {
    const { pid } = req.params
    const product = await productsManager.findByID(pid)
    res.render('oneProduct', { product })
})


// CARTS VIEWS
router.get('/cart/:cid', async (req, res) => {
    const { cid } = req.params
    const cart = await cartsManager.findByID(cid)
    res.render('cart', { cart: cart.cart })
})


// CHATS VIEWS
router.get("/chats", async (req, res) => {
    const chats = await messagesManager.findAll()
    res.render("chats", { chats });
});

router.get("/chat/:cid", async (req, res) => {
    const { cid } = req.params
    const chat = await messagesManager.findByID(cid)
    res.render("chat", { chat: chat._id, messages: chat.chats });
});





export default router