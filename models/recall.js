var mongoose = require("mongoose");

var recallSchema = new mongoose.Schema({
  foodType: String,
	location: String,
	dateBegin: String,
	dateEnd: String,
	desc: String,
	reason: String,
	dist: String,
	firm: String,
	date: String,
	class: String
})
var Recall = mongoose.model("Recall", recallSchema);
module.exports = Recall;

