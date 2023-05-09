const express=require("express");  //requie express in the app
const https = require("https"); // https is a native node module so we dont install it using npm
const bodyParser=require("body-parser"); //require body-parser for parsing http requests so that we can access submitted form data through req.body
require('dotenv').config()  //require dotenv 
const ejs= require('ejs');


const app = express();               //making an app using express

app.set('view engine','ejs');        //setting viewengine as ejs

app.use(bodyParser.urlencoded({extended:true})); //setting app to use body parser with extended option to true this means that we can parse complex form data which are js objects with arrays or nested objects


//get route to default page
app.get("/",function(req,res){

    res.render("index");

});


app.post("/",function(req,res){


const query=req.body.cityName;
const apiKey=process.env.WEATHER_KEY;
const unit="metric";
const url="https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+apiKey+"&units="+unit; //the url needs to have strict formatting so full url with https 
console.log(url);
https.get(url,function(response){  //making a get request to specified url using https module 

    console.log(response.statusCode); // 200 means all ok response was delivered to the client successfully

    if(response.statusCode===404)  //if wrong city is entered 
    {
        
        res.render("failure");
        

    }
    else 
    {
   
    response.on("data",function(data){       //response.on here means when the response contains some data then 
           const weatherData=JSON.parse(data); // the data that comes back is in form of hexadecimal so we convert it to json object using JSON.parse
           console.log(weatherData);
           const temp=weatherData.main.temp;
           const desc=weatherData.weather[0].description;
           const icon=weatherData.weather[0].icon;
           const imageUrl="http://openweathermap.org/img/wn/"+ icon+"@2x.png";
          
          res.render("weather",{ejs_desc:desc,ejs_query:query,ejs_temp:temp,ejs_url:imageUrl});
          
    });
}
});

});






app.listen(3000,function(){
    console.log("Server Started on port 3000");
});