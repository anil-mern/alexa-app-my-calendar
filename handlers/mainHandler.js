let log4js = require('log4js'),
    util = require("util");

let config = require('../config.js');
let publicHoildays = require('./publicHoildays.json');
let weeksFormat = require('./weeks.json');
let coursesList = require('./faculry.json');

let logger = log4js.getLogger();
logger.level = 'debug';


delegateSlotCollection = (self, request) => {
    logger.info("delegateSlotCollection function has executed");

    if (request.dialogState === 'STARTED') {
        var updatedIntent = request.intent;
        self.emit(':delegate', updatedIntent);
    } else if (request.dialogState !== 'COMPLETED') {
        self.emit(':delegate');
    } else {
        return request.intent
    }
};

restCall = (self, sessionAttributes, options, callback) => {
    let speechText = "please login to continue";
    self.response.cardRenderer(speechText);
    self.response.speak(speechText);
    self.emit(':responseReady');
    logger.error(" token needed to access, need to login with color and code.");
};


var mainHandler = {

    'LaunchRequest': function () {
        this.response._responseObject.response.shouldEndSession = false;
        this.response.cardRenderer(config.welcomeNote);
        this.response.speak(config.welcomeNote);
        this.response.listen(config.helpMessage);
        this.emit(':responseReady');
        logger.info("LaunchRequest has executed.")
    },

    // #1
    'BuildCodeIntent': function () {
        var responseText;
        var sessionAttributes = this.response._responseObject.sessionAttributes;
        this.response._responseObject.response.shouldEndSession = false;
        var options = {
            method: 'GET',
            url: util.format("%s/api/preferences/user/preference/execute/bot", config.baseUrl),
            qs: { context: 'Voice-Build' }
        };
        restCall(this, sessionAttributes, options, (error, buildDetails) => {
            if (error) {
                responseText = "You have no voice build configure to execute";
                this.response.speak(responseText);
                this.response.listen(config.nextReprompt);
                this.emit(':responseReady');
                logger.info(" BuildCodeIntent function has error", error);
            } else {
                responseText = "Your code has build, Successfully";
                this.response.speak(responseText);
                this.response.listen(config.nextReprompt);
                this.emit(':responseReady');
                logger.info(" BuildCodeIntent function has executed successfully");
            }
        });
    },

    // #2
    'Schedules': function () {
        
        let responseText = "";
        let eventRequest = this.event.request;
        this.response._responseObject.response.shouldEndSession = false;

        let filledSlots = delegateSlotCollection(this, eventRequest);
        
        // if (filledSlots && (filledSlots.confirmationStatus === 'NONE' || filledSlots.confirmationStatus === 'CONFIRMED')
        //     && eventRequest.dialogState == 'COMPLETED') {

        if (eventRequest.dialogState == 'COMPLETED' && eventRequest.intent.slots.customDate.value) {

            let todayDate = new Date().toLocaleString();

            console.log('-----eventRequest----', eventRequest);

        } else {
            
            let date = new Date();
            let todayDate = date.toLocaleDateString();

            let isHolidayAvailable = publicHoildays[todayDate];
            let weekCode = date.getDay();


            if (isHolidayAvailable) {

                responseText = util.format(
                    "It seems like you don't have school today i.e; on %s, because it's %s!", 
                    todayDate, 
                    isHolidayAvailable
                );

                this.response.speak(responseText);
                this.emit(':responseReady');
                logger.info(" Schedules has executed successfully, %s", responseText);

            } else if (weekCode == "0" || weekCode == "6") {
                
                responseText = util.format(
                    "It's %s, there are no classes, school is off...", 
                    weeksFormat[weekCode]
                );

                this.response.speak(responseText);
                this.emit(':responseReady');
                logger.info(" Schedules has executed successfully");

            } else {

                coursesList[weekCode%2].map(function(details){
                    responseText.concat(
                        details.course + " by "+ details.faculty + " between "+ details.timing+ ", "
                    )
                });

                responseText = util.format(
                    "You have %s sessions, %s", 
                    coursesList[0].length(),
                    responseText
                );

                this.response.speak(responseText);
                this.emit(':responseReady');
                logger.info(" Schedules has executed successfully");

            }
        }
    },

    // #3
    'Unhandled': function () {
        logger.info('Unhandled intent. Not match with any intent defined.');
        this.response._responseObject.response.shouldEndSession = false;
        this.response.speak("Sorry I didnt understand that. Say help if you need any assistance.");
        this.response.listen(config.helpReprompt);
        this.emit(':responseReady');
    }
};

module.exports = mainHandler;