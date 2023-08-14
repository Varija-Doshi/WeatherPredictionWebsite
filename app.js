const { response } = require("express");
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser"); //step1 using body parser: npm install body-parser
// step2: require body-parser

const app = express();

// step3: app.use("bodyParser.urlencoded({extended:true})")
app.use(bodyParser.urlencoded({ extended: true }));

//using the html file to get input into a form
app.get("/", function(req, res) {
    //sending the file to our root page for the client to fill the form
    res.sendFile(__dirname + "/index.html");
});

//**posting** this page after the client clicks on **submit button**
app.post("/", function(req, res) {
    //accessing the input thru bodyParser using the **name attribute**
    const query = req.body.cityName;
    const apiKey = "hidden";
    const units = "metric"

    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + units;

    https.get(url, function(response) { //getting the response from external server
        console.log(response.statusCode);

        response.on("data", function(data) { //going thru the data we received from external server
            const weatherData = JSON.parse(data); //converting data from hexadecimal to JSON 
            console.log(weatherData);

            const temperature = weatherData.main.temp; //parsing the JSON format data using JSON view pro that gives path in that object
            console.log(temperature)

            const weatherDescp = weatherData.weather[0].description;
            console.log(weatherDescp);

            const icon = weatherData.weather[0].icon;
            const imageurl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

            res.write("<h1>The temperature in " + query + " is " + temperature + " deg Celcius</h1>");
            res.write("<h3>The weather is currently " + weatherDescp + "</h3>")
            res.write("<img src= " + imageurl + ">")
            res.send();

            // const object = {
            //     name: "Shruti",
            //     class: 15,
            // }

            // console.log(JSON.stringify(object));
        });
    });

    // res.send("Server is running");
    //app.get() can have only 1 res.send()
})

app.listen(3000, function() {
    console.log("App is listening on port 3000");
});
