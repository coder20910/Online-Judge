const mongoose = require('mongoose');

// Schema (same way as in SQL, we define datatype of each column and then mark it as required or not) creation using mongoose

	//Mongoose :- Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It manages relationships between data, provides schema validation, and is used to translate between objects in code and the representation of those objects in MongoDB.

const userSchema = new mongoose.Schema({
	firstname:{
		type: String,
		required: true,
	},
	lastname:{
		type: String,
		required: true,
	},
	email:{
		type: String,
		unique: true,
		required: true,
	},
	password:{
		type: String,
		required: true,
	}
});

// MonngoDB will automatically add 's' add the end of the model name, like user will become users 
module.exports = mongoose.model('user', userSchema);

