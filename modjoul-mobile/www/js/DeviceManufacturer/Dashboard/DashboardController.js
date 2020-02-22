/* global angular */
/* global console */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
/* jshint shadow:true */
/* jshint loopfunc: true */

(function () {
    'use strict';
    angular.module('modjoul-mobile.controllers')
        .controller('DashboardCtrl', ['$scope', '$state', 'EmployeeManagementService', '$localStorage', '$ionicLoading', '$ionicModal', 'STRINGS',
            'OrgManagementService', '$cordovaDialogs', 'MESSAGES', 'DeviceManagementService','$ionicPopup',
            function ($scope, $state, EmployeeManagementService, $localStorage, $ionicLoading, $ionicModal, STRINGS, OrgManagementService,
                      $cordovaDialogs, MESSAGES, DeviceManagementService, $ionicPopup) {

                $scope.strings = STRINGS;

                $scope.doRefresh = function () {

                    $ionicLoading.show();

                    DeviceManagementService.getOrgDeviceStatistics("", true)
                        .then(function (result) {
                            $scope.orgDeviceStatistics = result.data;
                            console.log($scope.orgDeviceStatistics);
                            $ionicLoading.hide();

                        }, function (error) {
                            $scope.statsAvailable = false;
                            $ionicLoading.hide();
                            console.log(error);

                        });


                    OrgManagementService.getOrganizations(true)
                        .then(function (result) {
                            console.log(result);
                            $ionicLoading.hide();
                            $scope.orgs = result.data;

                            $scope.selectedOrg = {};
                            $scope.selectedOrg.orgId = "";

                            if ($scope.orgs.length > 0) {
                                $scope.selectedOrg.orgId = $scope.orgs[0].orgId;
                            }

                            $scope.loadOrgDetails($scope.selectedOrg.orgId);

                            $scope.$broadcast('scroll.refreshComplete');
                        }, function (error) {
                            $ionicLoading.hide();
                            console.log(error);
                        });
                };

                $scope.loadOrgDetails = function (orgId) {
                  $ionicLoading.show();

                    $scope.selectedOrgName = "";
                    $scope.orgId = orgId;
                    for (var i=0; i< $scope.orgs.length; i++)
                    {
                      var org = $scope.orgs[i];
                      if (org.orgId === orgId)
                      {
                        $scope.selectedOrgName = org.orgName ? org.orgName : org.name;
                      }
                    }

                    DeviceManagementService.getOrgDeviceStatistics(orgId)
                        .then(function (result) {
                            $scope.statsAvailable = true;
                            $scope.deviceStatistics = result.data;
                            $ionicLoading.hide();

                        }, function (error) {
                            $scope.statsAvailable = false;
                            $ionicLoading.hide();
                            console.log(error);

                        });
                };

                $scope.displayDetails = function (selectedOrg, deviceId) {

                    if (!selectedOrg || selectedOrg === "") {
                        $cordovaDialogs.alert('Oraganisation not selected', '', 'Ok')
                            .then(function () {
                                console.log("Oraganisation not selected");
                            });
                    }
                    else if (!deviceId || deviceId === "") {
                        $cordovaDialogs.alert('Device Serial Number not entered', '', 'Ok')
                            .then(function () {
                                console.log("Device Serial Number not entered");
                            });
                    }
                    else {
                        $ionicLoading.show();


                        var enteredDeviceId = deviceId || '';
                        $scope.orgId = selectedOrg;
                        DeviceManagementService.getDeviceDetails(enteredDeviceId)
                            .then(function (result) {
                                $ionicLoading.hide();
                                console.log(result);
                                $scope.deviceInfo = result.data;

                                var healthStatus = $scope.deviceInfo.lastHealthStatus;

                                if(healthStatus){
                                    $scope.healthStatusData = {
                                        // "Belt overall ": healthStatus.beltStatus,
                                        // "Altimeter ": healthStatus.altimeter,
                                        // "Humidity sensor ": healthStatus.humiditySensor,
                                        // "Temperature sensor ": healthStatus.temperatureSensor,
                                        "Pressure Sensor Front Left ": healthStatus.pressureFL,
                                        "Pressure Sensor Front Right ": healthStatus.pressureFR,
                                        "GPS ": healthStatus.gps,
                                        "Gyro Sensor": healthStatus.gyroFL,
                                        "Accelerometer": healthStatus.accelFL,
                                        "Magnetometer ": healthStatus.magneto,
                                        "Wifi signal strength": healthStatus.wifiSignalStrength + "%",
                                        "Battery charge status": healthStatus.batteryChargePercentage + "%",
                                        "Free memory available": healthStatus.freeMemory + "MB"
                                    };
                                }




                            }, function (error) {
                                $ionicLoading.hide();
                                console.log(error);

                                $cordovaDialogs.alert(MESSAGES.DEVICE_ID_NOT_FOUND, '', 'Ok')
                                    .then(function () {
                                        console.log(MESSAGES.DEVICE_ID_NOT_FOUND);
                                    });
                            });
                    }

                };


                $scope.getClassForHealth = function (val) {
                    if (val === "0") {
                        return "offer offer-danger";
                    } else if (val === "1") {
                        return "offer offer-success";
                    } else {
                        return "offer offer-info";
                    }
                };

                $scope.getTextForHealth = function (val) {
                    if (val === "0") {
                        return "Down";
                    } else if (val === "1") {
                        return "Up";
                    } else {
                        return val;
                    }
                };

                $scope.displayText = true;
                $scope.displayToken = false;
                $scope.toggleText = function () {
                    $scope.authToken = "";
//                    $scope.authToken = device.authToken;
                    $scope.displayText = false;
                    $scope.displayToken = true;
                };

                $scope.doRefresh($scope.orgId);

                $scope.$on("$ionicView.beforeEnter", function () {
                    $scope.$emit('navbarHideEvent', false);
                });


                $ionicModal.fromTemplateUrl('templates/device_manufacturer/add-device-form.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    $scope.modal = modal;
                });

                $scope.changeDeviceTypes = function (selectedOrg) {
                    var orgId = selectedOrg;
                    $scope.orgId = selectedOrg;

                    for (var i=0; i< $scope.orgs.length; i++)
                    {
                      var org = $scope.orgs[i];
                      if (org.orgId === orgId)
                      {
                        $scope.selectedOrgName = org.orgName ? org.orgName : org.name;
                      }
                    }

                    $ionicLoading.show();

                    DeviceManagementService.getDeviceTypes(orgId)
                        .then(function (result) {
                            $ionicLoading.hide();
                            console.log(result);
                            console.log(orgId);
                            $scope.deviceTypes = result.data;
                            console.log($scope.deviceTypes);
                        }, function (error) {
                            $ionicLoading.hide();
                            console.log(error);
                        });
                };

                $scope.openAddDevice = function () {
                    console.log("add device");
                    $scope.fields = [];

                    $scope.selectedDeviceType = {};
                    $scope.selectedDeviceType.deviceType = "";

                    $scope.newDeviceId = {};
                    $scope.newDeviceId.deviceId = "";

                    $scope.selectedOrg.orgId = $scope.orgId;
                    $scope.modal.show();
                    $scope.changeDeviceTypes($scope.orgId);

                };

                $scope.addField = function () {
                  console.log("Add field");
                  $scope.fields.push({});
                };

                $scope.removeField = function () {
                    console.log("Remove field");
                    var lastItem = $scope.fields.length - 1;
                    $scope.fields.splice(lastItem);
                };

                $scope.addDevice = function (deviceId, selectedDeviceType, selectedOrg, isMetadata) {
                    /*jshint maxcomplexity:30 */
                    if (!selectedOrg || selectedOrg === "") {
                        $cordovaDialogs.alert('Organization not selected', '', 'Ok')
                            .then(function () {
                                console.log("Organization not selected");
                            });
                    }
                    else if (!deviceId || deviceId === "") {
                        $cordovaDialogs.alert('Device Serial Number empty', '', 'Ok')
                            .then(function () {
                                console.log("Fields empty");
                            });
                    }
                    else if (selectedDeviceType === undefined || selectedDeviceType === "") {
                        $cordovaDialogs.alert('Device type not selected', '', 'Ok')
                            .then(function () {
                                console.log("Device Type not selected");
                            });
                    }
                    else {
                        var metadata = {};

                        if (isMetadata) {
                            if ($scope.fields.length !== 0) {

                                var isError = false;

                                console.log($scope.fields.length);

                                for (var i = 0; i < $scope.fields.length; i++) {
                                    if (!$scope.fields[i].key || !$scope.fields[i].value) {
                                        $cordovaDialogs.alert('Invalid metadata field(s)', '', 'Ok')
                                            .then(function () {
                                                console.log("Fields empty");
                                            });
                                        isError = true;
                                        break;
                                    }
                                    else {
                                        metadata[$scope.fields[i].key] = $scope.fields[i].value;
                                    }

                                }

                                if (isError) {
                                    return;
                                }

                            }
                        }

                        console.log(metadata);
                        var payload = {
                            deviceType: selectedDeviceType,
                            deviceId: deviceId,
                            metadata: metadata
                        };

                        console.log(payload);

                        $ionicLoading.show();

                        DeviceManagementService.createDevice(payload, selectedOrg)
                            .then(function () {
                                $ionicLoading.hide();

                                $cordovaDialogs.alert(MESSAGES.DEVICE_CREATED_MESSAGE, '', 'Ok')
                                    .then(function () {
                                        console.log(MESSAGES.DEVICE_CREATED_MESSAGE);
                                    });
                            }, function (error) {
                                $ionicLoading.hide();
                                $cordovaDialogs.alert(MESSAGES.DEVICE_FAILURE_MESSAGE, '', 'Ok')
                                    .then(function () {
                                        console.log(MESSAGES.DEVICE_FAILURE_MESSAGE);
                                    });
                                console.log(error);
                            });
                    }
                };


                $scope.generateId = function (selectedOrgId) {
                    $ionicLoading.show();

                    DeviceManagementService.generateSmartDeviceId(selectedOrgId, STRINGS.DEFAULT_DEVICE_TYPE)
                        .then(function (result) {
                            $ionicLoading.hide();
                            if (result.status === 200) {

                                console.log(result);
                                $scope.newDeviceId.deviceId = result.data.deviceId;
                            } else {
                                console.log("sorry");
                            }
                        }, function (error) {
                            $ionicLoading.hide();
                            console.log(error);
                        });
                };


              $scope.showAddDeviceTypePopup = function()
              {
                $scope.typeFields = [];
                $scope.deviceTypeName = {};
                $scope.deviceTypeName.name = "";

                var titleString = "<div class='shiftTime-Title'>Create new device type <br> </div>";

                $ionicPopup.show({
                  templateUrl: "templates/device_manufacturer/add-device-type-form.html",
                  scope: $scope,
                  title: titleString,
                  cssClass : 'addDeviceType-popup',
                  buttons: [
                    {
                      text: '<b>Cancel</b>',
                      type: 'button-positive-orange'
                    },
                    {
                      text: '<b>Add Device Type</b>',
                      type: 'button-positive-orange',
                      onTap: function() {
                        $scope.addDeviceType($scope.deviceTypeName.name, $scope.orgId);
                      }
                    }
                  ]
                });
              };

              $scope.addDeviceTypeField = function(){
                console.log("Add device field");
                $scope.typeFields.push({});
              };

              $scope.removeDeviceTypeField = function() {
                console.log("Remove device field");
                var lastItem = $scope.typeFields.length-1;
                $scope.typeFields.splice(lastItem);
              };

              $scope.addDeviceType = function(deviceTypeName,selectedOrg){

                if(!deviceTypeName || deviceTypeName === ""){
                  $cordovaDialogs.alert('Device Type name empty', '', 'Ok')
                    .then(function() {
                      console.log("Fields empty");
                    });
                }
                else if(!selectedOrg ||selectedOrg === ""){
                  $cordovaDialogs.alert('Oraganisation not selected', '', 'Ok')
                    .then(function() {

                    });
                }
                else{
                  var metadata = {};


                  if($scope.typeFields.length !== 0){

                    var isError = false;

                    console.log($scope.typeFields.length);

                    for(var i = 0; i< $scope.typeFields.length; i++){
                      if(!$scope.typeFields[i].key || !$scope.typeFields[i].value){
                        $cordovaDialogs.alert('Invalid metadata field(s)', '', 'Ok')
                          .then(function() {
                            console.log("Fields empty");
                          });
                        isError = true;
                        break;
                      }
                      else{
                        metadata[$scope.typeFields[i].key] = $scope.typeFields[i].value;

                      }

                    }

                    if(isError){
                      return;
                    }

                  }

                }
              };

                $scope.getOrgName = function (orgId) {
                    console.log(orgId);
                    if(orgId){

                        for(var i=0; i< $scope.orgs.length; i++){
                            if($scope.orgs[i].orgId == orgId){
                                return $scope.orgs[i].name ? $scope.orgs[i].name : $scope.orgs[i].orgName;
                            }
                        }
                        return "";
                    }
                    else {
                        return "";
                    }

                };


            }]);
})();
