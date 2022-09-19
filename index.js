const express= require("express");
const {connection}=require("./Config/db")
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app=express();
app.use(express.json())
const { UserModel}= require("./Model/user.model")
const {NoteModel}=require("./Model/note.model")

app.get("/", (req,res)=>[
    res.send("Welcome to home page")
]);

app.post("/signup", async(req,res)=>{
    let {email, password,age}= req.body;
    bcrypt.hash(password, 6).then(async function(hash){
    const user= new UserModel({email, password:hash,age})
    await user.save()
    res.send("sign up successful")
    })
    .catch(()=>{
        res.send("something went wrong")
    })
    
})

app.post("/login",async(req,res)=>{
    let {email, password}= req.body;
    let user= await UserModel.findOne({email})
    let hash = user.password;
    bcrypt.compare(password, hash, function(err,result){
        if(result){
            var token = jwt.sign({ email:email }, 'secret');
            res.send({"msg":"login successful", "token":token})
        }
        else{
            res.send("Login Failed, invalid creds")
        }
    })
})

app.post("/note/create", (req,res)=>{
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

app.get("/note", (req,res)=>{
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

app.put("/note/:id", (req,res)=>{
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

app.delete("/note/:id", (req,res)=>{
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


app.listen(8080,async()=>{
    try{
        await connection 
        console.log("connected to db successfully")
    }
    catch(err){
        console.log("err connecting to db")
        console.log(err)
    }
    console.log("listening to port 8080")
})