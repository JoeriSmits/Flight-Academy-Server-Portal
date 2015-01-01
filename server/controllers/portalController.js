/**
 * Created by Joeri Smits on 01/01/2015.
 */

var path = require('path');
var fs = require('fs');

// Gets the HTML file of the portal secured page.
exports.getPortal = function (req, res) {
    // Render the correct HTML file
    res.sendFile(path.resolve() + "/client/portal.html");
};

exports.getLogFile = function (req, res) {
    fs.readFile("dummy.txt", "utf8", function (err, data) {
        if (err) {
            throw err;
        }
        res.send({
            logData: data
        })
    })
};
