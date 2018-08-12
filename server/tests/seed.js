const {ObjectId} =  require('mongodb');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const todos = [{
		text: "Something to do One"
	}, {
		text: "Something to do Two"
	}
];

const users = [{
		email: 'user1@gmail.com',
		password: '123456',
	}, {
		email: 'user2@gmail.com',
		password: '123456',
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
		return userOne.generateAuthToken();
	}).then( () => done());
	// return Promise.all([userOnePrm, userTwoPrm]);
};

module.exports = { todos, populateTodos, users, populateUsers };