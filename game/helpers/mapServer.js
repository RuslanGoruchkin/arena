const express = require("express");
const fs = require("fs");

const app = express();
let mapInstance = "";

app.get("/floor/4", function(req, res) {
    fs.readFile("map4.txt", function read(err, data) {
        if (err) {
            throw err;
        }
        mapInstance = data;
    });
    let html =
        `
    <body>
       ` +
        mapInstance +
        `
    </body>`;
    res.send(html);
});

app.get("/floor/5", function(req, res) {
    fs.readFile("map5.txt", function read(err, data) {
        if (err) {
            throw err;
        }
        mapInstance = data;
    });
    let html =
        `
    <body>
       ` +
        mapInstance +
        `
    </body>`;
    res.send(html);
});

let server = app.listen(3420, function() {
    let host = server.address().address;
    let port = server.address().port;
    console.log("Example app listening at %s:%s Port", host, port);
});
