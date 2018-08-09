const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} =  require('mongodb');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

app.use((req,res, next) => {
	var now = new Date().toString();

	// console.log(now, ' ', req.method, ' ', req.url);
	next();
});

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
	// console.log(req.body);
	var todo = new Todo({
		text: req.body.text
	});
	
	todo.save().then( (doc) => {
		res.send(doc);
	}, (e) => {
		res.status(400).send(e);
	});
});

// get todos
app.get('/todos', (req, res) => {
	Todo.find().then( (todos) => {
		res.send({todos});
	}, (e) => {
		res.status(400).send(e);
	});
});

// GET by ID
app.get('/todos/:id', (req, res) => {
	// res.send(req.params);
	if (!ObjectId.isValid(req.params.id)) {
		return res.status(404).send('Invalid object ID');
	}
	
	Todo.findById(req.params.id).then( (todo) => {
		// console.log('Todo: ', todo);
		if (todo) {
			res.status(200).send({todo});
		} else {
			res.status(204).send({todo: null});
		}
	}, (e) => {
		res.status(400).send(e);
	});
});

// DELETE by ID
app.delete('/todos/:id', (req, res) => {
	// res.send(req.params);
	if (!ObjectId.isValid(req.params.id)) {
		return res.status(404).send(); //'Invalid object ID');
	}
	Todo.findByIdAndDelete(req.params.id).then( (todo) => {
		// console.log('Todo: ', todo);
		if (todo) {
			res.status(200).send({todo});
		} else {
			res.status(204).send({todo: null});
		}
	}, (e) => {
		res.status(400).send(e);
	});
});

app.listen(port, () => {
	console.log('Started server on port ', port);
});

module.exports = {app};