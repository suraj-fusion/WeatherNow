const express=require("express");
const https = require("https"); // https is a native node module so we dont install it using npm
const bodyParser=require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){

    res.sendFile(__dirname+"/index.html");

});


app.post("/",function(req,res){
    

const query=req.body.cityName;
const apiKey="b9f5b5bc52efacd196f7644f16a96a9e";
const unit="metric";
const url="https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+apiKey+"&units="+unit;
https.get(url,function(response){

    console.log(response.statusCode);

    response.on("data",function(data){
           const weatherData=JSON.parse(data);
           console.log(weatherData);
           const temp=weatherData.main.temp;
           const desc=weatherData.weather[0].description;
           const icon=weatherData.weather[0].icon;
           const imageUrl="http://openweathermap.org/img/wn/"+ icon+"@2x.png";
           res.write("<body><center>");
           res.write("<p>The weather is currently "+desc+"</p>");
           res.write("<h1>The temprature in "+query+" is "+temp+" degree Celcius </h1>");
           res.write("<img src="+imageUrl+">" );
           res.write("</center></body>");
           res.send();
          
    });
    
});

});






app.listen(3000,function(){
    console.log("Server Started on port 3000");
});