let log4js = require('log4js'),
    util = require("util");

let config = require('../config.js');
let publicHoildays = require('./publicHoildays.json');
let weeksFormat = require('./weeks.json');
let coursesList = require('./faculty.json');

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

    // #1
    'LaunchRequest': function () {
        this.response._responseObject.response.shouldEndSession = false;
        this.response.cardRenderer(config.welcomeNote);
        this.response.speak(config.welcomeNote);
        this.response.listen(config.helpMessage);
        this.emit(':responseReady');
        logger.info("LaunchRequest has executed.");
    },

    // #2
    'MyClassesInfo': function () {
        
        let responseText = "";
        let eventRequest = this.event.request;
        this.response._responseObject.response.shouldEndSession = false;

        // let filledSlots = delegateSlotCollection(this, eventRequest);

        if (eventRequest.dialogState && eventRequest.dialogState == 'COMPLETED' && eventRequest.intent.slots.customDate.value) {

            // code need to be added

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
                coursesList[weekCode%2].map(function(details) {
                    responseText += util.format(" %s by %s from %s,", details.course, details.faculty, details.timing);
                });

                responseText = util.format(
                    "You have %s sessions, %s", 
                    coursesList[weekCode%2].length,
                    responseText
                );

                this.response._responseObject.response.shouldEndSession = false;
                this.response.cardRenderer(responseText);
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