// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
	if (err) {
		console.log('Unable to connect to MongoDB server');
		return;
	} 
	console.log('Connected to MongoDB server');
	const db = client.db('TodoApp');

	// deleteMany
	// db.collection('Todos').deleteMany({text:'Somthing to do'}).then( (result) => {
			// console.log(result);
		// }, (err) => {
				// console.log('Unable to count  todos, error code: ', err);
		// });
	
	//deleteOne
	// db.collection('Todos').deleteOne({text:'Somthing to do'}).then( (result) => {
			// console.log(result.result);
		// }, (err) => {
				// console.log('Unable to count  todos, error code: ', err);
		// });
	
	//findOne and delete
	// db.collection('Todos').findOneAndDelete({text:'Eat lunch'}).then( (result) => {
			// console.log(result);
		// }, (err) => {
				// console.log('Unable to delete: ', err);
		// });
	
	//var nameToSearch = "Moshe2";
	// db.collection('Users').find({user: nameToSearch}).toArray().then( (result) => {
	db.collection('Users').find().toArray().then( (result) => {
			// console.log(JSON.stringify(result, undefined, 2));
			var countUsers = {};
			for (var i =0; i<result.length; i++) {
				usr = result[i];
				// console.log('Found: ', usr);
				if (countUsers[usr.user]) {
					countUsers[usr.user] ++;
				} else {
					countUsers[usr.user] = 1;
				}
			}
			console.log(JSON.stringify(countUsers, undefined, 2));
			// deleting all with count > 1
			for (var prop in countUsers) {
				if (countUsers[prop] > 1) {
					console.log('Delete for: ', prop);
					db.collection('Users').deleteMany({user: prop}).then( (result) => {
							console.log('Result: ', result.result);
						}, (err) => {
								console.log('Unable to delete: ', err);
						});				
					}
			}
		}, (err) => {
			console.log('Unable to count  todos, error code: ', err);
		}
	);

	//deleteOne
	db.collection('Users').deleteOne({_id: new ObjectID("5b66c0cbb6d9dc558e11fd6d")}).then( (result) => {
			console.log(result.result);
		}, (err) => {
				console.log('Unable to delete, error code: ', err);
		});

});