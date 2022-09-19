const mongoose=require("mongoose");

const noteSchema= new mongoose.Schema({
    heading:String,
    note:String,
    tag:String,
    token:String
})

const NoteModel= mongoose.model("note", noteSchema);

module.exports={
    NoteModel
}