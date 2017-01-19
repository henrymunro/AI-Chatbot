const debug = require('debug')('messengerFunctions')
const request = require('request')
const config = require('../config')


debug('Startup: Loading in MESSENGERFUNCTIONS')



function sendGenericMessage(recipientId, messageText) {
  // To be expanded in later sections
}


function sendTextMessage(recipientId, messageText) {
  debug('Sending text message')
  // Splits string by max length accepted by API 
  const splitString = chunkString(messageText, 630)
  console.log(splitString)
  splitString.map((messageTextSplit, key)=>{
  	debug('LENGTH: ', messageTextSplit.length)
	//set time out to try and conserver message order
	setTimeout(()=>{
		var messageData = {
	    recipient: {
	      id: recipientId
	    },
	    message: {
	      text: messageTextSplit
	    }
	  };
	  callSendAPI(messageData);  			
	}, key*100)
	  
  })

}

function chunkString(str, len) {
  var _size = Math.ceil(str.length/len),
      _ret  = new Array(_size),
      _offset
  ;

  for (var _i=0; _i<_size; _i++) {
    _offset = _i * len;
    _ret[_i] = str.substring(_offset, _offset + len);
  }

  return _ret;
}

function sendArticleMessage(senderID, article) {
	debug('Sending article message')
  	const messageData = {
	    recipient: {
	      id: senderID
	    },
	    message: {
	    attachment:{
	          	type:"template",
	          	payload:{
		            template_type:"generic",
		            elements:[{
		              	image_url:article.main_image,
		                title:article.title,
			        	"buttons":[
				            {
				                "type":"web_url",
				                "url":article.url,
				                "title":"View Article"
				             },{
				                "type":"postback",
				                "title":"Read Here",
				                "payload":JSON.stringify({ type: "VIEW_FULL_PHYSICS_ARTICLE", article_id: article._id})
				            }              
			            ]     
		            }]
	       		}
	        }
	    }
 	}  
  callSendAPI(messageData)
}

function sendButtonMessage(senderID, text, buttons){
	debug('Sending button message')
  	const messageData = {
	    recipient: {
	      id: senderID
	    },
	    message: {
	    attachment:{
	          	type:"template",
	          	payload:{
		            template_type:"button",
		            text: text,
			        buttons: buttons
	       		}
	        }
	    }
 	}  
  callSendAPI(messageData)

}


function sendListMessage(senderID, listElements){
	debug('Constructing list message')
	const messageData = {
	    recipient: {
	      id: senderID
	    },
	    message: {
	    attachment:{
	          	type:"template",
	          	 "payload": {
	          	 	template_type: "list",
	          	 	elements: listElements,
	          	 	// buttons: [
		            //     {
		            //         "title": "View More",
		            //         "type": "postback",
		            //         "payload": "payload"                        
		            //     }
		            // ]  
	          	 }
	        }
	        
	    }
 	}  
  callSendAPI(messageData) 
}



function callSendAPI(messageData) {
	debug('Calling send API')
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: config.external_API.messenger_PAGE_ACCESS_TOKEN },
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
	sendTextMessage: sendTextMessage,
	sendArticleMessage: sendArticleMessage,
	sendListMessage: sendListMessage,
	sendButtonMessage: sendButtonMessage

}