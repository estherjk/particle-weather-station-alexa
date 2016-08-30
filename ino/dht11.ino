#include "Adafruit_DHT.h"

// DHT parameters
#define DHTPIN 5
#define DHTTYPE DHT11

int temperature;
int humidity;

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  dht.begin();
}

void loop() {
  temperature = dht.getTempFarenheit();
  humidity = dht.getHumidity();

  // Expose variables through the Particle Cloud, so that it can be called with GET /v1/devices/{DEVICE_ID}/{VARIABLE}
  Particle.variable("temperature", temperature);
  Particle.variable("humidity", humidity);

  // Publish events through the Particle Cloud
  Particle.publish("temperature", String(temperature), PRIVATE);
  Particle.publish("humidity", String(humidity), PRIVATE);

  delay(10000);
}
