//Contains the logic for the entire database initialisation.

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
.then(() => {
    console.log("Connection Established");
})
.catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/stayeasy");
}

for(dt of initData.data)
{
    dt.owner = "67f229faaa5502ee2599f1dc";
}

const initDB = async () => {
    //Clearing the entire DB
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data Was Initialised");
}

initDB();


