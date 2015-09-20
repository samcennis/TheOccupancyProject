## The Occupancy Project

## Inspiration

As students, we know how difficult it can be to find an open room for a team meeting, group homework session, or some quiet studying. Especially around midterms and finals, it sucks to spend precious study time wandering around campus looking for the right spot. We think we can leverage our skills and the Internet of Things to solve this problem by making Iowa State’s lecture halls, classrooms, and study spots “smart.”

## What It Does

Using the sensor hardware we built, we will be able to report the current occupancy status of a room to a user-friendly web application. This will be done in real-time, so all students have to do is go to our website, select a building, and we’ll show them the open areas in that part of campus! With this new room occupancy information, students can make informed choices about where to study and meet.
As an added bonus, this hardware can also indicate whether the lights in a room are on or off. This allows the university to make informed decisions using analytics from our application about classroom usage, room popularity, energy consumption. Because of Iowa State’s continued growth in enrollment, managing classroom usage effectively is more important than ever. The Occupancy Project will help Iowa State get the most out of their current buildings and be at the forefront of smart and sustainable technologies.

## How We Built It

At the core of our hardware, we used an Adafruit HUZZAH ESP8266 breakout WiFi microcontroller to connect to the ISU network and transmit the signals. For occupancy detection we used an IR sensor and photo resistors to determine light status. We used the Arduino IDE and C to program the hardware.
On the software end, we used Parse to manage the data received from the hardware and Materialize framework (CSS/JavaScript/HTML) for the front-end.

## Challenges We Ran Into

One of the big hurdles we encountered was getting the microcontroller to communicate the sensor data correctly. After spending hours modifying the circuit, rewiring ports, and adjusting power sources, we were finally able to obtain non-gibberish communication from the device.
Another issue we ran into was getting the microcontroller to correctly use the REST API to post sensor data to Parse. Because Parse only accepts HTTPS (secure) connections and the WiFi adapter on our microcontroller does not support them, we had to post to an intermediate server and then transmit the data from there to Parse.

## Accomplishments We're Proud Of

As a team primarily consisting of software-focused engineers, none of us was particularly experienced in the hardware aspect of our project. It was very rewarding to overcome the hardware and embedded systems difficulties and finally see the sensor data being transmitted over the ISU network to our database.

## What We Learned
Although some of the team had used Parse before, we all became more familiar with this powerful tool. We also learned how to configure a microcontroller to interact with sensors and communicate the data over the network correctly.

## What’s Next For The Occupancy Project?
We think we can make this concept a reality and bring true value to ISU students. Our first goal is to get ECpE department permission to set up our system in rooms throughout Coover Hall as a test environment. Once we show the value of our product on this small scale, we will bring the idea to Student Government and request a wider implementation across campus. In the meantime, we will continue to build out our web application so that it’s intuitive and easy-to-use.