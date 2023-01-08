// Imports
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("node:https");


const apiKey = "16f56243657f5b242e24b9378c55ef2f-us14";

// Usages
const app = express();
app.use(bodyParser.urlencoded({extended:true}));;
app.use(express.static("public"));
app.listen(process.env.PORT || 3000, ()=>{
    console.log("Server is running on port 3000");
});

app.post("/", (req, res)=>{
    var firstName = req.body.fname;
    var lastName = req.body.lname;
    var email = req.body.email;

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);

    const url = "https://us14.api.mailchimp.com/3.0/lists/2d60472004";
    const options = {
        method: "POST",
        auth: "nocxliii:16f56243657f5b242e24b9378c55ef2f-us14"
    }

    const request = https.request(url, options, (response)=>{

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", (data)=>{
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();

});

app.post("/failure", (req, res) => {
    res.redirect("/");
})



app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");   
});
