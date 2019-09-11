# Build An Alexa Calendar Skill
<img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/quiz-game/header._TTH_.png" />

This Alexa sample skill is a template for a basic my-calendar skill.

Alexa will speak out the schedule of my grad classes based on the current day or when the specific date is provided when the skill is invoked. It will check that weather it's
a working day or holiday? If its holiday it will specify the reason for holiday.

## How to use (Just speak)

> _Alexa, open my calendar_
>
> ___Hello User, hope you are doing well___

> _My classes info_
>
> ___You have so and so class by faculty between 11:00am to 11:50am___

> _What classes I have on 2nd Sep 2019_
>
> ___It's look like school will remain close because it's labours day___

> _what are Student rec timings_
>
> ___Student Rec will be opened between 08:00am to 9:00pm___

## Recent Updates

* Used advance concepts such as slots to get the dynamic inputs from the end-user
* Added new intenet for the student rec timings

## TODO

* Enhance the existing skill
* Need to add the gym timings

## Skill Architecture
Each skill consists of two basic parts, a front end and a back end.
The front end is the voice interface, or VUI.
The voice interface is configured through the voice interaction model.
The back end is where the logic of your skill resides.

## Three Options for Skill Setup
There are a number of different ways for you to setup your skill, depending on your experience and what tools you have available.

 * If this is your first skill, choose the [Alexa-Hosted backend instructions](./instructions/setup-vui-alexa-hosted.md) to get started quickly.
 * If you want to manage the backend resources in your own AWS account, you can follow the [AWS-Hosted instructions](./instructions/setup-vui-aws-hosted.md).
 * Developers with the ASK Command Line Interface configured may follow the [ASK CLI instructions](./instructions/cli.md).

---

## Additional Resources

### Community
* [Amazon Developer Forums](https://forums.developer.amazon.com/spaces/165/index.html) - Join the conversation!
* [Hackster.io](https://www.hackster.io/amazon-alexa) - See what others are building with Alexa.

### Tutorials & Guides
* [Voice Design Guide](https://developer.amazon.com/designing-for-voice/) - A great resource for learning conversational and voice user interface design.
* [Codecademy: Learn Alexa](https://www.codecademy.com/learn/learn-alexa) - Learn how to build an Alexa Skill from within your browser with this beginner friendly tutorial on Codecademy!

### Documentation
* [Official Alexa Skills Kit SDK for Node.js](http://alexa.design/node-sdk-docs) - The Official Node.js SDK Documentation
* [Official Alexa Skills Kit Documentation](https://developer.amazon.com/docs/ask-overviews/build-skills-with-the-alexa-skills-kit.html) - Official Alexa Skills Kit Documentation
