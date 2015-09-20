#include <ESP8266WiFi.h>

const char* ssid     = "IASTATE";
const char* password = "";
const char* host = "theoccupancyproject.parseapp.com";
String API_KEY = "VdWSfZSMsdaB6hfDRMFb1Ct4PJSqJErnABpwTRHW";
boolean lastState = false;

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  
  Serial.print("Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("");
  Serial.println("WiFi connected");  
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  // Initally send out false state
  sendState("18:FE:34:F4:D0:AF", false, false);
}

void loop() {
  // Update sensor state every 15 seconds (lights currently not used)
//  if(digitalRead(2) == HIGH) {
//    sendState("18:FE:34:F4:D0:AF", false, true);
//  } else {
//    sendState("18:FE:34:F4:D0:AF", false, false);
//  }

  if(analogRead(A0) < 20) {
    sendState("18:FE:34:F4:D0:AF", false, true);
    lastState = true;
    Serial.println("Waiting....");
    delay(15000);
  } else if(lastState == true){
    sendState("18:FE:34:F4:D0:AF", false, false);
    lastState = false;
  }
   
}

void sendState(String address, boolean lights, boolean occupied) {
  
  WiFiClient client;
  const int httpPort = 80;
  if (!client.connect(host, httpPort)) {
    Serial.println("connection failed");
    return;
  }

  String lightsStr = (lights) ? "true" : "false";
  String occupiedStr = (occupied) ? "true" : "false";
  String json = "{\"MACAddress\":\"" + address + "\", \"occupied\":" + occupiedStr + "}";

  String postData;
  postData += "POST /sensor HTTP/1.0 \r\n";
  postData += "X-Parse-REST-API-Key: " + API_KEY + "\r\n";
  postData += "Content-Type: application/json \r\n";
  postData += "Host: " + String(host) + " \r\n";
  postData += "Content-Length: " + String(json.length()) + "\r\n\r\n";
  postData += json;
  
  // Send the postdata to the server.
  client.print(postData);
  
  delay(1000);
  
  // Read all the lines of the reply from server and print them to Serial
  while(client.available()){
    String line = client.readStringUntil('\r');
    Serial.print(line);
  }
  
  Serial.println();
  Serial.println("Closing connection!");
} 
