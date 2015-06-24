var mongoose = require("mongoose");

var recallSchema = new mongoose.Schema({
	desc: String,
	reason: String,
	dist: String,
	firm: String,
	date: String,
	class: String,
})
var Recall = mongoose.model("Recall", recallSchema);
module.exports = Recall;

