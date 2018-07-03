var mongoose = require('mongoose');

// note: your host/port number may be different!
mongoose.connect('mongodb+srv://kirill_admin:nhjqrf-1874@cluster0-tehu4.mongodb.net/js_course');

var Schema = mongoose.Schema;

var animalSchema = new Schema( {
	name: {type: String, required: true, unique: true},
	species: {type: String, required: true},
	breed: String,
	gender: {type: String, enum: ['male', 'female']},
	traits: [String],
	age: Number
    } );


module.exports = mongoose.model('Animal', animalSchema);
