import mongoose from "mongoose";
const URI = 'mongodb+srv://sczfranco:eKJpl0PNLwq3JxVB@codercluster.fapa9ve.mongodb.net/ecommerce?retryWrites=true&w=majority'

mongoose
    .connect(URI)
    .then((db) => console.log("DB is connected"))
    .catch((err) => console.log(err))