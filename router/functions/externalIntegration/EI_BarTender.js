const debug = require('debug')('externalIntegration')
const config = require('../../config')
const request = require('request')

const { RoboBarTenderURL } = config.internal_API

debug('Startup: Loading in EXTERNALINTEGRATION functions')



function sendDrinkOrderToBar(senderID, drink){
	return new Promise((resolve, reject)=>{
		debug('Sending drink order to RoboBarTender: ', drink)

		// Sends request to bar tender who will validate and make drink
		request.post({url:RoboBarTenderURL, form: {Drink_id: drink, Volume:300}}, (err,httpResponse,body)=>{ 
			if(err) {
				debug('ERROR: '+ err)
				reject(err)
			}

			body = JSON.parse(body)
			const { orderPlaced, msg, errorMessage } = body

			let messageResponse
			if(orderPlaced){
				// Drink has been sucessfully ordered
				messageResponse = drink + ' coming right up!'
			}else{
				// Drink not sucessfully ordered
				switch (msg.trim()) {
					default:
			        	messageResponse = 'Sorry I can\'t make that right now'

				 	case 'no_cup':
				 		debug('Response recieved from bar tender: No cup in bar tender')
				 		messageResponse = 'You need to put a cup in the bar!'
				 		break;
			        case 'bar_tender_busy':
				        debug('Response recieved from bar tender: Bar tender busy')
			        	messageResponse = 'The bar tender is aleady making a drink, just wait a min'
			       		break;
			      	case 'no_ingredients':
			      		debug('Response recieved from bar tender: Dont have ingredients for drink')
			      		messageResponse = 'I\'m sorry I don\'t have the ingredients to make a '+drink+' now, '
			        	break;
			      	case 'bar_tender_off':
			      		debug('Response recieved from bar tender: Bar tender is off')
			        	messageResponse = 'The bar tender is off, switch it on and i\'ll make you what ever you want...'
			       		break;
			       	case 'drink_not_recognised':
			       		debug('Response recieved from bar tender: Drink not recognised')
			       		messageResponse = 'I\'m sorry I\'ve not heard of that one, you should visit https://henrymunro.com/RoboBarTender and make it'
			      		break;			      	
			    }
			}
			
			resolve({ messageResponse })
		})


	})
}

function getPopularDrinksFromBar(senderID){
	return new Promise((resolve, reject)=>{
		debug('Getting popular drinks from RoboBarTender')

		resolve({drinks:['mallie and callie']})
	})
}

module.exports = {
	sendDrinkOrderToBar: sendDrinkOrderToBar,
	getPopularDrinksFromBar: getPopularDrinksFromBar
}