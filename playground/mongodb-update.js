// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
	if (err) {
		console.log('Unable to connect to MongoDB server');
		return;
	} 
	console.log('Connected to MongoDB server');
	const db = client.db('TodoApp');

	db.collection('Todos').findOneAndUpdate(
		{text: 'Eat lunch'}, 
		{ $set: {completed: true}},
		{ returnOriginal: false })
		.then( (result) => {
			console.log(result);
		}, (err) => {
				console.log('Unable to update  todos, error code: ', err);
		});
	
	db.collection('Users').findOneAndUpdate(
		{user: 'Moshe'}, 
		{ 
			$set: {user: 'Rom'},
			$inc: {age: 2}
		},
		{ returnOriginal: false })
		.then( (result) => {
			console.log(result);
		}, (err) => {
				console.log('Unable to update  todos, error code: ', err);
		});
	// do not forget close
	
});