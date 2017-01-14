const debug = require('debug')('EI_News')
const config = require('../../config')
const request = require('request')

const { news_API_URL, NEWS_API_TOKEN } = config.external_API

debug('Startup: Loading in NEWSFEED functions')




function getNewsByType(senderID, news_type){
	debug('News type: ', news_type)
	return new Promise((resolve, reject)=>{
		switch (news_type.trim()) {
					default:
			        	messageResponse = 'Sorry I can\'t make that right now'

				 	case 'physics':
				 		debug('News type is physics')
				 		getPhysicsNewStorys().then((result)=> resolve(result))
				 		break;		      	
			    }
	})
}


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

			console.log(URL)
			const { totalResults, post, next } = JSON.parse(body)
			console.log('Res: ', totalResults)
			resolve('Got some news')

		})
	})
}


module.exports = {
	getNewsByType: getNewsByType
}