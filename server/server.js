const config = require('./config/config.js');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use((req,res, next) => {
	var now = new Date().toString();

	// console.log(now, ' ', req.method, ' ', req.url);
	next();
});

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
	// console.log(req.body);
	var todo = new Todo({
		text: req.body.text,
		_creator: req.user._id
	});
	
	todo.save().then( (doc) => {
		res.send(doc);
	}, (e) => {
		res.status(400).send(e);
	});
});

app.patch('/todos/:id', authenticate, (req, res) => {
	// console.log(req.body);
	if (!ObjectId.isValid(req.params.id)) {
		return res.status(404).send('Invalid object ID');
	}
	// text to update is in req.body.text, req.body.completed
	// console.log('update fields:', req.body);
	var body = _.pick(req.body, ['text', 'completed']);
	if ((body.text == null) && (body.completed == null)) {
		return res.status(404).send('No valid fields were sent in body');
	}
	if ((body.completed != null) && (typeof body.completed != 'boolean')) {
		return res.status(404).send('Completed flag is not boolean');
	}
	if (body.completed) { // set completed time
		body.completedAt = new Date().getTime();
	} else {
		body.completed = false;
		body.completedAt = null;
	}
	
	// Todo.findByIdAndUpdate(req.params.id, body, { new: true }).then( (todo) => {
		// if (todo) {
			// res.status(200).send({todo});
		// } else {
			// res.status(204).send({todo: null});
		// }
	// }, (e) => {
		// res.status(400).send(e);
	// });
	Todo.findById(req.params.id).then( (todo) => {
		if (todo) {
			if (todo._creator.equals(req.user._id)) { // check creator, before update
				Todo.findByIdAndUpdate(req.params.id, body, { new: true }).then( (todo) => {
					if (todo) // if item was deleted between find and find-and-delete
						res.status(200).send({todo});
					else
						res.status(204).send({todo: null});
				});
			} else { // not the right creator; not authorized
				res.status(401).send('Unauthorized for this Todo item');
			} 
		} else { // item not found
			res.status(204).send({todo: null});
		}
	}, (e) => {
		res.status(400).send(e);
	});
});

// get todos
app.get('/todos', authenticate, (req, res) => {
	Todo.find({_creator: req.user._id}).then( (todos) => {
		res.send({todos});
	}, (e) => {
		res.status(400).send(e);
	});
});

// GET by ID
app.get('/todos/:id', authenticate, (req, res) => {
	if (!ObjectId.isValid(req.params.id)) {
		return res.status(404).send('Invalid object ID');
	}
	
	Todo.findById(req.params.id).then( (todo) => {
		if (todo) {
			if (todo._creator.equals(req.user._id)) {
				res.status(200).send({todo});
			} else {
				res.status(401).send('Unauthorized for this todo')
			}
		} else {
			res.status(204).send({todo: null});
		}
	}, (e) => {
		res.status(400).send(e);
	});
});

// DELETE by ID
app.delete('/todos/:id', authenticate, (req, res) => {
	// res.send(req.params);
	if (!ObjectId.isValid(req.params.id)) {
		return res.status(404).send(); //'Invalid object ID');
	}
	Todo.findById(req.params.id).then( (todo) => {
		// console.log('Todo: ', todo);
		if (todo) {
			if (todo._creator.equals(req.user._id)) {
				// delete
				Todo.findByIdAndDelete(req.params.id).then( (todo) => {
					if (todo) // if item was deleted between find and find-and-delete
						res.status(200).send({todo});
					else
						res.status(204).send({todo: null});
				});
			} else {
				res.status(401).send('Unauthorized for this Todo item');
			} 
		} else {
			res.status(204).send({todo: null});
		}
	}, (e) => {
		res.status(400).send(e);
	});
});

//
// users
//   
app.get('/users', (req, res) => {
	User.find().then( (users) => {
		res.status(200).send( { users: users });
	}, (e) => {
		res.status(400).send(e);
	});
});

app.post('/users', (req, res) => {
	// add user
	var userData = _.pick(req.body, [ 'email', 'password' ]);
	user = new User(userData);
	
	user.save().then( () => {
		return user.generateAuthToken();
	}).then((token) => {
		res.header('x-auth' /* custom value*/, token).send(user.toJSON());
	}).catch((e) => {
		res.status(400).send(e);
	});
});

app.get('/users/me', authenticate, (req, res) => {
	res.status(200).send(req.user);
	// failure to authenticate will be returned directly from authenticate
});

app.delete('/users/me/token', authenticate, (req, res) => {
	var user = req.user; // received from authenticate
	var token = req.token; 
	
	// find and delete token
	// for (var i = 0; i< user.tokens.length; i++) {
		// if (user.tokens[i].token == token) {
			// user.tokens.splice(i, 1);
			// break;
		// }
	// }
	
	// save the user, return ok
	user.removeToken(token).then( () => {
		res.status(200).send('Successful logout');
	}, (err) => {
		res.status(400).send(err);
	});
});

app.post('/users/login', (req, res) => {
	var body = _.pick(req.body, ['email', 'password']);

	User.findByCredentials(body).then( (user) => {
		return user.generateAuthToken().then( (token) => {
			res.status(200).header('x-auth', token).send(body);
		});
	}).catch((e) => {
		res.status(400).send(e);
	});
});

app.listen(port, () => {
	console.log('Started server on port ', port);
});

module.exports = {app};