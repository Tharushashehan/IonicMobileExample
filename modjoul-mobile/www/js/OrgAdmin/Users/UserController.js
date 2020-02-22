/* global angular */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
(function () {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('UsersController', ['$scope', '$state', 'STRINGS', 'WiFiHotspotService', '$ionicModal', '$ionicLoading', '$timeout',
            function ($scope, $state, STRINGS, WiFiHotspotService, $ionicModal, $ionicLoading, $timeout) {

                $scope.strings = STRINGS;


                $scope.ssidTimeoutValue = 10000;

                $scope.timeoutValue = 20000;

                $scope.factoryResetButtonText = "Factory Reset";
                $scope.infoText = "factory reset";

                if (ionic.Platform.isAndroid()) {
                    $scope.notificationIcon = "img/icons/android-notification.png";
                }
                else if (ionic.Platform.isIOS()) {
                    $scope.notificationIcon = "img/icons/apple-notification.png";
                }

                $scope.navEmployees = function () {
                    $state.go("org-admin.employees");
                };

                $scope.navSupervisors = function () {
                    $state.go("org-admin.supervisors");
                };

                $scope.navAddUser = function () {
                    $state.go("org-admin.add-users");
                };


                $scope.openAddUser = function () {
                    console.log("add employee");
                    $ionicModal.fromTemplateUrl('templates/add-employee-form.html', {
                        scope: $scope,
                        animation: 'slide-in-up'
                    }).then(function (modal) {
                        $scope.modal = modal;
                        $scope.modal.show();
                    });

                };


                $scope.setupWiFiWizard = function () {

                    $scope.wifiPort = {securityType: "WPA2"};

                    $ionicModal.fromTemplateUrl('templates/config-wifi-modal.html', {
                        scope: $scope
                    }).then(function (modal) {
                        $scope.modal = modal;
                        $scope.switchOnBelt = true;
                        $scope.connectBelt = false;
                        $scope.beltConfigOptions = false;
                        $scope.wifiConfigDetails = false;
                        $scope.notificationScreen = false;
                        $scope.modal.show();
                    });

                };

                $scope.wizardFirstScreen = function () {
                    $scope.switchOnBelt = true;
                    $scope.connectBelt = false;
                    $scope.beltConfigOptions = false;
                    $scope.wifiConfigDetails = false;
                    $scope.notificationScreen = false;
                };

                $scope.wizardSecondScreen = function () {
                    $scope.switchOnBelt = false;
                    $scope.connectBelt = true;
                    $scope.beltConfigOptions = false;
                    $scope.wifiConfigDetails = false;
                    $scope.notificationScreen = false;
                };

                $scope.wizardThirdScreen = function () {
                    $scope.wifiPort = {securityType: "WPA2"};
                    $scope.switchOnBelt = false;
                    $scope.connectBelt = false;
                    $scope.beltConfigOptions = true;
                    $scope.wifiConfigDetails = false;
                    $scope.notificationScreen = false;
                };

                $scope.configureWifiSettings = function () {

                    $scope.switchOnBelt = false;
                    $scope.connectBelt = false;
                    $scope.beltConfigOptions = false;
                    $scope.wifiConfigDetails = true;
                    $scope.notificationScreen = false;

                    $scope.isBeltAvailable = false;

                    $ionicLoading.show();

                    shouldCallTimeout = true;
                    $timeout(SSIDTimeout, $scope.ssidTimeoutValue);

                    WiFiHotspotService.getSSIDs().then(function (result) {

                        shouldCallTimeout = false;
                        $ionicLoading.hide();
                        if (result.status === 200) {
                            $scope.isBeltAvailable = true;
                            $scope.ssids = result.data.split(",");

                            console.log($scope.ssids);

                        }
                        else {
                            $scope.isBeltAvailable = false;
                        }

                    }, function () {
                        onSSIDError();
                    });
                };

                $scope.factoryReset = function () {

                    shouldCallTimeout = true;
                    $timeout(SSIDTimeout, $scope.ssidTimeoutValue);

                    WiFiHotspotService.factoryResetSupervisor().then(function (result) {

                        shouldCallTimeout = false;
                        $ionicLoading.hide();
                        if (result.status === 200) {
                            $scope.modal.remove();
                            showToast("Factory Reset issued");
                        }

                    }, function () {
                        showToast("Failed to issue Factory Reset");
                        onSSIDError();
                    });

                };

                var shouldCallTimeout = false;

                $scope.configureWifi = function (wifiDetails) {


                    if (!wifiDetails.ssid || wifiDetails.ssid === "") {
                        $cordovaDialogs.alert(MESSAGES.WIFI.SSID_ERROR, 'Error', 'Ok')
                            .then(function () {
                                console.log(MESSAGES.WIFI.SSID_ERROR);
                            });
                    }
                    else if (!wifiDetails.password || wifiDetails.password === "") {
                        $cordovaDialogs.alert(MESSAGES.WIFI.PASSWORD_ERROR, 'Error', 'Ok')
                            .then(function () {
                                console.log(MESSAGES.WIFI.PASSWORD_ERROR);
                            });
                    }
                    else if (!wifiDetails.securityType || wifiDetails.securityType === "") {
                        $cordovaDialogs.alert(MESSAGES.WIFI.SECURITY_TYPE_ERROR, 'Error', 'Ok')
                            .then(function () {
                                console.log(MESSAGES.WIFI.SECURITY_TYPE_ERROR);
                            });
                    }
                    else {
                        $ionicLoading.show();

                        shouldCallTimeout = true;
                        $timeout(callAtTimeout, $scope.timeoutValue);
                        WiFiHotspotService.postWifiDetails(wifiDetails.ssid, wifiDetails.password, wifiDetails.securityType).then(function (result) {

                            shouldCallTimeout = false;
                            $ionicLoading.hide();
                            if (result.status === 200) {
                                $scope.switchOnBelt = false;
                                $scope.connectBelt = false;
                                $scope.wifiConfigDetails = false;
                                // $scope.modal.hide();
                                $scope.notificationScreen = true;
                                // $cordovaDialogs.alert(MESSAGES.WIFI.SERVICE_SUCCESS, 'Success', 'Ok')
                                //     .then(function () {
                                //         console.log(MESSAGES.WIFI.SERVICE_SUCCESS);
                                //     });

                                $scope.wifiPort = {securityType: "WPA2"};

                            }
                            else {
                                $cordovaDialogs.alert(MESSAGES.WIFI.SERVICE_FAILURE, 'Error', 'Ok')
                                    .then(function () {
                                        console.log(MESSAGES.WIFI.SERVICE_FAILURE);
                                    });
                            }

                        }, function () {
                            onError();
                        });

                    }
                };

                function showToast(data) {
                    window.plugins.toast.showWithOptions(
                        {
                            message: data,
                            duration: 7000, // ms
                            position: 'top',
                            addPixelsY: -25,
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

                        }
                    );
                }

                function onError() {
                    if (shouldCallTimeout) {
                        shouldCallTimeout = false;
                        $ionicLoading.hide();
                        $cordovaDialogs.alert(MESSAGES.WIFI.SERVICE_FAILURE, 'Error', 'Ok')
                            .then(function () {
                                console.log(MESSAGES.WIFI.SERVICE_FAILURE);
                            });
                    }
                }

                function callAtTimeout() {
                    if (shouldCallTimeout) {
                        onError();
                    }
                }

                function onSSIDError() {
                    if (shouldCallTimeout) {
                        shouldCallTimeout = false;
                        $ionicLoading.hide();
                    }
                }

                function SSIDTimeout() {
                    if (shouldCallTimeout) {
                        onSSIDError();
                    }
                }


            }]);
})();
