var mongoose = require("mongoose");
var dateC = new Date();
var dateComment = (dateC.getMonth() + 1) + "/" + dateC.getDate() + "/" + dateC.getFullYear().toString().substr(2,2);

var commentSchema = new mongoose.Schema ({
												content: {
													type: String,
													required: true},
												date: {
													type: String,
													default: dateComment
													},
												myRecall: {
													type: mongoose.Schema.Types.ObjectId,
													ref: "MyRecall"
													},
												user: {
													type: mongoose.Schema.Types.ObjectId,
													ref: "User"
													}
											});

var Comment = mongoose.model("Comment", commentSchema);

//making sure models were properly set up--checked so commented out
//Comment.find({}).populate('post').exec(function(err, comment){
	// console.log(comment.post);
 // });
module.exports = Comment;