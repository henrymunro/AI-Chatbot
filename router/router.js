var express = require('express')
const debug = require('debug')('router')

debug('Startup: Loading in router')


module.exports =  class Router {
	constructor() {
    	
		var router = express.Router()		

		router.use(function(req, res, next){
		  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
		  res.header('Access-Control-Allow-Headers', 'Content-type');
		  next();
		})

		this.router = router
	}

	router(){
		return this.router
	}
}
