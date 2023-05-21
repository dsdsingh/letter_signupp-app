//jshint esversion: 6

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

//Get initialize
app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

//post initialize
app.post("/", function(req, res){
    var fistName = req.body.fname;
    var lastName = req.body.lname;
    var email = req.body.email;
    console.log(fistName, lastName, email);

    const data = {
        members: [
            {
                email_address : email,
                status : "subscribed",
                merge_fields : {
                    FNAME : fistName,
                    LNAME : lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us13.api.mailchimp.com/3.0/lists/4c582f184b"
    const options = {
        method : 'POST',
        auth : "deeapk:03339e6ced4b96345a2f93c5903e36ba-us13"
    }
    const request = https.request(url, options, function(response){
        if(response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        }else {
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", function(data){
           // console.log(JSON.parse(data))
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure" , function(req , res){
    res.redirect("/");
});

//server port
app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000");
});


//list_id
//4c582f184b

//api-key
//03339e6ced4b96345a2f93c5903e36ba-us13