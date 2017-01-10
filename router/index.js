var express = require('express')
var router = require('./router')


// var nodeWit = require('./functions/nodeWit')
// var witSpeech = require('./functions/witSpeech')
var snowboy = require('./functions/snowboy')



module.exports = function (app) {
  app.use('/log', require('./routes/log')),
  app.use('/message', require('./routes/message'))
}

