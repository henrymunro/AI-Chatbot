const debug = require('debug')('wit')
const {Wit, log} = require('node-wit')
const config = require('../config')

debug('Startup: Loading in WIT functions')



const client = new Wit({accessToken: config.WIT_TOKEN});



function sendRequestToWIT(messengerID, message){
	return new Promise((resolve, reject)=>{
		debug('Sending request to WIT: ' + message)
		let response = {
			intent: '',
			WITResponse: '',
			attribute: {}
		}

		client.converse('my-user-session-44', message, {})
		.then((data) => {
			const drink = ((data.entities||{}).drink||[{value:''}])[0].value
	        const intent = ((data.entities||{}).intent||[{value:''}])[0].value
	        response = {
	        	intent: intent,
	        	WITResponse: '',
	        	attribute: {
	        		drink: drink
	        	}
	        }
			// debug('INTENT: '+ intent)
			// debug('DRINK: '+ drink)
			console.log(data.entities)
			processWITResponse(message, response, resolve)
		})
		.catch(err=>{
			debug('ERROR: ', err)
			reject({ module: 'sendRequestToWIT', message: err})
		})
	})
}


function processWITResponse(message, response, resolve) {
	const { intent, WITResponse, attribute } = response 
	debug('Processing WIT Repsonse: ' + intent)

	 switch (intent) {
      	case 'order_drink':
        	orderDrink(attribute.drink, resolve);
        	break;

      	case 'recommend_drink':
        	reccomendDrink(resolve);
       		break;

      	default:
        	resolve('default')
    }
}


function orderDrink(drink, resolve){
	debug('Ordering drink: ', drink)
	const response = drink + ' coming right up!'
	resolve(response)
	
}

function reccomendDrink(resolve){
	debug('Recommening drink')
	resolve('You should order a rum and coke!')
}



module.exports = {
	sendRequestToWIT: sendRequestToWIT

}

