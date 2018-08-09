const expect = require('expect');
const request = require('supertest');
const {ObjectId} =  require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
		text: "Something to do"
	}, {
		text: "Something to do"
	}
];

beforeEach( (done) => {
	Todo.remove({}).then( () => {
		return Todo.insertMany(todos);
		}).then( () => done());
});

describe('POST /todos', () => {
	it('Test - create new todo', (done) => {
		var text = 'Test todo text';
		request(app)
			.post('/todos')
			.send({text})
			.expect(200)
			.expect((res) => {
				expect(res.body.text).toBe(text);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				Todo.find({text: text}).then( (todos) => {
					expect(todos.length).toBe(1);
					//expect(todos[0].text).toBe(text);
					done();
				}). catch( (e) => done(e) )
			})
	}); 

	it('Test - not creating todo', (done) => {
		var text = '';
		request(app)
			.post('/todos')
			.send({text})
			.expect(400)
			//.expect((res) => {
			//	expect(res.body.text).toBe(text);
			//})
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				Todo.find().then( (todos) => {
					expect(todos.length).toBe(2);
					//expect(todos[0].text).toBe(text);
					done();
				}). catch( (e) => done(e) )
			})
	});
});

describe('GET /todos', () => {
	it('Test - Getting All Todos', (done) => {
		request(app)
			.get('/todos')
			.expect(200)
			.expect((res) => {
				// console.log('Todos: ', JSON.stringify(res.body, undefined, 2));
				expect(res.body.todos.length).toBe(2);
			})
			.end(done);
	});
});

describe('GET /todos/:id', () => {
	it('Test - Get id OK', (done) => {
		// get just one ID
		Todo.findOne().then( (todo) => {
			//console.log("Objectid: ", todo._id.toString());
			expect(todo).toBeDefined(); // making sure object is found
			if (todo) {
				request(app)
						.get('/todos/' + todo._id.toString())
						.expect(200)
						.expect((res) => {
							// console.log('Todos: ', JSON.stringify(res.body, undefined, 2));
							expect(res.body.todo._id).toBe(todo._id.toString());
							expect(res.body.todo.text).toBe(todo.text);
						})
						.end(done);
			}
		}). catch( (e) => done(e) )
	});

	it('Test - Get id not exists', (done) => {
		// get just one ID
		request(app)
				.get('/todos/' + new ObjectId())
				.expect(204)
				.end(done);
	});

	it('Test - Get invalid object ID value', (done) => {
		// get just one ID
		request(app)
				.get('/todos/' + "123")
				.expect(404)
				.end(done);
	});
	
});

// Tests for DELETE
describe('DELETE /todos/:id', () => {
	it('Test - Delete id OK', (done) => {
		// get just one ID
		Todo.findOne().then( (todo) => {
			//console.log("Objectid: ", todo._id.toString());
			expect(todo).toBeDefined(); // making sure object is found
			if (todo) {
				request(app)
						.delete('/todos/' + todo._id.toString())
						.expect(200)
						.expect((res) => {
							// console.log('Todos: ', JSON.stringify(res.body, undefined, 2));
							expect(res.body.todo._id).toBe(todo._id.toString());
							expect(res.body.todo.text).toBe(todo.text);
						})
						.end((err,res) => {
							if (err) {
								return done(err);
							}
							
							// check that delete was done
							Todo.findById(todo._id).then((todo) => {
								expect(todo).toBe(null);
								done();
							}).catch( (e) => done(e));	
						});
			}
		}). catch( (e) => done(e) )
	});

	it('Test - Delete id not exists', (done) => {
		// get just one ID
		request(app)
				.delete('/todos/' + new ObjectId())
				.expect(204)
				.end(done);
	});

	it('Test - Get invalid object ID value', (done) => {
		// get just one ID
		request(app)
				.delete('/todos/' + "123")
				.expect(404)
				.end(done);
	});
	
});
