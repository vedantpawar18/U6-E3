const express= require("express");
const {connection}=require("./Config/db")
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {noteRouter}= require("./Routes/note.routes")
const app=express();
app.use(express.json())
const { UserModel}= require("./Model/user.model")

app.get("/", (req,res)=>[
    res.send("Welcome to home page")
]);

app.use("/notes", noteRouter)

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