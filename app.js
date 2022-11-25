const express = require('express');
const app = express();

app.get("/", function(req, res){
    res.render('home');
  });

  app.get("/whatsnew.ejs", function(req, res){
    res.render('whatsnew');
  });

app.listen(3000, function()
  {console.log("Server started on port 3000");}
);

app.set("view engine", "ejs");
