//requirements
var express = require("express");
var exphbs = require('express-handlebars');
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
//require models
var db = require("./models");
//port variable
var PORT = process.env.PORT || 3000;

// Initialize Express 
var app = express();

//handlebars boilerplate
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Use morgan logger for logging requests 
app.use(logger("dev"));
// Use body-parser for handling form submissions 
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory 
app.use(express.static("public"));

// By default mongoose uses callbacks for async queries, we're setting it to use promises (.then syntax) instead 
// Connect to the Mongo DB 
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/tech-scraperdb", {
    // useMongoClient: true
});


app.listen(PORT, function(){
    console.log("Listening on port " + PORT)
});