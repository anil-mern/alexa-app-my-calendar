const config = {
    appId: "amzn1.ask.skill.80af0233-d971-40c7-8db2-a5d29de13856", // Alexa skill id will get it from amazon developer console
    skillName: "My Calender",
    helpMessage: "Hmm! you can ask about, class schedule?",
    helpReprompt: "Anything else would you like to know about you classes?",
    stopMessage: "Thank you.. and please do remember with your pending assignements...",
    welcomeNote: "Hello Anil, hope your doing well..!",
    nextReprompt: "Would you like to know any thing else ?"
}

console.log("process.env.url: ", process.env.url);

module.exports = config;
