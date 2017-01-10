const debug = require('debug')('message')

//Load in router class
const Router = require('../router')
const router = new Router().router

debug('Startup: Loading in MESSAGE routes')

// Test route
router.get('/', (req, res)=>{
  debug('GET: message')
  res.status(200).send('SUCCESS')
})

router.post('/', (req,res)=>{
  debug('POST: message')  
  res.status(200).send('SUCCESS')
})




module.exports = router;
