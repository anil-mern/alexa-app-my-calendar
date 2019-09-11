let log4js = require('log4js'),
    util = require("util");

let config = require('../config.js');
let publicHoildays = require('../data/publicHoildays.json');
let weeksFormat = require('../data/weeks.json');
let coursesList = require('../data/faculty.json');
let recList = require('../data/studentRec.json');

let logger = log4js.getLogger('my-calendar.mainHandler');
logger.level = 'debug';


delegateSlotCollection = (self, request) => {
    logger.info("delegateSlotCollection function has executed");

    if (request.dialogState && request.dialogState === 'STARTED') {
        var updatedIntent = request.intent;
        self.emit(':delegate', updatedIntent);
    } else if (request.dialogState && request.dialogState !== 'COMPLETED') {
        self.emit(':delegate');
    } else {
        return request.intent
    }
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

        let filledSlots = delegateSlotCollection(this, eventRequest);

        if (filledSlots && (filledSlots.confirmationStatus === 'NONE' ||
            filledSlots.confirmationStatus === 'CONFIRMED') && eventRequest.intent.slots &&
            eventRequest.intent.slots.customDate.value) {

            let date = new Date(eventRequest.intent.slots.customDate.value);
            let todayDate = date.toLocaleDateString();
            let isHolidayAvailable = publicHoildays[todayDate];
            let weekCode = date.getDay();

            if (isHolidayAvailable) {

                responseText = util.format(
                    "It seems like you don't have school on %s, because it's %s!",
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
                coursesList[weekCode % 2].map(function (details) {
                    responseText += util.format(" %s by %s from %s at %s,", 
                    details.course, details.faculty, details.timing, details.location);
                });

                responseText = util.format(
                    "On %s, you have %s sessions, %s",
                    todayDate,
                    coursesList[weekCode % 2].length,
                    responseText
                );

                this.response._responseObject.response.shouldEndSession = false;
                this.response.cardRenderer(responseText);
                this.response.speak(responseText);
                this.emit(':responseReady');
                logger.info(" Schedules has executed successfully");
            }

        } else {

            let date = new Date();
            let todayDate = date.toLocaleDateString();
            let isHolidayAvailable = publicHoildays[todayDate];
            let weekCode = date.getDay();

            if (isHolidayAvailable) {

                responseText = util.format(
                    "It seems like you don't have school on %s, because it's %s!",
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
                coursesList[weekCode % 2].map(function (details) {
                    responseText += util.format(" %s by %s from %s at %s,", 
                    details.course, details.faculty, details.timing, details.location);
                });

                responseText = util.format(
                    "Today that is on %s, you have %s sessions, %s",
                    todayDate,
                    coursesList[weekCode % 2].length,
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

    // #2
    'StudentRec': function () {

        let responseText = "";
        let eventRequest = this.event.request;
        this.response._responseObject.response.shouldEndSession = false;

        let date = new Date();
        let todayDate = date.toLocaleDateString();
        let isHolidayAvailable = publicHoildays[todayDate];
        let weekCode = date.getDay();

        if (isHolidayAvailable) {

            responseText = util.format(
                "Student Rec center will be remained closed on %s, because it's %s!",
                todayDate,
                isHolidayAvailable
            );

            this.response.speak(responseText);
            this.emit(':responseReady');
            logger.info(" Schedules has executed successfully, %s", responseText);

        } else {

            responseText += util.format("Student rec center timing on %s, is between %s,",
                todayDate, recList[weekCode].timing);

            this.response._responseObject.response.shouldEndSession = false;
            this.response.cardRenderer(responseText);
            this.response.speak(responseText);
            this.emit(':responseReady');
            logger.info(" Schedules has executed successfully");
        }

    },

    // #4
    'Unhandled': function () {
        logger.info('Unhandled intent. Not match with any intent defined.');
        this.response._responseObject.response.shouldEndSession = false;
        this.response.speak("Sorry I didnt understand that. Say help if you need any assistance.");
        this.response.listen(config.helpReprompt);
        this.emit(':responseReady');
    }
};

module.exports = mainHandler;