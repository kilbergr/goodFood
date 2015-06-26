var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/foodrecalled");
mongoose.set("debug", true);

module.exports.Recall = require("./recall");
module.exports.MyRecall = require("./myRecall");
module.exports.User=require('./user');
