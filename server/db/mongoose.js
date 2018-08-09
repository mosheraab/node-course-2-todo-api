var mongoose = require('mongoose');
const connectionString = process.env.MONGODB_URI;

mongoose.Promise = global.Promise;
mongoose.connect(connectionString, { useNewUrlParser: true });

module.exports = {
	mongoose: mongoose
}

