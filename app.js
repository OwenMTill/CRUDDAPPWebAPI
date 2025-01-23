const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = process.env.port||3000;

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));

const mongoURI = "mongodb://localhost:27017/crudapp";

mongoose.connect(mongoURI);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB Connection Error"));

db.once("open", ()=>{
    console.log("Connected to MongoDB Database");
});

const peopleSchema = new mongoose.Schema({
    firstName:String,
    lastName:String,
    email:String
});

const Person = mongoose.model("Person", peopleSchema, "peopledata");

app.get("/", (req,res)=>{
    res.sendFile("index.html");
});

app.get("/people", async(req,res)=>{
    try{
        const peopledata = await Person.find();
        res.json(peopledata);
    } catch(err){
        res.status(500).json({error:"Failed to get people"})
    }
});

app.get("/people/:id", async (req,res)=>{
    try{
        const person = await Person.findById(req.params.id);
        if (!person){
            return res.status(404).json({error:"Person not found"});
        }
        res.json(person);

    }catch(err){
        res.status(500).json({error:"Failed to get person"});
    }
});

app.post("/addperson", async (req,res)=>{
    try{
        const newPerson = new Person(req.body);
        const savePerson = await newPerson.save();
        //res.status(201).json(savePerson);
        res.redirect("/");
    }catch(err){
        res.status(501).json({error:"Failed to add new person"});
    }
});

app.put("/updateperson/:id", (req,res)=>{
    Person.findByIdAndUpdate(req.params.id, req.body, {
        new:true,
        runValidators:true
    }).then((updatedPerson)=>{
        if (!updatedPerson){
            return res.status(404).json({error:"Failed to find person"});
        }
        res.json(updatedPerson);
    }).catch((err)=>{
       res.status(400).json({error:"Failed to update person"});
    });
});

app.delete("/deleteperson/firstName", async (req,res)=>{
    try{
        const personname = req.query;
        const person = await Person.find(personname);

        if (person.length === 0){
            return res.status(404).json({error:"Failed to find person"});
        }
        const deletedperson = await Person.findOneAndDelete(personname);
        res.json({message:"Person Deleted Successfully"});

    }catch(err){
        console.log(err);
        res.status(404).json({error:"Person not found"});
    }
});

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});