var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
	title: String,
	date: String,
	text: String,
	upvotes: {type: Number, default: 0},
	comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
});

//method to add one to the upvote count then save it.
PostSchema.methods.upvote = function(cb){
	this.upvotes += 1;
	this.save(cb);
};

PostSchema.methods.downvote = function(cb) {
  this.upvotes -= 1;
  this.save(cb);
}


module.exports = mongoose.model('Post', PostSchema);