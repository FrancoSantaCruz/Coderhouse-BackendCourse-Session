import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: "Carts"
    },
    date: {
        type: Date,
        default: Date.now
    }
})

export const userModel = model('Usuario', userSchema)