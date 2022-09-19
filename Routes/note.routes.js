const {Router}=require("express");
const noteRouter= Router();
const {NoteModel}= require("../Model/note.model")
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

noteRouter.post("/create", (req,res)=>{
    const token=req.headers.authorization.split(" ")[1]
    jwt.verify(token, 'secret', async function(err, decoded) {
        if(err){
            res.send("please login")
        }
        else{
            const {heading, note,tag}= req.body;
            const new_note=new NoteModel({heading,note,tag,token})
            await new_note.save();
            res.send("Successfully added")
        }
      });
})

noteRouter.get("/", (req,res)=>{
    const token=req.headers.authorization.split(" ")[1]
    jwt.verify(token, 'secret', async function(err, decoded) {
        if(err){
            res.send("please login")
        }
        else{
            const result= await NoteModel.find({token:token});
            res.send(result) 
        }
      });
})

noteRouter.put("/:id", (req,res)=>{
    var idparam = req.params["id"]
    const token=req.headers.authorization.split(" ")[1]
    jwt.verify(token, 'secret', async function(err, decoded) {
        if(err){
            res.send("please login")
        }
        else{
            const payload=req.body;
            await NoteModel.updateOne({id:idparam,token:token},{$set:{heading:payload.heading, note:payload.note, tag:payload.tag}})
            res.send("note updated")
        }
      });
})

noteRouter.delete("/:id", (req,res)=>{
    var idparam = req.params["id"]
    const token=req.headers.authorization.split(" ")[1]
    jwt.verify(token, 'secret', async function(err, decoded) {
        if(err){
            res.send("please login")
        }
        else{
            var id = req.params["id"]
            await TodoModel.deleteOne({id:id, token:token})
            res.send("note deleted")
        }
      });
})


module.exports= {noteRouter}