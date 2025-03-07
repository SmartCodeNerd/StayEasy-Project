const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;


async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/stayeasy");
}

main()
.then(() => {
    console.log("Connected to DataBase");
})
.catch((err) => {
    console.log(err);
})

app.get("/" , (req,res) => {
    res.send("Welcome to Root Page");
})

app.listen(port, () => {
    console.log("Server has Started");
})