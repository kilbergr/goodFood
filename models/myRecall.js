var mongoose = require("mongoose");

var myRecallSchema = new mongoose.Schema({
	product_description: String,
	reason_for_recall: String,
	distribution_pattern: String,
	recalling_firm: String,
	report_date: String,
	classification: String
})
var MyRecall = mongoose.model("MyRecall", myRecallSchema);
module.exports = MyRecall;

