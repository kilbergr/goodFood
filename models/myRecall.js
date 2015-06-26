var mongoose = require("mongoose");

var myRecallSchema = new mongoose.Schema({
	desc: String,
	reason: String,
	dist: String,
	firm: String,
	date: String,
	class: String
})
var MyRecall = mongoose.model("MyRecall", myRecallSchema);
module.exports = MyRecall;

