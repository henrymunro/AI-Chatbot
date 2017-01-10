const debug = require('debug')('wit')

const {Wit, log} = require('node-wit')



debug('Loading in WIT functions')




const client = new Wit({accessToken: 'WD7T6CL6TYJICOOB3LHCHJY2B55H5BPZ'});


client.converse('my-user-session-44', 'make me a gin and tonic?', {})
.then((data) => {
	const drink = data.entities.drink[0].value
	const intent = data.entities.intent[0].value
	debug('INTENT: '+ intent)
	debug('DRINK: '+ drink)
	console.log(data.entities)
})
.catch(console.error);


//order_drink

// response: {
// 	"confidence":0.17855198220245205,
// 	"type":"msg",
// 	"msg":"Coming right up!",
// 	"entities":{
// 		"drink":[
// 			{"confidence":0.988345911235984,"type":"value","value":"gin and tonic"}
// 			],
// 		"intent":[{"confidence":0.9991377239250098,"value":"order drink"}]
// 	}
// }


// { confidence: 0.06363650824583601,
//   type: 'action',
//   action: 'orderDrink',
//   entities: { drink: [ [Object] ], intent: [ [Object] ] } }
