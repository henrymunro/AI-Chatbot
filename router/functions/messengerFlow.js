const debug = require('debug')('messengerFlow')
const config = require('../config')


const { sendTextMessage, sendArticleMessage, sendListMessage, sendButtonMessage } = require('./messengerFunctions')
const { sendRequestToWIT } = require('./witAI')
const { sendDrinkOrderToBar, getPopularDrinksFromBar, killAllPumps } = require('./externalIntegration/EI_BarTender.js')
const { getNewsByType, getFullNewsArticleText } = require('./externalIntegration/EI_newsAPI.js')




debug('Startup: Loading in MESSENGERFLOW functions')




function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  // console.log("Received message for user %d and page %d at %d with message:", senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var messageId = message.mid;

  var messageText = message.text;
  var messageAttachments = message.attachments;

  // Master route to shut down the pumps of the RoboBarTender
  if (messageText.toLowerCase() == 'kill pumps' || messageText.toLowerCase() == 'kill pump'){
  	sendTextMessage(senderID, 'Attempting to kill pumps now')
  	attemptGracefulPumpShutDown(senderID)
  	return 
  }

  sendRequestToWIT(senderID, messageText).then((response)=>{
  	const { intent, WITResponse, attribute } = response.WITresponse
	debug('Processing WIT Repsonse: ' + intent)

	 switch (intent) {
	 	case 'greeting':
	 		sendTextMessage(senderID, 'Yo! How can I help?')
	 		break;
	 	case 'identify':
	 		identifyYourself(senderID)
	 		break;
      	case 'order_drink':
        	orderDrink(senderID, attribute.drink);
        	break;
        case 'get_news':
        	getNews(senderID, attribute.news_type)
        	break;
      	case 'recommend_drink':
        	reccomendDrink(senderID);
       		break;

      	default:
        	sendTextMessage(senderID, 'I\'m sorry I didn\'t understand that, please try again')
    }
  }).catch((err)=>{
  	debug('ERROR: ', err)
  	sendTextMessage(senderID, "I\'m sorry something went wrong")
  })

}

function postbackMessageFlow(event, payload){
	var senderID = event.sender.id;
	var recipientID = event.recipient.id;
	var timeOfMessage = event.timestamp;
	var message = event.message;
	debug('Web post back recieved for '+ payload.type)
	switch (payload.type) {
      case 'VIEW_FULL_PHYSICS_ARTICLE':     
        debug('Request recieved to view full article')               
        const article_id = payload.article_id
        getFullNewsArticleText(article_id).then((article)=>{
	        sendTextMessage(senderID, article)
        })
        break;      
      case 'ORDER_DRINK':     
        debug('Request recieved to order drink')               
        const Drink_id = payload.Drink_id
       	orderDrink(senderID, Drink_id)
        break;     
      case 'KILL_PUMPS':
      	attemptGracefulPumpShutDown(senderID)
      	break;      

      default:
        sendTextMessage(senderID, 'default')
    }
}

// Function to display the purpose of this bot
function identifyYourself(senderID){
	debug('Identifying myself')
	const identity = 'Hi im the RoboBarTender but you can call be Rob.'
	const functions = 'Over the years I\'ve learnt to perform many cool actions. \n\nCurrently I can: \n - Make dope drinks \n - Send some news your way\n\n'
	sendTextMessage(senderID, identity)
	sendTextMessage(senderID, functions)


}

function orderDrink(senderID, drink){
	debug('Ordering drink: ', drink)
	sendDrinkOrderToBar(senderID, drink).then((response)=>{
		const { messageResponse, drinkOrdered } = response
			if(!drinkOrdered){
				// Send response to user based on order drink response (sucess or validation fail)
			    sendTextMessage(senderID, messageResponse)
			} else {
			    const buttons = [
			          {
			            "type":"postback",
			            "title":"Cancel",
			            "payload":JSON.stringify({ type: "KILL_PUMPS"})
			          }
			        ]
			    sendButtonMessage(senderID, messageResponse, buttons)
			}

	}).catch((err)=>{
		debug('ERROR: '+ err)
		sendTextMessage(senderID, 'I\'m sorry an error has occoured')
	})
}

function reccomendDrink(senderID){
	debug('Recommening drink')
	getPopularDrinksFromBar(senderID).then((listElements)=>{
		debug('Got drink recommendation sending to response handler')		
		sendListMessage(senderID, listElements)
	}).catch((err)=>{
		debug('ERROR: '+ err)
		sendTextMessage(senderID, 'Sorry for some reason I can connect to the Robo Bar Tender')
	})
}

function getNews(senderID, news_type){
	debug('Getting news')
	getNewsByType(senderID, news_type).then((articles)=>{
		debug('Recieved articles, preparing to send to user')
		articles.map((article, key)=>{
			sendArticleMessage(senderID, article)
			
		})
	})

}

function attemptGracefulPumpShutDown(senderID){
	debug('Attempting graceful pump shutdown')
	killAllPumps().then((res)=>{
  		sendTextMessage(senderID, res)
  	}).catch((err)=>{
  		sendTextMessage(senderID, err)
  		sendTextMessage(senderID, 'Trying to kill pumps again')
  		killAllPumps().then((res)=>{sendTextMessage(senderID, res)})
  						.catch((err)=>{sendTextMessage(senderID, err)})

  	})
}




module.exports = {
	receivedMessage: receivedMessage,
	postbackMessageFlow: postbackMessageFlow

}