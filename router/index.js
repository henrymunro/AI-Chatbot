var express = require('express')
var router = require('./router')


const db = require('./functions/databaseConnection')
const phycisNews = require('./functions/schemas/physicsNewsSchema')

module.exports = function (app) {
  app.use('/messenger', require('./routes/messenger')),
  app.use('/messenger/log', require('./routes/log'))
}

