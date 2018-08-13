const expect = require('expect');
const request = require('supertest');
const {ObjectId} =  require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed');

beforeEach(populateUsers);
beforeEach(populateTodos);


describe('POST /todos', () => {
	it('Test - create new todo', (done) => {
		var userData = users[0];
		var text = 'Test todo text';

		request(app)
			.post('/todos')
			.set('x-auth', userData.tokens[0].token)
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
				expect(todos[0].text).toBe(text);
				done();
			}). catch( (e) => done(e) )
		});
	}); 

	it('Test - not creating todo w too short text', (done) => {
		var userData = users[0];
		var text = '';

		request(app)
			.post('/todos')
			.set('x-auth', userData.tokens[0].token)
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
			});
	});
});

describe('GET /todos', () => {
	it('Test - Getting All Todos for first user', (done) => {
		request(app)
			.get('/todos')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				// console.log('Todos: ', JSON.stringify(res.body, undefined, 2));
				expect(res.body.todos.length).toBe(1);
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
						.set('x-auth', users[0].tokens[0].token)
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

	it('Test - Get by id, with wrong user (unauthorized)', (done) => {
		// get just one ID
		Todo.findOne().then( (todo) => {
			expect(todo).toBeDefined(); // making sure object is found
			if (todo) {
				request(app)
					.get('/todos/' + todo._id.toString())
					.set('x-auth', users[1].tokens[0].token)
					.expect(401)
					.end(done);
			}
		}). catch( (e) => done(e) )
	});
	
	it('Test - Get id not exists', (done) => {
		// get just one ID
		request(app)
				.get('/todos/' + new ObjectId())
				.set('x-auth', users[0].tokens[0].token)
				.expect(204)
				.end(done);
	});

	it('Test - Get invalid object ID value', (done) => {
		// get just one ID
		request(app)
				.get('/todos/' + "123")
				.set('x-auth', users[0].tokens[0].token)
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
						.set('x-auth', users[0].tokens[0].token)
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
				.set('x-auth', users[0].tokens[0].token)
				.expect(204)
				.end(done);
	});

	it('Test - Get invalid object ID value', (done) => {
		// get just one ID
		request(app)
				.delete('/todos/' + "123")
				.set('x-auth', users[0].tokens[0].token)
				.expect(404)
				.end(done);
	});
	
});

// Tests for PATCH
describe('PATCH (update) /todos/:id', () => {
	it('Test - Patch text for id OK', (done) => {
		// get just one ID
		Todo.findOne().then( (todo) => {
			//console.log("Objectid: ", todo._id.toString());
			expect(todo).toBeDefined(); // making sure object is found
			if (todo) {
				request(app)
					.patch('/todos/' + todo._id.toString())
					.set('x-auth', users[0].tokens[0].token)
					.send({text: (todo.text + '*')})
					.expect(200)
					.expect((res) => {
						// console.log('Todos: ', JSON.stringify(res.body, undefined, 2));
						expect(res.body.todo._id).toBe(todo._id.toString());
						expect(res.body.todo.text).toBe(todo.text + '*');
					})
					.end(done);							
			}
		}). catch( (e) => done(e) )
	});

	it('Test - Patch text for completed false, and nullify completed At OK', (done) => {
		// get just one ID
		Todo.findOne().then( (todo) => {
			//console.log("Objectid: ", todo._id.toString());
			expect(todo).toBeDefined(); // making sure object is found
			if (todo) {
				request(app)
					.patch('/todos/' + todo._id.toString())
					.set('x-auth', users[0].tokens[0].token)
					.send({completed: false})
					.expect(200)
					.expect((res) => {
						// console.log('Todos: ', JSON.stringify(res.body, undefined, 2));
						expect(res.body.todo.completedAt).toBe(null);
					})
					.end(done);							
			}
		}). catch( (e) => done(e) )
	});

	it('Test - Patch id not exists', (done) => {
		request(app)
				.patch('/todos/' + new ObjectId())
				.set('x-auth', users[0].tokens[0].token)
				.send({text: 'dummy text'})
				.expect(204)
				.end(done);
	});

	it('Test - Patch invalid object ID value', (done) => {
		request(app)
				.patch('/todos/' + "123")
				.set('x-auth', users[0].tokens[0].token)
				.expect(404)
				.end(done);
	});

	it('Test - Patch with no field to update', (done) => {
		// get just one ID
		request(app)
				.patch('/todos/' + new ObjectId())
				.set('x-auth', users[0].tokens[0].token)
				.expect(404)
				.end(done);
	});	
});


// =====================================================
// users testing
//======================================================
describe('GET /users/me', () => {
	it('Test - return user, if authenticated', (done) => {
		User.findOne({email:'user1@gmail.com'}).then( (user) => {
			request(app)
				.get('/users/me')
				.set('x-auth', user.tokens[0].token)
				.expect(200)
				.expect((res) => {
					expect(res.body._id).toBe(user._id.toString());
					expect(res.body.email).toBe(user.email);
				})
				.end(done);
		});
	});
	
	it('Test - return 401, if bad authentication', (done) => {
		request(app)
			.get('/users/me')
			.set('x-auth', 'stam token')
			.expect(401)
			.expect((res) => {
				expect(res.body).toEqual({});
			})
			.end(done);
	});
	
});

	
describe('POST /users', () => {
	it('Test - create new user', (done) => {
		var userData = {
			email: "thirdUser@email.com",
			password: "123456"
		};
		
		request(app)
			.post('/users')
			.send(userData)
			.expect(200)
			.expect((res) => {
				expect(res.body._id).not.toBeUndefined();
				expect(res.body.email).toBe(userData.email);
				expect(res.header['x-auth']).not.toBeUndefined();
			})
			.end(done);
	}); 

		it('Test - create with invalid email or password should fail', (done) => {
		var userData = {
			email: "bad email format",
			password: "12"
		};
		
		request(app)
			.post('/users')
			.send(userData)
			.expect(400)
			.end(done);

	});
	
	it('Test - create dup user should fail', (done) => {
		var userData = {
			email: "thirdUser@email.com",
			password: "123456"
		};
		
		request(app)
			.post('/users')
			.send(userData)
			.expect(400)
			.end(done);

	});
});

describe('POST /users/login', () => {
	it('Test - return user and token, if authenticated', (done) => {
		var userData = users[0];

		request(app)
			.post('/users/login')
			.send(userData)
			.expect(200)
			.expect((res) => {
				expect(res.body.email).toBe(userData.email);
				expect(res.header['x-auth']).not.toBeUndefined();
			})
			.end(done);
	});
	
	it('Test - return 400, if bad authentication', (done) => {
		var userData = {
			email: "thirdUser@email.com",
			password: "---"
		};		
		
		request(app)
			.post('/users/login')
			.send(userData)
			.expect(400)
			.expect((res) => {
				expect(res.body).toEqual({});
				expect(res.header['x-auth']).toBeUndefined();
			})
			.end(done);

	});
	
});
 

describe('DELETE /users/me/token', () => {
	it('Test deleting a token for user', (done) => {
		var userData = users[0];

		// login with a user, first
		request(app)
			.post('/users/login')
			.send(userData)
			.expect(200)
			.expect((res) => {
				// then, logout
				return request(app)
					.delete('/users/me/token')
					.send()
					.expect(200)
			})
			.end(done);
	
	});

	it('Test deleting a token for user (generate token and then delete it)', (done) => {
		var userData = users[0];

		// login with a user, first
		User.findOne({email: userData.email}).then( (user) => {
			return user.generateAuthToken();
		}).then( (token) => {
			request(app)
				.delete('/users/me/token')
				.set('x-auth', token)
				.send()
				.expect(200)
				.expect((res) => {
					expect(res.body).toEqual({});
					expect(res.header['x-auth']).toBeUndefined();
				})
				.end(done);	
		}).catch((e) => {
			// error case
			done(e);
		});
	});

	it('Test deleting a token - failure', (done) => {

		request(app)
			.delete('/users/me/token')
			.send()
			.expect(401)
			.end(done);
	});	
	
});
