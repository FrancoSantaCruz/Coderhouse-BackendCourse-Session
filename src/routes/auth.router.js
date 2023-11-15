import { Router } from "express";
import { userManager } from "../dao/manager/users.manager.js";
import { cartsManager } from "../dao/manager/carts.manager.js";

const router = Router();

router.post('/login', async (req,res) => {
    const { email, password } = req.body;
    const userDB = await userManager.findByField({'email':email})
    if(!userDB){
        return res.json({ error: "This email does not exists" })
    }

    req.session["email"] = email;
    req.session["cart"] = userDB.cart;
    req.session["first_name"] = userDB.first_name;

    if( email == "adminCoder@coder.com" && password === "Cod3r123"){
        req.session["isAdmin"] = true;
    }

    res.redirect("/home")
})

router.post('/signup', async (req,res) => {
    const cart = await cartsManager.createOne({});
    const user = { ...req.body, cart: cart._id};
    const createdUser = await userManager.createOne(user);
    res.status(200).json( { message: 'User created', createdUser});
})

export default router;

// let userFound
//     socket.on("newUser", async (user) => {

//         userFound = await userValidator(user[1])
//         if (!userFound) {
//             const cart = await cartsManager.createOne({})
//             let obj = {
//                 name: user[0],
//                 email: user[1],
//                 password: user[2],
//                 cart: cart._id
//             }
//             userFound = await userManager.createOne(obj)
//             socket.broadcast.emit("newUserBroadcast", user[0])
//         } else {
//             // No hago uso de createOne porque el usuario ya existe
//             // Pero si hago el emit siguiendo el flujo del websocket
//             socket.broadcast.emit("newUserBroadcast", userFound)
//         }
//     })