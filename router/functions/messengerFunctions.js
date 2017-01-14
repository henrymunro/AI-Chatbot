const debug = require('debug')('messengerFunctions')
const request = require('request')
const config = require('../config')


const PAGE_ACCESS_TOKEN = config.messenger_PAGE_ACCESS_TOKEN

debug('Startup: Loading in MESSENGERFUNCTIONS')



function sendGenericMessage(recipientId, messageText) {
  // To be expanded in later sections
}


function sendTextMessage(recipientId, messageText) {
  debug('Sending text message')
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };
  console.log(messageData)

  callSendAPI(messageData);
}

function callSendAPI(messageData) {
	debug('Calling send API')
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s", 
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });  
}


module.exports = {
	sendTextMessage: sendTextMessage

}