const debug = require('debug')('EI_BarTender')
const config = require('../../config')
const request = require('request')

const { RoboBarTenderURL, RoboBarTenderKillPumps, RoboBarTenderGetDrinks } = config.internal_API

debug('Startup: Loading in BARTENDER functions')



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

			let messageResponse, drinkOrdered
			if(orderPlaced){
				// Drink has been sucessfully ordered
				messageResponse = drink + ' coming right up!'
				drinkOrdered = true
			}else{
				// Drink not sucessfully ordered
				drinkOrdered = false
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
			
			resolve({ messageResponse, drinkOrdered })
		})


	})
}


function getPopularDrinksFromBar(senderID){
	return new Promise((resolve, reject)=>{
		debug('Getting popular drinks from RoboBarTender')

		request.get(RoboBarTenderGetDrinks, (err, httpResponse, body)=>{
			// Error sent by request
			if (err){
				debug('ERROR: ', err)
				reject('Error getting drinks')
			} else if( httpResponse.statusCode != 200){
				// This covers if we redirect to RoboBarTender doesn't work
				debug('Cant connect to RoboBarTender')
				reject('Cant connect to RoboBarTener')
			} else {
				const defaultImage = 'default.jpg'
				let drinks = JSON.parse(body)
				drinks = drinks.sort( function() { return 0.5 - Math.random() } )
				drinks = drinks.slice(0,4)
				const listElements = drinks.map((drink, key)=>{
					return  {
	                    title: drink.DrinkName,
	                    // subtitle: drink.DrinkDescription,
	                    image_url: 'https://henrymunro.com/RoboBarTender/images/' + (drink.DrinkImage==''?defaultImage:drink.DrinkImage),
	                    buttons: [
		                        {
		                           "title": "Order",
				                    "type": "postback",
				                    "payload": JSON.stringify({ type: "ORDER_DRINK", Drink_id: drink.DrinkName})                        
		                        }
		                    ]   
               		}					
				})	
				resolve(listElements)
			}	
		})
	})
}



function killAllPumps(){
	return new Promise((resolve, reject)=>{
		request.get(RoboBarTenderKillPumps, (err, httpResponse, body)=>{
			// Error sent by request
			if (err){
				debug('ERROR: ', err)
				reject('ERROR KILLING PUMPS')
			} else if( httpResponse.statusCode != 200){
				// This covers if we redirect to RoboBarTender doesn't work
				debug('Cant connect to RoboBarTender')
				reject('Cant connect to RoboBarTener')
			} else {
				// Status = false if RoboBarTender had an error whilst processing
				const { status } = JSON.parse(body)
				const pumpError = JSON.parse(body).err
				if (!status){
					debug('ERROR killing pumps: ', pumpError)
					reject('ERROR KILLING PUMPS') 
				} else {
					debug('sucessfully killed all pumps')
					resolve('All pumps switched off')
				}				
			}
		})		
	})
}

module.exports = {
	sendDrinkOrderToBar: sendDrinkOrderToBar,
	getPopularDrinksFromBar: getPopularDrinksFromBar,
	killAllPumps: killAllPumps 
}


