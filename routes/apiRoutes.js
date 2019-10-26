var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

module.exports = function (app) {

    // route to scrape jobs from ziprecruiter website and save/add each job to Article collection

    app.get("/scrape", function (req, res) {
        db.Article.deleteMany({}, function (err) { // remove all old articles 
            if (err) throw err;


            //https://www.ziprecruiter.com/candidate/search?search=developer&location=San+Francisco%2C+CA

            axios.get("https://www.ziprecruiter.com/candidate/search?search=developer&location=San+Francisco%2C+CA").then(function (response) {
                var $ = cheerio.load(response.data);

                $(".job_content").each(function (i, element) {
                    var result = {};
                    //document.querySelector("#quiz-card-siriusd30544efd30544ef-5000546074506 > div.job_content > a > h2")
                    result.title = $(this).children("a").children("h2.title").text();

                    //#quiz-card-siriusd30544efd30544ef-5000546074506 > div.job_content > a
                    result.link = $(this).children("a").attr("href");
                    //#quiz-card-siriusd30544efd30544ef-5000546074506 > div.job_content > p.job_snippet > a

                    result.summary = $(this).children("a").children("p.job_snippet").text();

                    db.Jobs.create(result) // then add new ones
                        .then(function (dbJobs) {
                            console.log(dbJobs);
                        })
                        .catch(function (err) {
                            console.log(err);
                        });
                });
                res.send("Scrape Complete");
            })
        });
    });


  

}