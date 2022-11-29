const express = require('express');
const app = express();

app.get("/", function(req, res){
    res.render('home');
  });

app.get("/whatsnew.ejs", function(req, res){
    res.render('whatsnew');
  });

app.use(express.urlencoded({extended: true}));

app.set("view engine", "ejs");

//Cookie Parser
const https = require('https');
const cookieParser = require('cookie-parser');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

app.use(cookieParser());

//Connect MongoDB
const MongoClient = require('mongodb').MongoClient;

const CONNECTION_URL = "mongodb+srv://avery:database123@cluster0.glpulob.mongodb.net/?retryWrites=true&w=majority";
const DATABASE_NAME = "database"; // you can change the database name
var database, collection;

MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
  if(error) throw error;

  database = client.db(DATABASE_NAME);
  collection = database.collection("newcollection"); // you can change the collection name

  // Start the application after the database connection is ready
  app.listen(3000, function()
  {console.log("Server started on port 3000");}
  );
});

app.post("/", function(req, res){
  collection.insertOne(req.body, (err, result) => {  
    if (err) return console.log(err)
    console.log('saved to database')
  })

  //Submit form to HubSpot API
  function formv3(){
    // Create the new request 
    var xhr = new XMLHttpRequest();
    var url = 'https://api.hsforms.com/submissions/v3/integration/submit/20714197/ce05e19e-aff1-4b7d-ae2d-8742f22fc297'
    
    // Example request JSON:
    var data = {
      "fields": [
        {
          "name": "email",
          "value": req.body.email
        },
        {
          "name": "firstname",
          "value": req.body.firstname
        }
      ],
      "context": {
        "hutk": req.cookies.hubspotutk,
        "pageUri": "http://www.portfolio.com/contact",
        "pageName": "Portfolio contact me"
      }
    }

    var final_data = JSON.stringify(data)

    xhr.open('POST', url);
    // Sets the value of the 'Content-Type' HTTP request headers to 'application/json'
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) { 
            console.log(xhr.responseText); // Returns a 200 response if the submission is successful.
        } else if (xhr.readyState == 4 && xhr.status == 400){ 
            console.log(xhr.responseText); // Returns a 400 error the submission is rejected.          
        } else if (xhr.readyState == 4 && xhr.status == 403){ 
            console.log(xhr.responseText); // Returns a 403 error if the portal isn't allowed to post submissions.           
        } else if (xhr.readyState == 4 && xhr.status == 404){ 
            console.log(xhr.responseText); //Returns a 404 error if the formGuid isn't found     
        }
       }

    // Sends the request 
    
    xhr.send(final_data)
 }

 formv3();
 res.redirect('/') // or do something else here

});