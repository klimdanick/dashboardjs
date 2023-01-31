# dashboardjs
An IOT middleware that can be used as desktop aplication and webinterface

This IOT middleware was created to make an expandable platform that could potentialy do enything you want with sensor data.
It is a desktop aplication to use as smart thermostat and an web application to vieuw the sensor data more indept.

I wanted to create this to monitor the CO2 gases that are released when i am soldering in my room, so that i can ventilate the room when its nesserery.

So i had to create the dashboard and some hardware to sense the co2.

## pipeline

the pipeline works as follows:
      (I2C)     (HTTP)          (HTTP)
Sensor --> ESP32 --> Express API --> Electron application\n
                            |\n
                     (JSON) |\n
                            V\n
                         Database\n
                         
                         
## API

the dashboard api is realy simple.
It has 1 endpoint: /data

To send data you send a POST request to this endpoint with a parameter with the name of your data ID and the value of your sensor.

To recieve all the data of an ID you send a GET request with the parameter with the name "type" and the value is the ID you want to get.

A new data ID can be added in the top of the dashboard.js file.
