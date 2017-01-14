const debug = require('debug')('messengerFlow')
const config = require('../config')


const { sendTextMessage } = require('./messengerFunctions')
const { sendRequestToWIT } = require('./witAI')



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
  	debug('Sending response to user: ', response)
  	sendTextMessage(senderID, response)
  }).catch((error)=>{
  	debug('ERROR: '+ error)
  	sendTextMessage(senderID, 'INTERNAL ERROR')
  })

  // if (messageText) {

  //   // If we receive a text message, check to see if it matches a keyword
  //   // and send back the example. Otherwise, just echo the text we received.
  //   switch (messageText) {
  //     case 'generic':
  //       sendGenericMessage(senderID, 'yo');
  //       break;

  //     default:
  //       sendTextMessage(senderID, messageText);
  //   }
  // } else if (messageAttachments) {
  //   sendTextMessage(senderID, "Message with attachment received");
  // }
}



module.exports = {
	receivedMessage: receivedMessage

}