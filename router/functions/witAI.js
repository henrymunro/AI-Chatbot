const debug = require('debug')('wit')
const {Wit, log} = require('node-wit')
const config = require('../config')

debug('Startup: Loading in WIT functions')



const client = new Wit({accessToken: config.external_API.WIT_TOKEN});



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
	        WITresponse = {
	        	intent,
	        	WITResponse: '',
	        	attribute: {
	        		drink
	        	}
	        }
			// debug('INTENT: '+ intent)
			// debug('DRINK: '+ drink)
			console.log(data.entities)
			resolve({ message, WITresponse })
		})
		.catch(err=>{
			debug('ERROR: ', err)
			reject({ module: 'sendRequestToWIT', message: err})
		})
	})
}





module.exports = {
	sendRequestToWIT: sendRequestToWIT

}

