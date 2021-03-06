var path = require("path");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mockAPIResponse = require("./mockAPI.js");
const AYLIENTextAPI = require("aylien_textapi");
const dotenv = require("dotenv").config();

// Url build variables
const baseUrl = "https://api.aylien.com/api/v1/sentiment/?";
const mode = "mode=tweet&";
const text = "text=John+is+a+very+good+football+player";

const app = express();

/* Middleware*/

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Cors for cross origin allowance

app.use(cors());

//Enable preflight for all requests

// app.options("*", cors());

app.use(express.static("dist"));

console.log(__dirname);

var textapi = new AYLIENTextAPI({
  application_id: process.env.APP_ID,
  application_key: process.env.API_KEY,
});

// Aylien API Call

app.get("/", function (req, res) {
  // res.sendFile('dist/index.html')
  res.sendFile(path.resolve("src/client/views/index.html"));
});

// designates what port the app will listen to for incoming requests

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));

app.post("/api/", function (req, res) {
  console.log("API called");

  //Grab request text
  const userText = req.body.text;

  //Call Aylien API
  async function myFetch(a) {
    await textapi.sentiment(
      {
        text: a,
      },
      function (error, response) {
        if (error === null) {
          res.json(response);
          console.log(response);
        } else {
          console.log(error, "An error has occured");
          res.status(500).send({ error: "something blew up" });
        }
      }
    );
  }

  myFetch(userText);
});
