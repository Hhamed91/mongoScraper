var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

module.exports = function (app) {

    // route to scrape jobs from ziprecruiter website and save/add each job to jobs collection

    app.get("/scrape", function (req, res) {
        db.Jobs.deleteMany({}, function (err) { // remove all old jobs 
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
                res.send("Scrape for new job is complete");
            })
        });
    });


    // route to get all scraped jobs from jobs table
    app.get("/jobs", function (req, res) {
        db.Jobs.find({})
            .then(function (dbJobs) {
                res.json(dbJobs);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    // route to clear/delete all scraped jobs in jobs collection
    app.delete("/jobs", function (req, res) {
        db.Jobs.deleteMany({}, function (err) {
            if (err) throw err;
            res.send("Clear complete. No more jobs listed");
        });
    });


    // route to save jobs  
    app.post("/save/:id", function (req, res) {
        db.Jobs.findOne({ _id: req.params.id }) // grab the job (that needs to be saved) from job collection
            .then(function (dbJobs) {

                db.savedJobs.findOne({ title: dbJobs.title }) // check if the jobs already exists in savedJobs collection
                    .then(function (dbsavedJobs) {

                        if (dbsavedJobs) { // if found, return "already saved"
                            res.send("Job already saved")
                        } else { // if not found, then add/insert to savedJobs collection
                            var newJobs = {};
                            newJobs.title = dbJobs.title;
                            newJobs.link = dbJobs.link;
                            newJobs.summary = dbJobs.summary;

                            db.savedJobs.create(newJobs)
                                .then(function () {
                                    res.send("Jobs saved");
                                })
                                .catch(function (err) {
                                    res.send(err);
                                });
                        }
                    }).catch(function (err) {
                        res.send(err);
                    });
            })
            .catch(function (err) {
                res.send(err);
            });
    });

    // route to get all saved jobs from SavedJobs collection
    app.get("/savedJobs", function (req, res) {
        db.savedJobs.find({})
            .then(function (dbsavedJobs) {
                res.json(dbsavedJobs);
            })
            .catch(function (err) {
                res.json(err);
            });
    });


    // route to clear/delete all saved jobs in SavedJobs collection
    app.delete("/savedJobs", function (req, res) {
        db.savedJobs.deleteMany({}, function (err) {
            if (err) throw err;
            res.send("Clear Complete");
        });
    });

     // route to clear/delete ONE saved job in savedJobs collection
     app.delete("/savedJobs/:id", function (req, res) {
        db.savedJobs.deleteOne({ _id: req.params.id }, function (err) {
            if (err) throw err;
            res.send("Delete Complete");
        });
    });













}