var mongoose = require("mongoose");

var recallQuerySchema = new mongoose.Schema({
	foodType: String,
	location: String,
	dateBegin: String,
	dateEnd: String,
})
var RecallQuery = mongoose.model("RecallQuery", recallQuerySchema);
module.exports = RecallQuery;

