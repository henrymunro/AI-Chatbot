var express = require('express')
var router = require('./router')


// var nodeWit = require('./functions/nodeWit')
// var witSpeech = require('./functions/witSpeech')
var sonus = require('./functions/sonus_2')

// var googleSpeech = require('./functions/googleSpeech')



module.exports = function (app) {
  app.use('/log', require('./routes/log')),
  app.use('/message', require('./routes/message'))
}
