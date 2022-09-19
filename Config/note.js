const mongoose=require("mongoose");
require("dotenv").config();

const connection= mongoose.connect(process.env.MONGO_NOTE_URL)

module.exports={
    connection
}