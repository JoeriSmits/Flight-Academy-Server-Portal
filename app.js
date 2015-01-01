/**
 * Created by Joeri Smits on 31/12/2014.
 */
/*jslint node: true*/
/*jslint nomen: true*/
/*jslint unparam:true*/
"use strict";

var express = require('express');
var path = require('path');
var fs = require('fs');
var bodyParser = require("body-parser");

var app = express();
var session = require("express-session");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

// Using directory client-side as client directory.
app.use(express.static(path.join(__dirname, '/client')));

app.use(session({
    secret: "idfgbuijwevgdfhiyuwadf"
}));

// Getting all the routes in the routes directory
var routes_path = __dirname + '/server/routes',
    route_files = fs.readdirSync(routes_path);
route_files.forEach(function (file) {
    var route;
    route = require(routes_path + '/' + file);
    app.use('', route);
});

// Catch all for unmatched routes
app.all('*', function (req, res) {
    res.send({
        result: {
            code: 1,
            message: "Nothing here."
        }
    });
});

module.exports = app;
