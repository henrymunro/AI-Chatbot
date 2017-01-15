const { mongoose } = require('../databaseConnection')
const debug = require('debug')('newsUsersSchema')

debug('Start up: loading in NEWSUSERSSCHEMA')

var newsUsersSchema = mongoose.Schema({
	username: String, 
    physicsNewsIDs: []

})


var NewsUser = mongoose.model('userArticleLog', newsUsersSchema)


// Create user
// NewsUser.create({username: 'Henry', physicsNewsIDs:[] }, (err, output)=> {
//                       if (err) {
//                             console.log('ERROR: ', err)
//                             return
//                       }
//                       console.log('created')
//                     }


module.exports = {
	NewsUser: NewsUser
}