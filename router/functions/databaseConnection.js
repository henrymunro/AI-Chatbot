const mongoose = require('mongoose')
const debug = require('debug')('databaseConnection')


debug('Start up: Loading in DATASBASECONNECTION')


mongoose.connect('mongodb://localhost/AIChatbot')
mongoose.Promise = global.Promise


// Test connection to DB
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  debug('Connection to testBD OK')
});


module.exports = {
	mongoose: mongoose
}