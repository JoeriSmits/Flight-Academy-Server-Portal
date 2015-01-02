/**
 * Created by Joeri Smits on 01/01/2015.
 */

var express = require("express");
var router = express.Router();
var controller = require("../controllers/portalController");

// Check if a session with VID and password exist.
function checkAuthentication(req, res, next) {
    if (req.session.isLoggedIn) {
        next();
    } else {
        res.redirect("/");
    }
}

module.exports = router;