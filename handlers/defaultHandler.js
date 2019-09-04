const config = require('../config.js');

const defaultHandler = {
    'AMAZON.HelpIntent': function () {
        const speechOutput = config.helpMessage;
        const reprompt = config.helpReprompt;
        this.response._responseObject.response.shouldEndSession = false;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response._responseObject.response.shouldEndSession = true;
        this.response.speak(config.stopMessage);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response._responseObject.response.shouldEndSession = true;
        this.response.speak(config.stopMessage);
        this.emit(':responseReady');
    },
};

module.exports = defaultHandler;