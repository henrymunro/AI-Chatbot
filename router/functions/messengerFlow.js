const debug = require('debug')('messengerFlow')
const config = require('../config')


const { sendTextMessage } = require('./messengerFunctions')
const { sendRequestToWIT } = require('./witAI')
const { sendDrinkOrderToBar, getPopularDrinksFromBar } = require('./externalIntegration')



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
	 		sendTextMessage(senderID, 'Yo whats up!')
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


function orderDrink(senderID, drink){
	debug('Ordering drink: ', drink)
	sendDrinkOrderToBar(senderID, drink).then((response)=>{
		const { drinkOrdered, message } = response

		if(drinkOrdered){
			// Drink has been sucessfully ordered
			const messageResponse = drink + ' coming right up!'
			sendTextMessage(senderID, messageResponse)
		}else{
			let messageResponse
			switch (intent) {
			 	case 'no_cup':
			 		messageResponse = 'You need to put a cup in the bar!'
			 		break;
		      	case 'no_ingredients':
		      		messageResponse = 'I\'m sorry I don\'t have the ingredients to make a '+drink+' now, '
		        	break;

		      	case 'bar_tender_off':
		        	messageResponse = 'The bar tender is off, switch it on and i\'ll make you what ever you want...'
		       		break;

		      	default:
		        	messageResponse = 'Sorry I can\'t make that right now'
		    }
		    sendTextMessage(senderID, messageResponse)
		}

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