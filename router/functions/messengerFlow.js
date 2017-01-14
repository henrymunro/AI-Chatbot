const debug = require('debug')('messengerFlow')
const config = require('../config')


const { sendTextMessage } = require('./messengerFunctions')
const { sendRequestToWIT } = require('./witAI')
const { sendDrinkOrderToBar, getPopularDrinksFromBar } = require('./externalIntegration/EI_BarTender.js')



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
      	case 'recommend_drink':
        	reccomendDrink(senderID);
       		break;

      	default:
        	sendTextMessage(senderID, 'default')
    }
  }).catch((err)=>{
  	debug('ERROR: ', err)
  	sendTextMessage("I\'m sorry something went wrong")
  })

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
		const { messageResponse } = response
			// Send response to user based on order drink response (sucess or validation fail)
		    sendTextMessage(senderID, messageResponse)
	})
}

function reccomendDrink(senderID){
	debug('Recommening drink')
	getPopularDrinksFromBar(senderID).then((response)=>{
		const { drinks } = response 
		const messageResponse = 'The ' + drinks[0] + ' is crushing it today!'
		
		sendTextMessage(senderID, messageResponse)
	})
}




module.exports = {
	receivedMessage: receivedMessage

}