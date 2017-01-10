const debug = require('debug')('log')

//Load in router class
const Router = require('../router')
const router = new Router().router


debug('Startup: Loading in LOG routes')

// Test route
router.get('/', (req, res)=>{
  debug('GET: log')
  res.status(200).send('SUCCESS')
})

router.post('/', (req, res)=>{
  debug('POST: log')
  res.status(200).send('SUCCESS')
})



module.exports = router;
