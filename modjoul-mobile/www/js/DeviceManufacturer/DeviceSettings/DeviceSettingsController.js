/* global angular */
(function () {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('DeviceSettingsCtrl', ['$scope', '$ionicModal', '$cordovaDialogs', '$ionicLoading', 'WiFiHotspotService', '$state','$log',function ($scope,
                            $ionicModal, $cordovaDialogs, $ionicLoading,WiFiHotspotService, $state, $log) {

            $scope.$on("$ionicView.beforeEnter", function () {
                $scope.$emit('navbarHideEvent', true);
            });


            $scope.toggleGroup = function (group) {
                if ($scope.isGroupShown(group)) {
                    $scope.shownGroup = null;
                } else {
                    $scope.shownGroup = group;
                }

            };

            $scope.isGroupShown = function (group) {
                return $scope.shownGroup === group;
            };

            //Accelerometer sensors
            $scope.accelerometerLeftSensor = true;
            $scope.accelerometerRightSensor = true;
            $scope.accelerometerSideLeftSensor = true;
            $scope.accelerometerSideRightSensor = true;
            $scope.accelerometerBackLeftSensor = true;
            $scope.accelerometerBackRightSensor = true;


            $scope.altimeterSensor = true;

            $scope.GPSSensor = true;

            //Gyroscope sensors
            $scope.gyroscopeLeftSensor = true;
            $scope.gyroscopeRightSensor = true;
            $scope.gyroscopeSideLeftSensor = true;
            $scope.gyroscopeSideRightSensor = true;
            $scope.gyroscopeBackLeftSensor = true;
            $scope.gyroscopeBackRightSensor = true;

            $scope.magnetometerSensor = true;

            //Gyroscope sensors
            $scope.strainLeftSensor = true;
            $scope.strainRightSensor = true;
            $scope.strainSideLeftSensor = true;
            $scope.strainSideRightSensor = true;
            $scope.strainBackLeftSensor = true;
            $scope.strainBackRightSensor = true;

            if ($scope.accelerometerLeftSensor && $scope.accelerometerRightSensor && $scope.accelerometerSideLeftSensor &&
                $scope.accelerometerSideRightSensor && $scope.accelerometerBackLeftSensor && $scope.accelerometerBackRightSensor) {

                $scope.accelerometerStatus = true;
            }

            if ($scope.gyroscopeLeftSensor && $scope.gyroscopeRightSensor && $scope.gyroscopeSideLeftSensor &&
                $scope.gyroscopeSideRightSensor && $scope.gyroscopeBackLeftSensor && $scope.gyroscopeBackRightSensor) {

                $scope.gyroscopeStatus = true;
            }

            if ($scope.strainLeftSensor && $scope.strainRightSensor && $scope.strainSideLeftSensor &&
                $scope.strainSideRightSensor && $scope.strainBackLeftSensor && $scope.strainBackRightSensor) {

                $scope.strainStatus = true;
            }

            $scope.wifiStatus = false;

            $scope.setupWiFiWizard = function () {
                if ($scope.wifiStatus === false) {
                    $scope.switchOnBelt = true;
                    $scope.connectBelt = false;
                    $scope.wifiConfigDetails = false;
                    $scope.modal.show();
                }
                else {
                    $scope.wifiStatus = false;
                }

            };

            $scope.navigateToTestScreen = function () {
                $state.go("employee.test");

            };

            /*$scope.contacts = [
             { name: 'Gordon Freeman' },
             { name: 'Barney Calhoun' },
             { name: 'Lamarr the Headcrab' },
             ];*/


            $ionicModal.fromTemplateUrl('templates/config-wifi-modal.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.configureWifiSettings = function () {

                if ($scope.switchOnBelt) {
                    $scope.switchOnBelt = false;
                    $scope.connectBelt = true;
                    $scope.wifiConfigDetails = false;
                }
                else if ($scope.connectBelt) {
                    $scope.switchOnBelt = false;
                    $scope.connectBelt = false;
                    $scope.wifiConfigDetails = true;
                }
                $scope.wifiStatus = false;
            };

            $scope.configureWifi = function (wifiDetails) {

                if (!wifiDetails) {
                    $cordovaDialogs.alert("Please fill the wifi details", 'Error', 'Ok')
                        .then(function () {
                            $log.debug("Please fill the wifi details");
                        });
                }
                else if (!wifiDetails.ssid || wifiDetails.ssid === "") {
                    $cordovaDialogs.alert("Please fill the SSID", 'Error', 'Ok')
                        .then(function () {
                            $log.debug("Please fill the wifi details");
                        });
                }
                else if (!wifiDetails.password || wifiDetails.ssid === "") {
                    $cordovaDialogs.alert("Please fill the password", 'Error', 'Ok')
                        .then(function () {
                            $log.debug("Please fill the wifi details");
                        });
                }
                else if (!wifiDetails.securityType || wifiDetails.securityType === "") {
                    $cordovaDialogs.alert("Please select the security type", 'Error', 'Ok')
                        .then(function () {
                            $log.debug("Please fill the wifi details");
                        });
                }
                else {
                    $ionicLoading.show();

                    WiFiHotspotService.postWifiDetails(wifiDetails.ssid, wifiDetails.password, wifiDetails.securityType).then(function (result) {

                        $ionicLoading.hide();
                        if (result.status === 200) {
                            $scope.switchOnBelt = true;
                            $scope.connectBelt = false;
                            $scope.wifiConfigDetails = false;
                            $scope.modal.hide();
                            $cordovaDialogs.alert("Successfully configured", 'Success', 'Ok')
                                .then(function () {
                                    $log.debug("Successfully configured");
                                });
                            $scope.wifiStatus = true;
                        }
                    }, function () {
                        $ionicLoading.hide();
                        $scope.wifiStatus = true;
                        $cordovaDialogs.alert("Failed to configure. Please try again.", 'Error', 'Ok')
                            .then(function () {
                                $log.debug("Failed to configure. Please try again.");
                            });
                    });

                }
            };


        }]);
})();
