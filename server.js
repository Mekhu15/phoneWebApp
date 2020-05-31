const express = require("express");
const mongoose = require("mongoose");
const app = express();
const body_parser = require('body-parser');
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const DATABASE_NAME = "phone";
const PORT =   process.env.PORT || 8080;
const cors = require("cors");
const path = require('path');

app.use(body_parser.json())
app.use(body_parser.urlencoded({extended:true}))
app.use(cors())

const uri = 'mongodb+srv://shopping:mekhla@cluster0-rqmdw.mongodb.net/test?retryWrites=true&w=majority';

var database = null;
var collection = null;

//connection established
app.listen(PORT, () => {
    MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
         database = client.db(DATABASE_NAME);
         collection = database.collection("data");
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
});

//fetching data
app.get("/home", (request, response) => {
    collection.find({}).sort({name: 1}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

    // to add contacts
app.post("/home", (request, response) => {
    var item = {
        name: request.body.name,
        phoneNumber: request.body.phoneNumber,
        email: request.body.email,
        dateOfBirth: request.body.dateOfBirth
    }
    collection.insertOne(item, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});
  

//to read data
app.get("/home/:id", (request, response) => {
     var id = request.params.id;
    collection.findOne({_id: ObjectId(id)},function(error,result) {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});


//to delete the contact
app.delete("/home/:id", (request, response) => {
    var id = request.params.id;
    console.log(id);
    collection.deleteOne({_id: ObjectId(id)}, function(error, result) {
        if (error) throw error;

        console.log("item is deleted from the database");
        response.send(result);
    });
});


//  to edit the list 
app.put("/home/:id", async(request, response) => {
    var item = request.body;
    console.log(item);
      var id = request.params.id;
      console.log(id);
    await collection.updateOne({ _id: ObjectId(id) }, { $set: item }, function(error, result) {
        if (error) throw error;
        response.send(result);
    });
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static( 'client/build' ));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html')); // relative path
    });
}