const {ObjectId} =  require('mongodb');

const {app} = require('../server/server');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

// var id = "5b67dcb0c00b6439dcbecd97";
// if (! ObjectId.isValid(id)) {
	// console.log('Id not valid - ', id);
// }

// Todo.find().then((todos) => {
	// console.log('Todos: ', todos);
// }).catch((e) => { console.log('Error in find'); });

// Todo.findOne( {
	// _id: id
// }).then((todo) => {
	// console.log('Todo: ', todo);
// }).catch((e) => { console.log('Error in findOne'); });

// Todo.findById( id).then((todo) => {
	// if (!todo) {
		// return console.log('Id not found');
	// }
	// console.log('Todo by ID: ', todo);
// }).catch((e) => { console.log('Error in findByID'); });

// Query users table user.findById
// case (a) no user (b) user found (c) error

var userId = "5b66eaa6f7a7862804ddea9e";
User.findById(userId).then( (user) => {
	if (!user) {
		return console.log('User does not exists');
	}
	return console.log('Found user: ', user);
}).catch( (e) => console.log('Failed to find User by Id'));