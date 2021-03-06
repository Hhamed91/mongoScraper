var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

module.exports = function (app) {

    // route to scrape jobs from ziprecruiter website and save/add each job to jobs collection

    app.get("/scrape", function (req, res) {

        db.Job.deleteMany({}, function (err) { // remove all old articles 
            if (err) throw err;

            axios.get("https://www.npr.org").then(function (response) {
                var $ = cheerio.load(response.data);

                $(".story-text").each(function (i, element) {
                    var result = {};

                    result.title = $(this).children("a").children("h3.title").text();
                    result.link = $(this).children("a").attr("href");
                    result.summary = $(this).children("a").children("p.teaser").text();;

                    db.Job.create(result) // then add new ones
                        .then(function (dbJob) {
                            console.log(dbJob);
                        })
                        .catch(function (err) {
                            console.log(err);
                        });
                });
                res.send("Scrape Complete");
            })
        });
    });

    //     db.Job.deleteMany({}, function (err) { // remove all old jobs 
    //         if (err) throw err;


    //         //https://www.ziprecruiter.com/candidate/search?search=developer&location=San+Francisco%2C+CA
    //         //https://stackoverflow.com/jobs?q=full+stack&l=San+Francisco%2C+CA%2C+USA&d=20&u=Miles
    //         //https://www.reddit.com/r/SFBayJobs/

    //         axios.get("https://www.npr.org").then(function (response) {
    //             // console.log(response.data)
    //             var $ = cheerio.load(response.data);
                
    //             $(".story-text").each(function (i, element) {
    //                 var result = {};
    //                 //document.querySelector("#quiz-card-siriusd30544efd30544ef-5000546074506 > div.job_content > a > h2")
    //                 //#mainbar > div.js-search-results.flush-left > div > div.-item.-job.p24.pl48.bb.ps-relative.bc-black-2.js-dismiss-overlay-container._highlighted.pt32
    //                 result.title = $(this).children("a").children("h2.title").text();

    //                 //#quiz-card-siriusd30544efd30544ef-5000546074506 > div.job_content > a
    //                 result.link = $(this).children("a").attr("href");
    //                 //#quiz-card-siriusd30544efd30544ef-5000546074506 > div.job_content > p.job_snippet > a

    //                 result.summary = $(this).children("a").children("p.teaser").text();

    //                 db.Job.create(result) // then add new ones
    //                     .then(function (dbJobs) {
    //                         console.log(dbJobs);
    //                     })
    //                     .catch(function (err) {
    //                         console.log(err);
    //                     });
    //             });
    //             res.send("Scrape for new job is complete");
    //         })
    //     });
    // });




    // route to get all scraped jobs from jobs table
    app.get("/jobs", function (req, res) {
        db.Job.find({})
            .then(function (dbJobs) {
                res.json(dbJobs);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    // route to clear/delete all scraped jobs in jobs collection
    app.delete("/jobs", function (req, res) {
        db.Job.deleteMany({}, function (err) {
            if (err) throw err;
            res.send("Clear complete. No more jobs listed");
        });
    });


    // route to save jobs  
    app.post("/save/:id", function (req, res) {
        db.Job.findOne({ _id: req.params.id }) // grab the job (that needs to be saved) from job collection
            .then(function (dbJobs) {

                db.savedJob.findOne({ title: dbJobs.title }) // check if the jobs already exists in savedJobs collection
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
        db.savedJob.find({})
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

    // route to add a new note to a saved job
    app.post("/savedJobs/:id", function (req, res) {
        db.Note.create(req.body)
            .then(function (dbNote) {
                return db.savedJob.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id } }, { new: true });
            })
            .then(function (dbJobs) {
                res.json(dbJobs);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    // route to get a saved job populated with all its notes
    app.get("/savedJobs/:id", function (req, res) {
        db.savedJob.findOne({ _id: req.params.id })
            .populate("notes")
            .then(function (dbJobs) {
                res.json(dbJobs);
            })
            .catch(function (err) {
                res.json(err);
            });
    });



    // route to delete a note for a saved job
    app.delete("/notes/:id", function (req, res) {
        db.Note.deleteOne({ _id: req.params.id }, function (err) {
            if (err) throw err;
            res.send("Delete Note Complete");
        });
    });

};