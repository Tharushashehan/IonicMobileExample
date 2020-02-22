/* global angular */
/* global ionic */
/* global console */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
(function () {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('LogoutCtrl', ['$scope', '$state', '$ionicLoading', 'LoginService', '$localStorage','$window', '$ionicHistory',
            function ($scope,  $state, $ionicLoading, LoginService, $localStorage, $window, $ionicHistory)
              {
                  $scope.$on("$ionicView.beforeEnter", function (event, data) {
                  console.log(data);
                  doLogout();
                  $ionicHistory.nextViewOptions({
                    disableAnimate: true
                  });

                  $state.go('login');
                });



                function doLogout() {
                    if ($localStorage.userId && $localStorage.userId.length > 0) {

                        var orgId = $localStorage.orgId;
                        var userId = $localStorage.userId;
                        var refreshToken = $localStorage.refreshToken;
                        var userRole = $localStorage.profile.role;
                        var pushToken = $localStorage.pushToken;

                        var deviceType;
                        if (ionic.Platform.isAndroid()) {
                          deviceType = "android";
                        }
                        else if (ionic.Platform.isIPad() || ionic.Platform.isIOS()) {
                          deviceType = "apple";
                        }

                        //Call push modjoul.unsubscribe service
                        if (userRole === "employee" || userRole === "risk_manager" || userRole === "supervisor") {
                            LoginService.unRegisterFromPushNotification(orgId, userId, deviceType, pushToken).then(function (result) {
                                console.log("Unregister push notification");
                                console.log(result);
                            }, function (error) {
                                console.log("Fail to unregister for Push Notification " + error);
                            });
                        }

                        LoginService.logout(orgId, userId, refreshToken).then(function (result) {
                            console.log("Logout succeed " + result);
                        }, function (error) {
                            console.log("Logout failed " + error);
                        });

                        $window.localStorage.clear();
                        $ionicHistory.clearCache();
                        $ionicHistory.clearHistory();
                        $localStorage.$reset();



                    }
                }
            }
        ]);

})();
