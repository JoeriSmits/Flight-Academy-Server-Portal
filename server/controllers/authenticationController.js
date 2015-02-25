/**
 * Created by Joeri Smits on 31/12/2014.
 */

var registeredUsers = [
    {
        VID: "161477",
        password: "HDM1965"
    },
    {
        VID: "436859",
        password: "Vuurtoren1"
    },
    {
        VID: "184862",
        password: "YRLRBJ"
    }
];

exports.loginProcess = function (req, res) {
    // Loops trough the registeredUsers array
    function checkUsers(callback) {
        var userExist,
            i;
        for (i = 0; i < registeredUsers.length; i = i + 1) {
            // Checks if the requested data matches the data in registeredUsers
            if (req.body.VID === registeredUsers[i].VID && req.body.password === registeredUsers[i].password) {
                userExist = true;
            }
        }
        callback(userExist, req);
    }

    // Checks if userExist is true. If so it will redirect the user to the secured page. If not it will send an error to the user.
    function handleAuthentication(userExist, req) {
        var session = req.session;
        if (userExist) {
            session.isLoggedIn = req.body.VID;
            res.send({
                redirect: "/portal"
            });
        } else {
            res.send({
                error: true,
                errorMessage: "User information is invalid"
            });
        }
    }

    checkUsers(handleAuthentication);
};

// Destroying the session so that the user logs out.
exports.logOut = function (req) {
    req.session.destroy();
};

// Register a new user on the server
exports.register = function (req, res) {
    /*
     Req.body.job : 1 = New user is a pilot
     Has to changed to 4 because of the server structure
     Req.body.job : 2 = New user is a trainer
     Has to be changed to 12 because of the server structure
     */
    var job,
        fs = require("fs"),
        filePath = "../flight-academy/unix/cert.txt",
        dataToAppend;

    if (req.body.job == 1) {
        job = 4;
    } else if (req.body.job == 2) {
        job = 12;
    }

    dataToAppend = "\r\n" + ";" + req.body.name + "\n" + req.body.VID + " " + req.body.password + " " + job;

    if (req.body.name !== undefined && req.body.VID !== undefined && req.body.password !== undefined) {
        fs.readFile(filePath, function (err, data) {
            if (err) throw err;
            var newData = data.toString();
            // Checking if the VID already exists in the cert.txt file
            if (newData.indexOf(req.body.VID) < 0) {
                fs.appendFile(filePath, dataToAppend, function (err) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send({
                            error: false,
                            message: req.body.name + " is successfully added to the server"
                        });
                    }
                });
            } else {
                res.send({
                    error: true,
                    message: req.body.VID + " does already exist on this server. Registration process has ended"
                });
            }
        });
    } else {
        res.send({
            error: true,
            message: "A field cannot be empty"
        });
    }
};