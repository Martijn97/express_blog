var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
	body: String,
	user: String,
	upvotes: {type: Number, default: 0},
	post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'}
});

//method to add one to the upvote count then save it.
CommentSchema.methods.upvote = function(cb){
	this.upvotes += 1;
	this.save(cb);
};

CommentSchema.methods.downvote = function(cb){
	this.upvotes -= 1;
	this.save(cb);
};

module.exports = mongoose.model('Comment', CommentSchema);