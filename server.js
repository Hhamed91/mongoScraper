var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");

var app = express();
var PORT = process.env.PORT || 8080;


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// Handlebars
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoScraper";
// mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

mongoose.connect(MONGODB_URI, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });

// Routes
require("./routes/apiRoute")(app);
require("./routes/htmlRoute")(app);


// Starting the server ------------------------------------/
app.listen(PORT, function () {
    console.log(
        "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
        PORT,
        PORT
    );
});

module.exports = app;