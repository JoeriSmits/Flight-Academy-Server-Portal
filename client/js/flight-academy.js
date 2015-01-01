/**
 * Created by Joeri Smits on 31/12/2014.
 */

var app = angular.module("FlightAcademy", [])
    .run(function ($rootScope) {
        // Getting new date for copyright message
        var date = new Date();
        $rootScope.currentYear = date.getFullYear();
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

app.controller("portalController", function ($scope, $http) {
    "use strict";

    // Log out button.
    $scope.logOut = function () {
        $http.get("/logout");
        window.location = "/";
    };

    /**
     * Gets information from the server about the log data of the server.
     */
    $http.get("/portal/log")
        .success(function (data) {
            var newData = data.logData.replace(/\n/g, "<br />");
            document.getElementById("logData").innerHTML = newData;
        });
});