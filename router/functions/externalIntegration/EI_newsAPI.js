const debug = require('debug')('EI_News')
const config = require('../../config')
const request = require('request')

const { news_API_URL, NEWS_API_TOKEN } = config.external_API

//Schemas
const { PhysicsNews } = require('../schemas/physicsNewsSchema') 
const { NewsUser } = require('../schemas/newsUsersSchema') 

debug('Startup: Loading in NEWSFEED functions')




function getNewsByType(senderID, news_type){
	debug('News type: ', news_type)
	return new Promise((resolve, reject)=>{
		switch (news_type.trim()) {
					default:
			        	messageResponse = 'Sorry I can\'t make that right now'

				 	case 'physics':
				 		debug('News type is physics')
				 		findPhysicsNewsStories().then((result)=> {
				 			resolve(result)
				 		}).catch((err)=>{console.error(err)})
				 		break;		      	
			    }
	})
}



// Function to pull back some fresh physics news storys and cache to DB 
function getPhysicsNewStorys(){
	debug('Sending request to get news from: ', news_API_URL)
	//A function to pull back some articles from the last 3 days from phys.org 
	return new Promise((resolve, reject)=>{

		const URL = news_API_URL + '&' + NEWS_API_TOKEN + '&q=physics%20site%3Aphys.org&sort=relevancy' 
		// Sends request to bar tender who will validate and make drink
		request.get(URL, (err,httpResponse,body)=>{ 
			if(err) {
				debug('ERROR: '+ err)
				reject(err)
			}


			const { totalResults, posts, next } = JSON.parse(body)  // posts = articles object array
			debug('Recieved '+ totalResults +' articles from physics news API')
			//Loop over articles and save to DB
			let articleSucessfullySaved = 0
			const articlesSaveToDBPromise = posts.map((articleSent, key)=>{
				return new Promise((dbResolve, dbReject)=>{
					const article = {
						title: articleSent.thread.title_full,
					    site: articleSent.thread.site,
					    url: articleSent.thread.url,
					    site_categories: articleSent.thread.site_categories,
					    published: articleSent.thread.published,
					    main_image: articleSent.thread.main_image, 
					    author: articleSent.author,
					    text: articleSent.text,
					    crawled: articleSent.crawled
					}

					PhysicsNews.create(article, (err, output)=> {
					  if (err) {
					  		console.log('ERROR: ', err)
					  		dbReject(err)
					  		return
					  }
					  articleSucessfullySaved++
					  dbResolve()
					})					
				})
			})

			Promise.all(articlesSaveToDBPromise).then(values => { 
			  debug('Saved '+articleSucessfullySaved+' to the database')
			  resolve('Got some news')
			})

		})
	})
}


// Function to find physics news stories from the database
function findPhysicsNewsStories(){
	// First check to see the stories already sent to user 
	// Then pulls back new stories from the DB 
	// Then call news API to fetch more stories if necessary
	return new Promise((resolve, reject)=>{		
		let user_id
		debug('Finding the physics news already sent to the user')
		NewsUser.find().then((user)=>{
			const { physicsNewsIDs } = user[0]
			user_id = user[0]._id
			debug(physicsNewsIDs.length + ' physics stories already sent to the user')
			// only want to pull back stories from the last 3 days
			var date = new Date()
			date.setDate(date.getDate()-3)
			debug('Finding physics news stories from the database')
			return PhysicsNews.find({type: 'Physics', "_id": { "$nin": physicsNewsIDs } })
							  .where('published').gte(date)
							  .limit(5)
		}).then((articles)=>{
			debug('Found '+  articles.length + ' physics articles from the last 3 days')
			const NewArticleIDs = articles.map((article, key)=>{ return article._id})

			//Have a enough articles cached in the DB update the users recieved articles
			if (articles.length === 5 ){
				NewsUser.findByIdAndUpdate(
			        user_id,
			        {$pushAll: {"physicsNewsIDs": NewArticleIDs}},
			        { upsert: true },
			        function(err, model) {
			        	if(err){
				            debug('ERROR: ' + err)
				            reject(err)
				            return			        		
			        	}
			        	resolve(articles)
			        }
			    )	    			    
			} else {
				// Pull more stories from API then check for new stories in DB again
				getPhysicsNewStorys().then((res)=>{
					findPhysicsNewsStories()
				})
			}

		}).catch((err)=>{
			debug('ERROR: ', err)
			reject(err)
		})
	})
}


function getFullNewsArticleText(article_id){
	debug('Pulling full article text from DB')
	return new Promise((resolve, reject)=>{
		PhysicsNews.find({_id:article_id}).then((article)=>{
			debug('Sucessfully got article text')
			resolve(article[0].text)
		}).catch((err)=>{
			debug('ERROR: '+err)
			reject(err)
		})

	})

}


module.exports = {
	getNewsByType: getNewsByType,
	getFullNewsArticleText: getFullNewsArticleText
}