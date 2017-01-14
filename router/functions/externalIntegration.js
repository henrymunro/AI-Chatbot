const debug = require('debug')('externalIntegration')


debug('Startup: Loading in EXTERNALINTEGRATION functions')



function sendDrinkOrderToBar(senderID, drink){
	return new Promise((resolve, reject)=>{
		debug('Sending drink order to RoboBarTender: ', drink)

		resolve({drinkOrdered: true, message: 'Your drink has been ordered!'})


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