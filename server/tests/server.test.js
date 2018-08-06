const expect = require('expect');
const request = require('supertest');

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
