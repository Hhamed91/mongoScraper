var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var JobSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  }
});

var Job = mongoose.model("Job", ArticleSchema);

module.exports = Job;
