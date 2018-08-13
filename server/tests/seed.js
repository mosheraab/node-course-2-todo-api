const {ObjectId} =  require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const userOneID = new ObjectId();
const userTwoID = new ObjectId();

const todos = [{
		text: "Something to do One",
		_creator: userOneID
	}, {
		text: "Something to do Two",
		_creator: userTwoID
	}
];

const users = [{
		_id: userOneID,
		email: 'user1@gmail.com',
		password: '123456',
		tokens: [{
			access: 'auth',
			token: jwt.sign({_id: userOneID, access: 'auth'}, 'abc123').toString()
		}]
	}, {
		_id: userTwoID,
		email: 'user2@gmail.com',
		password: '123456',
		tokens: [{
			access: 'auth',
			token: jwt.sign({_id: userTwoID, access: 'auth'}, 'abc123').toString()
		}]
	}
];

const populateTodos = (done) => {
	Todo.remove({}).then( () => {
		return Todo.insertMany(todos);
	}).then( () => done());		
};

const populateUsers = (done) => {
	var userOne = new User(users[0]);
	var userTwo = new User(users[1]);
	
	User.remove({}).then( () => {
		return userOne.save();
	}).then( () => {
		return userTwo.save();
	}).then( () => {

		done();
	});
	// return Promise.all([userOnePrm, userTwoPrm]);
};

module.exports = { todos, populateTodos, users, populateUsers };