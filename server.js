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
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/tech-scraperdb";
// Connect to the Mongo DB 
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
    //useMongoClient: true
});

//routes
//route for home page
app.get("/", function(req, res){
    res.render("home")
});

//route for saved articles
app.get("/saved", function(req, res){
    res.render("saved_posts")
});

//get route to scrape phandroid
app.get("/scrape", function (req, res) {


    //grab body of phandroid html
    axios.get("https://phandroid.com/")
        .then(function (response) {
            var $ = cheerio.load(response.data)
            //grab title
            $("article").each(function (i, element) {
                //temporary variable for response
                var result = {};
                //grab title of articles   
                result.title = $(this)
                    .find("h3.entry-title")
                    .find("a")
                    .text();
                //grab link or articles
                result.link = $(this)
                    .find("h3.entry-title")
                    .find("a")
                    .attr("href");
                //grab summary of articles
                result.summary = $(this)
                    .find("div.col.t8.s8")
                    .find("p")
                    .find("span")
                    .text();
                //grab image of articles
                result.image = $(this)
                    .find("div.col-card-image")
                    .find("div.card-image")
                    .find("a")
                    .find("img")
                    .attr("src");

                //create article with result object
                db.Article.create(result)
                    .then(function (dbArticle) {
                        console.log(dbArticle)
                    })
                    .catch(function (err) {
                        return res.json(err);
                    });
            });
            res.send("Scrape Complete");
            console.log(result)
        })
});

//route to get all articles
app.get("/articles", function(req, res){
    db.Article.find({})
    .then(function(dbArticle){
        res.json(dbArticle)
    })
    .catch(function(err){
        res.json(err);
    });
});

//route to get article with id with note
app.get("/articles/:id", function(req, res){
    db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    });
});

//route for creating and updating notes
app.post("/articles/:id", function(req, res){
    db.Note.create(req.body)
    .then(function(dbNote){
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle){
        res.json(db)
    })
    .catch(function(err){
        res.json(err);
    });
});




app.listen(PORT, function () {
    console.log("Listening on port " + PORT)
});