const debug = require('debug')('messenger')
const request = require('request')

const config = require('../config.json')


const { receivedMessage, postbackMessageFlow } = require('../functions/messengerFlow')


//Load in router class
const Router = require('../router')
const router = new Router().router

const PAGE_ACCESS_TOKEN = config.messenger_PAGE_ACCESS_TOKEN
const VERIFY_TOKEN = config.messenger_VERIFY_TOKEN


debug('Startup: Loading in MESSENGER routes')

router.get('/webhook', (req, res)=> {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === VERIFY_TOKEN) {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);          
  }  
})



router.post('/webhook', function (req, res) {
  try {
    var data = req.body;
    debug('MESSAGE POST RECIEVED')

    // Make sure this is a page subscription
    if (data.object === 'page') {

      // Iterate over each entry - there may be multiple if batched
      data.entry.forEach(function(entry) {
        var pageID = entry.id;
        var timeOfEvent = entry.time;

        // Iterate over each messaging event
        entry.messaging.forEach(function(event) {
          const sentPayload = ((event||{}).postback||{}).payload
          const payload = JSON.parse(sentPayload||'{}')
          console.log('PAYLOADDD: ', payload)
          if (event.message) {
            receivedMessage(event);
          } else if(payload.type) {              
              debug('SENFING ')
              postbackMessageFlow(event, payload)
          } else {
            console.log("Webhook received unknown event: ", event)          
          }
        });
      });

      res.sendStatus(200);  
    }
  } catch(err) {
    debug('ERROR: ', err)
    res.sendStatus(200)
  }
});
  


module.exports = router;

