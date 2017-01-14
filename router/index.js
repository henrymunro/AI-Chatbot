var express = require('express')
var router = require('./router')


var messengerFunctions = require('./functions/messengerFunctions')
var wit = require('./functions/witAI')


module.exports = function (app) {
  app.use('/messenger', require('./routes/messenger')),
  app.use('/messenger/log', require('./routes/log'))
}

