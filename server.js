var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");

var app = express();
var PORT = process.env.PORT || 8080;


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
