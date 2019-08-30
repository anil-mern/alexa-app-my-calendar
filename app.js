"use strict";

const alexa = require("alexa-sdk");
let log4js = require('log4js');


const config = require("./config.js");
const defaultHandler = require("./handlers/defaultHandler.js");
const mainHandler = require("./handlers/mainHandler.js");

let logger = log4js.getLogger();
logger.level = 'debug';


module.exports.handler = (event, context) => {
  var alexaHandler = alexa.handler(event, context);
  logger.info(" alexaHandler object has created.");

  alexaHandler.APP_ID = config.appId;
  logger.info(" appId has register successfully, ", alexaHandler.APP_ID);
  logger.info(" appId has register successfully, ", alexaHandler.appId);

  alexaHandler.registerHandlers(defaultHandler, mainHandler);
  logger.info(" handlers are register successfully.");

  alexaHandler.execute();
  logger.info(" alexaHandler execute() completed.");
};
