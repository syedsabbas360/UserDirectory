const express = require('express');
const path = require('path');
// importing the data.js file
const mustacheExpress = require('mustache-express');
const app = express();

app.engine('mustache', mustacheExpress());
app.set('views', './views')
app.set('view engine', 'mustache')
app.use(express.static(__dirname + '/public'))


const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient
const url = 'mongodb://localhost:27017/robots';

app.get("/", function(req, res) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      throw err;
    } else {
      console.log("Successfully connected to the database");
    }
    const data = require("./data");
    for (var i = 0; i < data.users.length; i++) {
      const user = data.users[i];
      db.collection("users").updateOne({
        id: user.id
      }, user, {upsert: true})
    }
    db.collection("users").find().toArray(function(err, documents) {
      console.log(documents)
      res.render("robots", {robots: documents})
    })
  })
})

app.get('/unemployed', function(req,res){
  MongoClient.connect(url, function(err, db) {
    if (err) {
      throw err;
    } else {
      console.log('Successfully connected to the database');
    }
    db.collection("users").find({job: null}).toArray(function(err, documents) {
      console.log(documents)
      res.render("robots", {robots: documents})
    })
  })
})

app.get("/employed", function(req,res){
  MongoClient.connect(url, function(err, db) {
    if (err) {
      throw err;
    } else {
      console.log('Successfully connected to the database');
    }
    db.collection("users").find({job: {$nin: [null]}}).toArray(function(err, documents) {
      console.log(documents)
      res.render("robots", {robots: documents})
    })
  })
})

app.get('/:id', function (req, res) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      throw err;
    } else {
      console.log('Successfully connected to the database');
    }
    db.collection("users").find({id: parseInt(req.params.id)}).toArray(function(err, documents) {
      console.log(documents)
      res.render("individual", {robots: documents})
    })
  })
  // const user = parseInt(req.params.id) - 1
  // const userId = data.users[user]
  // // accessing the users inside the data.js file
  //   res.render(‘individual’,{userId: userId})
})


app.listen(3000, function() {
  console.log('Successfully started express application!');
})
