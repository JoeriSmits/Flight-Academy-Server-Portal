/**
 * Created by Joeri Smits on 31/12/2014.
 */

var registeredUsers = [
    {
        VID: "1",
        password: "1"
    },
    {
        VID: "2",
        password: "2"
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