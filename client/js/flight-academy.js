/**
 * Created by Joeri Smits on 31/12/2014.
 */

var app = angular.module("FlightAcademy", [])
    .run(function ($rootScope) {
        // Getting new date for copyright message
        var date = new Date();
        $rootScope.currentYear = date.getFullYear();
    });

app.factory('socketIO', function ($rootScope) {
    var socket = io();
    socket.on("connect", function () {
        console.log("connected", socket.io.engine.id);
    });
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        },
        id: function () {
            return socket.io.engine.id;
        }
    };
});

app.controller("loginController", function ($scope, $http) {
    "use strict";

    /**
     * Authentication process. We check if the user is registered on the server.
     * If so he will be redirected to the next page. If not he will get an error message.
     * @param username
     * @param password
     */
    $scope.login = function (VID, password) {
        var userInfo = {
            VID: VID,
            password: password
        };

        $http.post("/login", userInfo)
            .success(function (data) {
                // If there is an error with the authentication from the server it will be displayed.
                if (data.error) {
                    $scope.errorMessage = data.errorMessage;
                } else if (data.redirect) {
                    window.location = data.redirect;
                }
            })
            .error(function (data, status) {
                alert("Ajax error: ", status, data);
            });
    }
});

app.controller("portalController", function ($scope, $http, socketIO) {
    "use strict";

    // Log out button.
    $scope.logOut = function () {
        $http.get("/logout");
        window.location = "/";
    };

    /**
     * Gets information from the server about the log data of the server.
     */
    socketIO.on("logData", function (data) {
        // Injecting the data into the HTML file
        var newData = data.replace(/\n/g, "<br />");
        document.getElementById("logData").innerHTML = newData;

        // Scrolling to the bottom of the panel
        var logDataPanel = document.getElementsByClassName("logData");
        logDataPanel[0].scrollTop = logDataPanel[0].scrollHeight;
    });

    /**
     * Register a new user to the server
     * @param name
     * @param VID
     * @param password
     * @param job
     */
    $scope.register = function (name, VID, password, job) {
        var registerData = {
            name: name,
            VID: VID,
            password: password,
            job: job
        };

        $http.post("/portal/register", registerData)
            .success(function (data) {
                $scope.registerMessage = {
                    error: data.error,
                    message: data.message
                };
                // Empty fields if the user is successfully added
                if (!data.error) {
                    var inputs = document.getElementsByClassName("form-control"),
                        i;
                    for (i = 0; i < inputs.length - 1; i = i + 1) {
                        inputs[i].value = null;
                    }
                }
            })
    };

    $scope.reboot = function () {
        alert("Under development");
    };

    $scope.clearLog = function () {
        alert("Under development");
    }
});