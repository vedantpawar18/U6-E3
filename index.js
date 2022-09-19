const express= require("express")
const app=express();

app.get("/", (req,res)=>{
    res.send("Welcome to the home page");
})




app.listen(8080, async()=>{
    console.log("listening to port 8080")
})