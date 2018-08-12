// const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';
// bcrypt.genSalt(10, (err, salt) => {
	// bcrypt.hash(password, salt, (err, hash) => {
		// console.log('Hash: ', hash);
		// console.log('Err: ', err);
	// });
// });

var hashedPwd = '$2a$10$QRvfyXkv1AlCwlJgm0VI3OTuzLNojccHEAGfZB4eMzgrMWMNsta36';
bcrypt.compare(password, hashedPwd, (err, res) => {
	console.log('Res: ', res);
});

// var data = {
	// id: 10
// }

// var token = jwt.sign(data, '123abc');
// console.log("token: ", token);

// var decoded = jwt.verify(token, '123abc'); 
// console.log('decoded: ', decoded);

// var message = 'I am user no 3';
// var hash = SHA256(message).toString();
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// var data = {
	// id: 4,
// };

// var token = {
	// data: data,
	// hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };

// var resultHash = SHA256(JSON.stringify(token.data + 'somesecret')).toString();

// if (resultHash === token.hash) {
	// console.log('Data was not changed')
// } else {
	// console.log('Data was changed. Do not trust!');
// }