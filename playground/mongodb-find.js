// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
	if (err) {
		console.log('Unable to connect to MongoDB server');
		return;
	} 
	console.log('Connected to MongoDB server');
	const db = client.db('TodoApp');

	// db.collection('Todos').find({_id: new ObjectID('5b60113ee5cc9605b00bb2ac')}).toArray().then( (docs) => {
			// console.log('Todos\n', JSON.stringify(docs, undefined, 2));
		// }, (err) => {
			// console.log('Unable to fetch todos, error code: ', err);
		// }
	// );
	
	// db.collection('Todos').find().count().then( (count) => {
			// console.log('Todos count: ', count);
		// }, (err) => {
			// console.log('Unable to count  todos, error code: ', err);
		// }
	// );
	var nameToSearch = "Moshe";
	db.collection('Users').find({user: nameToSearch}).count().then( (count) => {
			console.log('Users matching "', nameToSearch, '"   count: ', count);
		}, (err) => {
			console.log('Unable to count  todos, error code: ', err);
		}
	);

	client.close();
});