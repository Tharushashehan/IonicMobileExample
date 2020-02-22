/* global angular */
/* global ionic */
/* global FCMPlugin */
/* global window */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

(function () {
    'use strict';
    angular.module('modjoul-mobile.controllers', [])
        .controller('LoginCtrl', ['$scope', '$rootScope', '$ionicModal', '$timeout', '$state', '$ionicLoading', 'LoginService', '$cordovaDialogs', '$localStorage',
            '$window', '$ionicHistory', '$ionicPopup', 'OrgManagementService', 'STRINGS', '$log', 'MESSAGES',
            function ($scope, $rootScope, $ionicModal, $timeout, $state, $ionicLoading, LoginService, $cordovaDialogs, $localStorage,
                      $window, $ionicHistory, $ionicPopup, OrgManagementService, STRINGS, $log, MESSAGES) {

                delete $localStorage.auth_error_shown;

                $scope.$on('$ionicView.beforeEnter', function (event, data) {
                    checkAndNavigate();
                    $log.debug(data);
                });

                $scope.$on('$ionicView.enter', function () {
                    $ionicHistory.clearCache();
                });

                $scope.loginData = {};
                $rootScope.callSupportTel = STRINGS.CALL_SUPPORT_TEL;


                // Triggered in the login modal to close it
                $scope.closeLogin = function () {
                    $scope.modal.hide();
                };

                function checkAndNavigate() {
                    if ($localStorage.profile) {
                        var profile = $localStorage.profile;

                        if (profile.role === 'employee') {
                            $state.go('employee.productivity-worktime');
                        } else if (profile.role === 'supervisor') {
                            $state.go('supervisor.productivity-rankings');
                        } else if (profile.role === 'risk_manager') {
                            $state.go('risk-manager.dashboard');
                        } else if (profile.role === 'org_admin') {
                            $state.go('org-admin.users');
                        } else if (profile.role === 'super_admin') {
                            $state.go('super-admin.organizations');
                        } else if (profile.role === 'device_manufacturer') {
                            $state.go('device-manufacturer.dashboard');
                        }

                        $timeout(function () {
                            checkAndRegisterForPush(profile);
                        }, 5000);
                    }
                }

                function getOrgConfiguration(orgId) {
                    OrgManagementService.getOrgConfiguration(orgId)
                        .then(function (result) {
                            if (result.status === 200) {
                                $rootScope.orgConfigs = result.data;
                                $localStorage.orgConfigs = result.data;
                            }
                        }, function (error) {
                            $log.debug(error);
                        });
                }

                $scope.promptRoles = function () {
                    var listItems = [
                        {text: 'Ureal0003 (Employee)', value: 'ureal0003@a.com'},
                        {text: 'Brandon (Employee)', value: 'brandon@modjoul.com'},
                        {text: 'Roger (Supervisor)', value: 'roger@modjoul.com'},
                        {text: 'William (Risk Manager)', value: 'william@modjoul.com'},
                        {text: 'Thomas (Org Admin)', value: 'thomas@modjoul.com'},
                        {text: 'Goutam (Device Manufacturer)', value: 'goutam@modjoul.com'},
                        {text: 'Eric (Super Admin)', value: 'eric@modjoul.com'}
                    ];

                    var config = {
                        title: 'Select User',
                        items: listItems,
                        selectedValue: 'ureal0003@a.com',
                        doneButtonLabel: 'Sign in',
                        cancelButtonLabel: 'Cancel'
                    };

                    window.plugins.listpicker.showPicker(config,
                        function (item) {
                            $log.debug('You have selected ' + item);
                            $scope.loginData.userName = item;
                            $scope.loginData.password = 'modjoul105';
                            $scope.doLogin();
                        },
                        function () {
                            $log.debug('You have cancelled');
                        }
                    );
                };

                $scope.doLogin = function () {

                    if (!$scope.loginData.userName || $scope.loginData.userName === "" || !$scope.loginData.password || $scope.loginData.password === "") {
                        $cordovaDialogs.alert(MESSAGES.EMPTY_FIELDS_MESSAGE, '', 'Ok')
                            .then(function () {
                                $log.debug(MESSAGES.EMPTY_FIELDS_MESSAGE);
                            });
                    }
                    else if (!validateEmail($scope.loginData.userName)) {
                        $cordovaDialogs.alert(MESSAGES.INVALID_EMAIL_ADDRESS, '', 'Ok')
                            .then(function () {
                                $log.debug(MESSAGES.INVALID_EMAIL_ADDRESS);
                            });
                    }
                    else {

                        $ionicLoading.show();

                        LoginService.login({
                            username: $scope.loginData.userName,
                            password: $scope.loginData.password
                        }).then(function (result) {
                            $log.debug(result);
                            $ionicLoading.hide();
                            if (result.status === 200) {
                                if (result.data.surveyCompleted === false) {
                                    $scope.surveyRedirect();
                                    return;
                                }

                                $localStorage.accessToken = result.data.token;
                                $localStorage.userId = result.data.user.userId;
                                $localStorage.orgId = result.data.user.orgId;
                                $localStorage.profile = result.data.user;
                                $scope.userId = result.data.user.userId;
                                $scope.orgId = result.data.user.orgId;
                                checkAndRegisterForPush(result.data.user);

                                var role = result.data.user.role;

                                if (role === 'employee') {
                                    $state.go('employee.productivity-worktime');
                                } else if (role === 'supervisor') {
                                    $state.go('supervisor.productivity-rankings');
                                } else if (role === 'risk_manager') {
                                    $state.go('risk-manager.dashboard');
                                } else if (role === 'org_admin') {
                                    $state.go('org-admin.users');
                                } else if (role === 'super_admin') {
                                    $state.go('super-admin.organizations');
                                } else if (role === 'device_manufacturer') {
                                    $state.go('device-manufacturer.dashboard');
                                }
                                $scope.loginData = {};
                                // getOrgConfiguration($localStorage.orgId);
                            } else {
                                $cordovaDialogs.alert('Login failed', '', 'Ok')
                                    .then(function () {
                                        $log.debug('Login failed');
                                    });
                            }
                        }, function () {
                            $ionicLoading.hide();
                            $cordovaDialogs.alert('Login failed', '', 'Ok')
                                .then(function () {
                                    $log.debug('Login failed');
                                });
                        });
                    }

                };

                //     function doLogout () {
                //       if ($localStorage.userId && $localStorage.userId.length > 0) {
                //         var orgId = $localStorage.orgId;
                //         var userId = $localStorage.userId;
                //         var refreshToken = $localStorage.refreshToken;
                //         var userRole = $localStorage.profile.role;
                //
                //         $window.localStorage.clear();
                //         $ionicHistory.clearCache();
                //         $ionicHistory.clearHistory();
                //         $localStorage.$reset();
                //
                //         LoginService.logout(orgId, userId, refreshToken).then(function (result) {
                //           $log.debug('Logout succeed ' + result);
                //         }, function (error) {
                //           $log.debug('Logout failed ' + error);
                //         });
                //
                // // Call push modjoul.unsubscribe service
                //         if (userRole === 'risk_manager' || userRole === 'supervisor') {
                //           LoginService.unRegisterFromPushNotification(orgId, userId).then(function (result) {
                //             $log.debug('Unregister push notification ' + result );
                //           }, function (error) {
                //             $log.debug('Fail to unregister for Push Notification ' + error);
                //           });
                //         }
                //       }
                //     }

                $scope.surveyRedirect = function () {
                    $ionicPopup.show({
                        templateUrl: 'templates/survey-redirect-message.html',
                        scope: $scope,
                        cssClass: 'popup-graph',
                        buttons: [
                            {
                                text: '<b>OK</b>',
                                type: 'btn btn-scorecard',
                                onTap: function () {
                                    $state.go('login');
                                }
                            }
                        ]
                    });
                };

                function checkAndRegisterForPush(userData) {
                    // Perform only on device
                    if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
                        // result.data.role and register only relavant users/roles
                        if (userData.role === 'employee' || userData.role === 'risk_manager' || userData.role === 'supervisor') {
                            // FCMPlugin.getToken(
                            //     function (token) {
                            //         $log.debug(token);
                            //         subscribeForPush(token);
                            //     },
                            //     function (err) {
                            //         $log.debug('FCM error retrieving token: ' + err);
                            //     }
                            // );

                            // FCMPlugin.onNotification(
                            //     function (data) {
                            //         var userRole = $localStorage.profile.role;

                            //         if (data.wasTapped) {
                            //             // Notification was received on device tray and tapped by the user.
                            //             // alert(JSON.stringify(data));

                            //             if (userRole === 'risk_manager') {
                            //                 if (data.notificationType === STRINGS.NOTIFICATION_TYPE_CLAIM) {
                            //                     $state.go('risk-manager.claims');
                            //                 }
                            //             }
                            //         } else {
                            //             // Notification was received in foreground. Maybe the user needs to be notified.

                            //             if (userRole === 'employee' || userRole === 'risk_manager' || userRole === 'supervisor') {

                            //                 $log.debug(JSON.stringify(data));

                            //                 showToast(data);
                            //             }
                            //         }
                            //     },
                            //     function (msg) {
                            //         $log.debug('onNotification callback successfully registered: ' + msg);
                            //     },
                            //     function (err) {
                            //         $log.debug('Error registering onNotification callback: ' + err);
                            //     }
                            // );
                        }
                    }
                }

                function showToast(data) {
                    var message;
                    if (ionic.Platform.isAndroid()) {
                        if (data.body) {
                            message = data.body;
                        }
                    }
                    else if (ionic.Platform.isIOS()) {
                        if (data.aps.alert.body) {
                            message = data.aps.alert.body;
                        }
                    }

                    window.plugins.toast.showWithOptions(
                        {
                            message: message,
                            duration: 7000, // ms
                            position: 'top',
                            addPixelsY: -25,
                            data: {'notificationType': data.notificationType},
                            styling: {
                                opacity: 0.8,
                                backgroundColor: '#000000',
                                textColor: '#FFFFFF',
                                textSize: 15,
                                cornerRadius: 5.0, // minimum is 0 (square). iOS default 20, Android default 100
                                horizontalPadding: 90, // iOS default 16, Android default 50
                                verticalPadding: 18 // iOS default 12, Android default 30
                            }

                        },
                        function (result) {
                            if (result && result.event) {
                                $log.debug('The toast was tapped');
                                $log.debug('Event: ' + result.event);
                                if (result.data.notificationType === STRINGS.NOTIFICATION_TYPE_CLAIM) {
                                    $state.go('risk-manager.claims');
                                }
                            } else {
                                $log.debug('The toast has been shown');
                            }
                        }
                    );
                }

                $scope.forgotPassword = function () {
                    if (!$scope.loginData.userName || $scope.loginData.userName === "") {
                        $cordovaDialogs.alert(MESSAGES.EMPTY_EMAIL_ADDRESS_MESSAGE, '', 'Ok')
                            .then(function () {
                                $log.debug(MESSAGES.EMPTY_EMAIL_ADDRESS_MESSAGE);
                            });
                    }
                    else {
                        $ionicLoading.show();

                        LoginService.forgotPassword($scope.loginData.userName).then(function (result) {
                            $ionicLoading.hide();
                            $log.debug(result);
                            $cordovaDialogs.alert(MESSAGES.FORGOT_PASSWORD_SUCCESS, '', 'Ok')
                                .then(function () {
                                    $log.debug(MESSAGES.FORGOT_PASSWORD_SUCCESS);
                                });
                        }, function () {
                            $ionicLoading.hide();
                            $cordovaDialogs.alert(MESSAGES.FORGOT_PASSWORD_FAILURE, '', 'Ok')
                                .then(function () {
                                    $log.debug(MESSAGES.FORGOT_PASSWORD_FAILURE);
                                });
                        });
                    }
                };

                function validateEmail(emailAddress) {
                    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
                    return reg.test(emailAddress);

                }

                function subscribeForPush(token) {
                    var deviceType = '';
                    var orgId = $localStorage.orgId;
                    var userId = $localStorage.userId;

                    $localStorage.pushToken = token;

                    if (ionic.Platform.isAndroid()) {
                        deviceType = 'android';
                        $log.debug('Android Device');
                    } else if (ionic.Platform.isIPad() || ionic.Platform.isIOS()) {
                        deviceType = 'apple';
                        $log.debug('Apple Device');
                    }

                    LoginService.registerForPushNotification(orgId, userId, token, deviceType).then(function (result) {
                        $log.debug('Registered for Push Notification');
                        $log.debug(result);
                    }, function (error) {
                        $log.debug('Fail to register for Push Notification ' + error);
                    });
                }
            }]);
})();
