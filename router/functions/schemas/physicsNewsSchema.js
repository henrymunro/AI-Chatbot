const { mongoose } = require('../databaseConnection')
const debug = require('debug')('physicsNewsSchema')

debug('Start up: loading in PHYSICSNEWSSCHEME')

var physicsNewsSchema = mongoose.Schema({
	type: { type: String, default: 'Physics'},
    title: String,
    site: String,
    url: String,
    site_categories: Array,
    published: Date,
    main_image: String, 
    author: String,
    text: String,
    crawled: Date,
    addedToDB: { type: Date, default: Date.now }

})


var PhysicsNews = mongoose.model('news', physicsNewsSchema)



module.exports = {
	PhysicsNews: PhysicsNews
}