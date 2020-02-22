/* global angular */
/* global console */
/* global window */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
/* jshint sub:true */

(function () {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('DeviceCtrl', ['$scope', '$ionicModal', '$cordovaDialogs', '$ionicLoading', 'WiFiHotspotService',
            '$state', '$localStorage', 'UserDeviceManagementService', '$timeout', 'MESSAGES', 'SENSOR_STRINGS', 'STRINGS',
            function ($scope, $ionicModal, $cordovaDialogs, $ionicLoading, WiFiHotspotService, $state, $localStorage,
                      UserDeviceManagementService, $timeout, MESSAGES, SENSOR_STRINGS, STRINGS) {

                $scope.ssidTimeoutValue = 10000;

                $scope.timeoutValue = 20000;

                $scope.factoryResetButtonText = "Firmware Reset";
                $scope.infoText = "reset firmware";
                $scope.strings = STRINGS;

                $scope.sensorKeys = SENSOR_STRINGS.SENSOR_KEYS;
                $scope.sensorTitles = SENSOR_STRINGS.SENSOR_TITLES;


                var orgId = $localStorage.orgId;
                var userId = $localStorage.userId;

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


                $scope.onRefresh = function () {

                    $ionicLoading.show();

                    UserDeviceManagementService.getAssignedDevice(orgId, userId)
                        .then(function (result) {
                            console.log(result);

                            if (result.status === 200) {
                                var deviceId = result.data.deviceId;
                                UserDeviceManagementService.getDeviceDetails(deviceId)
                                    .then(function (result) {

                                        $ionicLoading.hide();
                                        $scope.$broadcast('scroll.refreshComplete');

                                        $scope.deviceDetails = result.data;
                                        console.log($scope.deviceDetails);
                                        $scope.deviceSensors = result.data.lastHealthStatus;
                                        console.log($scope.deviceSensors);

                                        $scope.batteryImage = "img/icons/battery-green.png";
                                        $scope.wifiImage = "img/icons/wifi-blue.png";
                                        $scope.sdcardImage = "img/icons/sdcard-green.png";
                                        $scope.gpsImage = "img/icons/gps-green.png";
                                        $scope.rtcImage = "img/icons/rtc-green.png";
                                        $scope.sensorsImage = "img/icons/sesnors-green.png";

                                        if(!$scope.deviceSensors){
                                            $scope.healthAvailable = false;
                                        }
                                        else{
                                            $scope.healthAvailable = true;
                                            $scope.timestamp = $scope.deviceDetails.lastHealthReportedTimestamp;

                                            if($scope.deviceSensors[STRINGS.BELT_SENSORS.ACTUAL.batteryChargePercentage] <= 100 && $scope.deviceSensors[STRINGS.BELT_SENSORS.ACTUAL.batteryChargePercentage] >= 60){
                                                $scope.batteryImage = "img/icons/battery-green.png";
                                            }
                                            else if($scope.deviceSensors[STRINGS.BELT_SENSORS.ACTUAL.batteryChargePercentage] < 60 && $scope.deviceSensors[STRINGS.BELT_SENSORS.ACTUAL.batteryChargePercentage] >= 20){
                                                $scope.batteryImage = "img/icons/battery-amber.png";
                                            }
                                            else if($scope.deviceSensors[STRINGS.BELT_SENSORS.ACTUAL.batteryChargePercentage] < 20){
                                                $scope.batteryImage = "img/icons/battery-red.png";
                                            }
                                            else{
                                                $scope.batteryImage = "img/icons/battery-green.png";
                                            }

                                            if($scope.deviceSensors[STRINGS.BELT_SENSORS.ACTUAL.wifiSignalStrength] <= 100 && $scope.deviceSensors[STRINGS.BELT_SENSORS.ACTUAL.wifiSignalStrength] >= 75){
                                                $scope.wifiImage = "img/icons/wifi-blue.png";
                                            }
                                            else if($scope.deviceSensors[STRINGS.BELT_SENSORS.ACTUAL.wifiSignalStrength] < 75 && $scope.deviceSensors[STRINGS.BELT_SENSORS.ACTUAL.wifiSignalStrength] >= 50){
                                                $scope.wifiImage = "img/icons/wifi-green.png";
                                            }
                                            else if($scope.deviceSensors[STRINGS.BELT_SENSORS.ACTUAL.wifiSignalStrength] < 50 && $scope.deviceSensors[STRINGS.BELT_SENSORS.ACTUAL.wifiSignalStrength] >= 30){
                                                $scope.wifiImage = "img/icons/wifi-amber.png";
                                            }
                                            else if($scope.deviceSensors[STRINGS.BELT_SENSORS.ACTUAL.wifiSignalStrength] < 30){
                                                $scope.wifiImage = "img/icons/wifi-red.png";
                                            }
                                            else{
                                                $scope.wifiImage = "img/icons/wifi-blue.png";
                                            }



                                            //Device health Version 1
                                            if($scope.deviceSensors.rtcHealth == 1){
                                                $scope.rtcImage = "img/icons/rtc-green.png";
                                            }
                                            else{
                                                $scope.rtcImage = "img/icons/rtc-red.png";
                                            }

                                            if($scope.deviceSensors.version == "v1"){
                                                if($scope.deviceSensors.gps == 1){
                                                    $scope.gpsImage = "img/icons/gps-green.png";
                                                }
                                                else{
                                                    $scope.gpsImage = "img/icons/gps-red.png";
                                                }

                                                if($scope.deviceSensors.accelFrontLeft == 1 &&
                                                    $scope.deviceSensors.accelFrontRight == 1 &&
                                                    $scope.deviceSensors.altimeter == 1 &&
                                                    $scope.deviceSensors.gyroFrontLeft == 1 &&
                                                    $scope.deviceSensors.gyroFrontRight == 1 &&
                                                    $scope.deviceSensors.magnetometer == 1 &&
                                                    $scope.deviceSensors.pressureBackLeft == 1 &&
                                                    $scope.deviceSensors.pressureBackRight == 1 &&
                                                    $scope.deviceSensors.pressureFrontLeft == 1 &&
                                                    $scope.deviceSensors.pressureFrontRight == 1
                                                ){
                                                    $scope.sensorsImage = "img/icons/sensors-green.png";
                                                }
                                                else{
                                                    $scope.sensorsImage = "img/icons/sensors-red.png";
                                                }

                                                if($scope.deviceSensors.sdCardHealth == 1){
                                                    $scope.sdcardImage = "img/icons/sdcard-green.png";
                                                }
                                                else{
                                                    $scope.sdcardImage = "img/icons/sdcard-red.png";
                                                }

                                                $scope.sdcardMessage = "SD Card";

                                            }

                                            //Device health Version 2
                                            else if($scope.deviceSensors.version == "v2"){

                                                if($scope.deviceSensors.gpsOnOff == 1){
                                                    $scope.gpsImage = "img/icons/gps-green.png";
                                                }
                                                else{
                                                    $scope.gpsImage = "img/icons/gps-red.png";
                                                }


                                                if($scope.deviceSensors.accelFL == 1 &&
                                                    $scope.deviceSensors.altimeterTemperatureHumidity == 1 &&
                                                    $scope.deviceSensors.gyroFL == 1 &&
                                                    $scope.deviceSensors.magneto == 1 &&
                                                    $scope.deviceSensors.coinCell == 1 &&
                                                    $scope.deviceSensors.pressureFL == 1 &&
                                                    $scope.deviceSensors.pressureFR == 1
                                                ){
                                                    $scope.sensorsImage = "img/icons/sensors-green.png";
                                                }
                                                else{
                                                    $scope.sensorsImage = "img/icons/sensors-red.png";
                                                }


                                                $scope.firmwareVersion = $scope.deviceSensors.firmware;
                                                $scope.subscription = $scope.deviceSensors.subscription == 1 ? 'Paid' : 'Unpaid';

                                                if($scope.deviceSensors.sdCardHealth == 1){

                                                    if($scope.deviceSensors.sdCardMemory == 100){
                                                        $scope.sdcardImage = "img/icons/sdcard-red.png";
                                                        $scope.sdcardMessage = "SD Card Memory Full " + $scope.deviceSensors.sdCardMemory + "%";
                                                    }
                                                    else if($scope.deviceSensors.sdCardMemory < 100 && $scope.deviceSensors.sdCardMemory >= 90){
                                                        $scope.sdcardImage = "img/icons/sd-card-red.png";
                                                        $scope.sdcardMessage = "SD Card Memory " + $scope.deviceSensors.sdCardMemory + "%";
                                                    }
                                                    else if($scope.deviceSensors.sdCardMemory < 90 && $scope.deviceSensors.sdCardMemory >= 50){
                                                        $scope.sdcardImage = "img/icons/sd-card-amber.png";
                                                        $scope.sdcardMessage = "SD Card Memory " + $scope.deviceSensors.sdCardMemory + "%";
                                                    }
                                                    else if($scope.deviceSensors.sdCardMemory < 50 && $scope.deviceSensors.sdCardMemory >= 0){
                                                        $scope.sdcardImage = "img/icons/sd-card-green.png";
                                                        $scope.sdcardMessage = "SD Card Memory " + $scope.deviceSensors.sdCardMemory + "%";
                                                    }
                                                    else {
                                                        $scope.sdcardImage = "img/icons/sdcard-red.png";
                                                        $scope.sdcardMessage = "SD Card Error";
                                                    }
                                                }
                                            else{
                                                    $scope.sdcardImage = "img/icons/sdcard-red.png";
                                                    $scope.sdcardMessage = "SD Card Error";
                                                }
                                            }

                                        }


                                    }, function (error) {
                                        console.log(error);
                                        $ionicLoading.hide();
                                        $scope.$broadcast('scroll.refreshComplete');
                                    });

                            }
                            else {

                                $ionicLoading.hide();
                                $scope.$broadcast('scroll.refreshComplete');
                            }

                        }, function (error) {
                            $ionicLoading.hide();
                            $scope.$broadcast('scroll.refreshComplete');
                            console.log(error);
                        });
                };


                $scope.setupWiFiWizard = function () {

                    $scope.wifiPort = {securityType: "WPA2"};

                    $ionicModal.fromTemplateUrl('templates/config-wifi-modal.html', {
                        scope: $scope
                    }).then(function (modal) {
                        $scope.modal = modal;
                    });

                    $ionicLoading.show();

                    UserDeviceManagementService.getAssignedDevice(orgId, userId)
                        .then(function (result) {
                            console.log(result);
                            $ionicLoading.hide();

                            $scope.deviceInfo = result.data;

                            if ($scope.deviceInfo) {
                                $scope.switchOnBelt = true;
                                $scope.connectBelt = false;
                                $scope.beltConfigOptions = false;
                                $scope.wifiConfigDetails = false;
                                $scope.notificationScreen = false;
                                $scope.modal.show();
                            }
                            else {
                                $cordovaDialogs.alert("Belt not assigned yet", 'Error', 'Ok')
                                    .then(function () {
                                        console.log("Belt not assigned yet");
                                    });
                            }

                            $scope.$broadcast('scroll.refreshComplete');
                        }, function (error) {
                            $ionicLoading.hide();
                            $scope.$broadcast('scroll.refreshComplete');
                            console.log(error);
                        });


                };

                $scope.wizardFirstScreen = function(){
                    $scope.switchOnBelt = true;
                    $scope.connectBelt = false;
                    $scope.beltConfigOptions = false;
                    $scope.wifiConfigDetails = false;
                    $scope.notificationScreen = false;
                };

                $scope.wizardSecondScreen = function(){
                    $scope.switchOnBelt = false;
                    $scope.connectBelt = true;
                    $scope.beltConfigOptions = false;
                    $scope.wifiConfigDetails = false;
                    $scope.notificationScreen = false;
                };

                $scope.wizardThirdScreen = function(){
                    $scope.wifiPort = {securityType: "WPA2"};
                    $scope.switchOnBelt = false;
                    $scope.connectBelt = false;
                    $scope.beltConfigOptions = true;
                    $scope.wifiConfigDetails = false;
                    $scope.notificationScreen = false;
                };


                $scope.configureWifiSettings = function () {

                    $scope.wifiPort = {securityType: "WPA2"};
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
                            console.log('ssid response', result.data);
                            var ssids = result.data.split(",");
                            var ssidList = [];
                            ssids.forEach(function(ssid){
                                if(ssid != ''){
                                    ssidList.push(ssid);
                                }
                            });

                            $scope.ssids = ssidList;

                            console.log($scope.ssids);

                        }
                        else {
                            $scope.isBeltAvailable = false;
                        }

                    }, function () {
                        onSSIDError();
                    });
                };

                $scope.factoryReset = function(){

                    shouldCallTimeout = true;
                    $timeout(SSIDTimeout, $scope.ssidTimeoutValue);

                    WiFiHotspotService.factoryResetEmployee().then(function (result) {

                        shouldCallTimeout = false;
                        $ionicLoading.hide();
                        if (result.status === 200) {
                            $scope.modal.remove();
                            showToast("Firmware Reset issued");
                        }

                    }, function () {
                        showToast("Failed to issue Firmware Reset");
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
                        function () {

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

                $scope.onRefresh();
            }]);
})();
