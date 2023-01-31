#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "UPC0050950-3";
const char* password = "IkHebGeenIdee2016";

//Your Domain name with URL path or IP address with path
String serverName = "http://192.168.0.108/data?co2=";

// the following variables are unsigned longs because the time, measured in
// milliseconds, will quickly become a bigger number than can be stored in an int.
unsigned long lastTime = 0;
// Timer set to 10 minutes (600000)
//unsigned long timerDelay = 600000;
// Set timer to 5 seconds (5000)
unsigned long timerDelay = 100;

void setup() {
  Serial.begin(115200);
  pinMode(33, INPUT);

  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
 
  Serial.println("Timer set to 5 seconds (timerDelay variable), it will take 5 seconds before publishing the first reading.");
}

void loop() {
  //Send an HTTP POST request every 10 minutes
  if ((millis() - lastTime) > timerDelay) {
    //Check WiFi connection status
    if(WiFi.status()== WL_CONNECTED){
      WiFiClient client;
      HTTPClient http;
    
      // Your Domain name with URL path or IP address with path
      int x = 0;

      for (int i = 0; i < 1000; i++) {
        x+=analogRead(33);  
      }
      x/=1000;
      
      
      http.begin(client, serverName+x);

      // Specify content-type header
      http.addHeader("Content-Type", "application/x-www-form-urlencoded");
      // Data to send with HTTP POST
      String httpRequestData = "";           
      // Send HTTP POST request
      int httpResponseCode =0;
      httpResponseCode = http.POST(httpRequestData);
      
      // If you need an HTTP request with a content type: application/json, use the following:
      //http.addHeader("Content-Type", "application/json");
      //int httpResponseCode = http.POST("{\"api_key\":\"aPnTH7Ab3k9G5\",\"sensor\":\"BME280\",\"value1\":\"36.00\",\"value2\":\"60.54\",\"value3\":\"954.14\"}");

      // If you need an HTTP request with a content type: text/plain
      //http.addHeader("Content-Type", "text/plain");
      //int httpResponseCode = http.POST("Hello, World!");
      Serial.println(http.getString());
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
        
      // Free resources
      http.end();
    }
    else {
      Serial.println("WiFi Disconnected");
    }
    lastTime = millis();
  }
}
