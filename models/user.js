// schema for user
const mongoose = require('mongoose');

var User = mongoose.model('Users', {
	email: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 50,
		//match: '/^[a-zA-Z0-9\.]+@[a-zA-Z0-9\.]+',
		trim: true
	},
});

module.exports = {User};