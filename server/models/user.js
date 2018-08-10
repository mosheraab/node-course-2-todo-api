// schema for user
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 50,
		//match: '/^[a-zA-Z0-9\.]+@[a-zA-Z0-9\.]+',
		trim: true,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message:'{VALUE} is not a valid email'
		}
	},
	password: {
		type:String,
		required: true,
		minlength: 6,
		maxlength: 128
	},
	tokens: [{ // authenticaiton tokens
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}
	}]
});

UserSchema.methods.toJSON = function () {
	var user = this;
	var userObject = user.toObject();
	
	return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
	var user = this;
	var access = 'auth';
	var token = jwt.sign({_id: user._id.toString(), access}, 'abc123'/* to move to config file*/).toString();
	
	user.tokens = user.tokens.concat([{access, token}]);
	return user.save().then( () => {
		return token;
	});
}

var User = mongoose.model('Users', UserSchema);

module.exports = {User};