# particle-weather-station-alexa

Ask Alexa for the temperature and humidity, which is measured with a DHT11 sensor connected to a Particle Photon. The Alexa skill also uses the [JavaScript Particle API](https://docs.particle.io/reference/javascript/) to get the data from Particle.

See [particle-weather-station](https://github.com/drejkim/particle-weather-station) for the original version of this project that visualizes the data on a realtime dashboard.

*Note: You don't need an Amazon Alexa device to get started... although it's certainly more fun if you have an Echo, Tap, or Dot! You can use [Echosim.io](https://echosim.io/), which is a web-based Alexa skill testing tool.*

## Supplies

* [Particle Photon](https://store.particle.io/)
* [DHT11 sensor](https://www.adafruit.com/product/386) (includes a resistor)
* Breadboard
* Jumper wires

## Setting up Particle

### Hardware configuration

Go through the [Particle Photon Getting Started Guide](https://docs.particle.io/guide/getting-started/intro/photon/) to get your Photon up and running. Then, wire up the board. Here's a picture of the circuit:

![Circuit](https://raw.githubusercontent.com/drejkim/particle-weather-station/master/img/circuit.jpg)

First, let's wire up the Photon:

* Place the Photon on the left side of the breadboard.
* Connect a jumper wire from the 3V3 pin to the power line of the breadboard.
* Connect a jumper wire from the GND pin to the ground line of the breadboard.

Now, let's wire up the DHT11 sensor:

* Add the DHT11 sensor to the right side of the breadboard, with the perforated side facing you. Note that there are 4 pins, from left to right: VCC, Data out, Not connected, and GND.
* Connect VCC to one of the breadboard's power pins.
* Connect GND to one of the breadboard's ground pins.
* Connect the Data out pin to D5 of the Photon.
* Connect the resistor between the VCC and data pins.

### Using the Particle Dev IDE

* Download the [Particle Dev IDE](https://www.particle.io/dev) and follow the [instructions](https://docs.particle.io/guide/tools-and-features/dev/) on how to log into your account and select your device.
* Open `ino/dht11.ino` in the IDE.
* Send the code to the board
  * Select the **Compile** button. If it's compiled successfully, the status bar on the bottom should say, "Success!"
  * Send the code to the board by selecting the **Flash** button. Again, if it's successful, the status bar should say, "Success!"

## Setting up Amazon Alexa Services

### AWS Lambda Setup

1. Navigate to `particle-weather-station-alexa/alexa/src`
* Type `npm install` to install the required Node.js packages
* Zip up all the files in the `src` folder&mdash;including `node_modules`&mdash; but not the `src` folder itself!
* Go to your [AWS Console](https://aws.amazon.com/) and navigate to AWS Lambda
* Make sure the region is **US East (N. Virginia)**
* If you have no Lambda functions yet, click **Get Started Now**; otherwise, click **Create a Lambda Function**
* Skip the step **Select blueprint**
* In **Configure triggers**, select **Alexa Skills Kit** from the gray dotted box, then click **Next**
* In **Configure function**:
  * Name: ParticleWeatherStation
  * Runtime: Node.js 4.3
  * Code entry type: Upload a .ZIP file
    * Select the .ZIP file created in step 3
  * Handler: index.Handler
  * Role: Choose an existing role
  * Existing role: lambda_basic_execution
  * Memory (MB): 128
  * Timeout: 0 min 8 sec
    * I increased the default from 3 sec to 8 sec to give enough time for the request to process
  * VPC: No VPC
* Then, create the function
* Make note of ARN for the new Lambda function, which is on the upper-right of the function page... you'll need this when setting up the Alexa skill

### Alexa Skills Setup

* Go to your [Amazon Developer Dashboard](https://developer.amazon.com) and select **Alex**
* Select **Get Started** with Alexa Skills Kit
* Select **Add a New Skill**
* In **Skill Information**:
  * Skill Type: Custom Interaction Model
  * Name: ParticleWeatherStation
  * Invocation Name: particle weather station
  * Audio Player: No
* In **Interaction Model**:
  * Intent Schema: Copy and paste the content from `particle-weather-station-alexa/alexa/speechAssets/IntentSchema.json`
  * Custom Slot Types: Select **Add Slot Type**
    * Enter Type: LIST_OF_SENSORS
    * Enter Values: Copy and paste the content from `particle-weather-station-alexa/alexa/speechAssets/slotValues.txt`
  * Sample Utterances: Copy and paste the content from `particle-weather-station-alexa/alexa/speechAssets/SampleUtterances.txt`
* In **Configuration**:
  * Endpoint: Lambda ARN
    * Copy and paste the ARN from the last step of **AWS Lambda Setup**
  * Account Linking: No

### Using Echosim.io

* Go to [Echosim.io](https://echosim.io/)
* Try out either one of these commands:
  * *Alexa, ask particle weather station for the temperature*
  * *Alexa, ask particle weather station for the humidity*

And, Alexa should respond with the current value, depending on which value you asked for! You can also try this out with your own Alexa-enabled device.

## References

* [Creating an AWS Lambda Function for a Custom Skill](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/developing-an-alexa-skill-as-a-lambda-function)
* [Deploying a Sample Custom Skill to AWS Lambda](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/deploying-a-sample-skill-to-aws-lambda)
* [amzn/alexa-skills-kit-js](https://github.com/amzn/alexa-skills-kit-js): Node.js Alexa Skills Kit Samples
* [krvarma/Particle_Alexa](https://github.com/krvarma/Particle_Alexa): Particle and Amazon Alexa integration
