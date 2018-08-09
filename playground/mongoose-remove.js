const {ObjectId} =  require('mongodb');

const {app} = require('../server/server');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

// Todo remove()
// Todo.remove({}).then((result) => {
	// console.log(result);
// });

Todo.findOneAndRemove({}).then((result) => {
	console.log(result);
});

Todo.findByIdAndRemove('5b6bf3d8a9bac22c609a7a1a').then((result) => {
	console.log(result);
});