// schema for user
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 50,
		//match: '/^[a-zA-Z0-9\.]+@[a-zA-Z0-9\.]+',
		trim: true,
		//unique: true,
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
	var token = jwt.sign({_id: user._id.toString(), access}, process.env.JWT_SECRET).toString();
	
	user.tokens = user.tokens.concat([{access, token}]);
	return user.save().then( () => {
		return token;
	});
}

UserSchema.statics.findByCredentials = function (userData) {
	var User = this;
	var email = userData.email;
	var plainTextPassword = userData.password;
	
	return User.findOne({email}).then( (user) => {
		if (!user) { // no user
			return Promise.reject('Bad user or password');
		}
		// check password
		return new Promise( (resolve, reject) => {
			bcrypt.compare(plainTextPassword, user.password, (err, resHashCheck) => {
				if (resHashCheck) { // password is correct
					// user.generateAuthToken().then((token) => { }) // rely on the token generated in POST
					// console.log('find by credentials user: ', user.email, user.password);
					resolve(user);
				} else { // hash check failed
					reject('Bad user or password');
				}
			})
		});
	});}

UserSchema.statics.findByToken = function (token) {
	var User = this;
	var decoded;
	try {
		decoded = jwt.verify(token, process.env.JWT_SECRET);
	} catch (e) {
		return Promise.reject('Token verify error');
	}
	
	// console.log('Decoded (in findByToken): ', decoded);
	return User.findOne({
		_id: decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	});
}

UserSchema.methods.removeToken = function (token) {
	var user = this;
	
	return user.update({
		'$pull': {
			tokens: {
				token: token
			}
		}
	});
}

UserSchema.pre('save', function (next) {
	var user = this;
	if (user.isModified('password')) {
		bcrypt.genSalt(10, (err, salt) => {
			if (err) {
				return err;
			}
			bcrypt.hash(user.password, salt, (err, hash) => {
				if (err) {
					return err;
				}
				user.password = hash;
				next();
			});
		});	
	} else {
		next();
	}
});

var User = mongoose.model('Users', UserSchema);

module.exports = {User};