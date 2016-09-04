/**
 * App ID for the skill
 */
var APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * Use Particle API JS to access the temperature / humidity data
 * @see https://docs.particle.io/reference/javascript/
 */
var Particle = require('particle-api-js');
var particle = new Particle();

/**
 * Particle authentication credentials
 * @see https://docs.particle.io/reference/api/#authentication
 */
var PARTICLE_DEVICE_ID = "YOUR_DEVICE_ID_HERE";
var PARTICLE_ACCESS_TOKEN = "YOUR_ACCESS_TOKEN_HERE";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * ParticleSkill is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var ParticleSkill = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
ParticleSkill.prototype = Object.create(AlexaSkill.prototype);
ParticleSkill.prototype.constructor = ParticleSkill;

ParticleSkill.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("ParticleSkill onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

ParticleSkill.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("ParticleSkill onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to the Particle Weather Station. You can ask me for the temperature or humidity.";
    var repromptText = "You can ask me for the temperature or humidity";
    response.ask(speechOutput, repromptText);
};

ParticleSkill.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("ParticleSkill onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

ParticleSkill.prototype.intentHandlers = {
    // register custom intent handlers
    "ParticleSkillIntent": function (intent, session, response) {
        var sensorSlot = intent.slots.sensor;
        var sensor = sensorSlot ? intent.slots.sensor.value : "";
        var speakText = "";

        if(sensor) {
          particle.getVariable({ deviceId: PARTICLE_DEVICE_ID, name: sensor, auth: PARTICLE_ACCESS_TOKEN }).then(function(data) {
            console.log('Particle variable retrieved successfully: ', data);

            var speechOutput = "The " + sensor + " is " + data.body.result + ((sensor == "temperature") ? "°" : "%");
            response.tellWithCard(speechOutput, "Particle Weather Station", speechOutput);
          }, function(err) {
            console.log('An error occurred while getting attrs:', err);

            var speechOutput = "There was an error when requesting the information";
            response.tellWithCard(speechOutput, "Particle Weather Station", speechOutput);
          });
        }
        else {
          response.tell("Sorry, I didn't catch what you said");
        }
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechOutput = "You can ask me for the temperature or humidity";
        response.ask(speechOutput);
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the ParticleSkill skill.
    var particleSkill = new ParticleSkill();
    particleSkill.execute(event, context);
};
