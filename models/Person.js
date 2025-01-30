const mongoose = require("mongoose");

const peopleSchema = new mongoose.Schema({
    firstName:String,
    lastName:String,
    email:String
});

const Person = mongoose.model("Person", peopleSchema, "peopledata");

module.exports = Person;