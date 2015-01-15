/**
 * Created by Joeri Smits on 31/12/2014.
 */

var express = require("express");
var router = express.Router();
var controllerAuth = require("../controllers/authenticationController");
var controllerPortal = require("../controllers/portalController");

router.route("/login")
    .post(controllerAuth.loginProcess);

router.post("/portal/register", checkAuthentication, controllerAuth.register);

router.get("/portal", checkAuthentication, controllerPortal.getPortal);

// Check if a session with VID and password exist.
function checkAuthentication(req, res, next) {
    if (req.session.isLoggedIn) {
        next();
    } else {
        res.redirect("/");
    }
}

router.get("/logout", checkAuthentication, controllerAuth.logOut);

module.exports = router;