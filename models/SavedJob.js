var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var SavedJobSchema = new Schema({
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
  },
  notes: [{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }]
});

var SavedJob = mongoose.model("SavedJob", SavedJobSchema);

module.exports = SavedJob;
