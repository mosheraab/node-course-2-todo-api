// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
	if (err) {
		console.log('Unable to connect to MongoDB server');
		return;
	} 
	console.log('Connected to MongoDB server');
	const db = client.db('TodoApp');
	// db.collection('Todos').insertOne(
		// {
			// text: 'Somthing to do',
			// completed: false
		// },
		// (err, result) => {
				// if (err) {
					// return console.log('Unalbe to insert todo', err);
				// }
				// console.log(JSON.stringify(result.ops, undefined, 2));
			// } 
	// );
	
	db.collection('Users').insertMany(
		[
			{
				user: "Moshe2",
				age: 21,
				location: "Sde-Warburg"
			},
			{
				user: "Moshe3",
				age: 50,
				location: "Sde-Warburg"
			}
		],
		(err, result) => {
			if (err) {
				console.log('Error - failed to add user to Users. ', err);
			} else {
				console.log('Added user \n', JSON.stringify(result.ops, undefined, 2));
				console.log('Object \n', result.ops[0]._id.getTimestamp());
			}			
		}
	);
	client.close();
});