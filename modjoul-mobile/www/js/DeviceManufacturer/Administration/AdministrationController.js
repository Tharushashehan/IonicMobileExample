/* global angular */
/* global console */
/* global moment */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

(function () {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('AdminController', ['$scope', '$state', 'EmployeeManagementService', '$localStorage', '$ionicLoading',
            '$ionicModal', 'STRINGS', 'OrgManagementService', '$cordovaDialogs', 'MESSAGES', 'DeviceManagementService',
            function ($scope, $state, EmployeeManagementService, $localStorage, $ionicLoading, $ionicModal, STRINGS,
                      OrgManagementService, $cordovaDialogs, MESSAGES, DeviceManagementService) {

                $scope.devices = [];
                $scope.isMetadata = false;

                var limit = 50;
                $scope.pageNumber = 0;
                // $scope.moreDataCanBeLoaded = false;

                $scope.doRefresh = function () {

                    $scope.strings = STRINGS;

                    $scope.shouldShowDelete = true;
                    $scope.listCanSwipe = true;


                    $ionicLoading.show();

                    OrgManagementService.getOrganizations(true)
                        .then(function (result) {
                            console.log(result);
                            $ionicLoading.hide();
                            $scope.orgs = result.data;
                            $scope.$broadcast('scroll.refreshComplete');
                        }, function (error) {
                            $scope.$broadcast('scroll.refreshComplete');
                            $ionicLoading.hide();
                            console.log(error);
                        });
                };

                $scope.doRefresh($scope.orgId);


                $scope.getDevices = function (selectedOrg) {
                    var pageNumber = $scope.pageNumber;
                    if (typeof selectedOrg !== 'object') {
                        selectedOrg = JSON.parse(selectedOrg);
                    }

                    $scope.setOrg = selectedOrg;
                    var orgId = selectedOrg.orgId;
                    $scope.orgId = orgId;


                    console.log("Page Number");
                    console.log(pageNumber);

                    DeviceManagementService.getAllDevicesForOrganization({page: pageNumber, limit: limit},
                        orgId)
                        .then(function (result) {
                            $ionicLoading.hide();

                            console.log(result);
                            if(result.data.devices && result.data.devices.length === 0){
                                $scope.moreDataCanBeLoaded = false;
                            }

                            $scope.devices = $scope.devices.concat(result.data.devices);


                            $scope.$broadcast('scroll.refreshComplete');
                            $scope.$broadcast('scroll.infiniteScrollComplete');

                        }, function (error) {
                            $scope.$broadcast('scroll.refreshComplete');
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            $ionicLoading.hide();
                            console.log(error);
                        });
                };

                $scope.selectOrgForDevices = function(selectedOrg){
                    $scope.devices = [];
                    $scope.moreDataCanBeLoaded = true;
                    $scope.selectedOrg = selectedOrg;
                    $scope.pageNumber = 1;
                    $scope.getDevices(selectedOrg);
                };

                $scope.getMoreDevices = function () {
                    $scope.pageNumber = $scope.pageNumber + 1;
                    $scope.getDevices($scope.selectedOrg);
                };

                function suspendAllDevices() {
                    var orgId = $scope.orgId;

                    $ionicLoading.show();
                    DeviceManagementService.subscription(orgId,null,true)
                        .then(function (result) {

                            $ionicLoading.hide();

                            if (result.status === 200) {

                                $scope.devices = [];
                                $scope.getDevices($scope.setOrg);
                            } else {
                                console.log("sorry");
                            }
                        }, function (error) {
                            $ionicLoading.hide();
                            console.log(error);
                        });
                }

                $scope.ConfirmSuspendAll = function () {
                    $cordovaDialogs.confirm('Are you sure you want to suspend all the devices?', ['Ok', 'Cancel'])
                        .then(function (buttonIndex) {

                            if (buttonIndex === 1) {
                                suspendAllDevices();
                            }
                            else {
                                console.log('You are not sure');
                            }
                        });
                };

                $scope.confirmReboot = function (device) {

                    $cordovaDialogs.confirm('Are you sure you want to reboot device ' + device.deviceId + '?', ['Ok', 'Cancel'])
                        .then(function (buttonIndex) {

                            if (buttonIndex === 1) {

                                $ionicLoading.show();

                                DeviceManagementService.rebootDevice(device.deviceId)
                                    .then(function (result) {
                                        $ionicLoading.hide();
                                        if (result.status === 200) {

                                            showToast("Reboot command queued successfully");

                                        } else {
                                            console.log("sorry");
                                        }
                                    }, function (error) {
                                        $ionicLoading.hide();
                                        console.log(error);
                                    });
                            }
                        });
                };

                function suspendDevice(device) {

                    var orgId = $scope.orgId;
                    var deviceId = device.deviceId;
                    console.log(deviceId);

                    $ionicLoading.show();

                    DeviceManagementService.subscription(null,deviceId,true)
                        .then(function (result) {
                            $ionicLoading.hide();
                            if (result.status === 200) {

                                $scope.devices = [];
                                $scope.getDevices($scope.setOrg);
                            } else {
                                console.log("sorry");
                            }
                        }, function (error) {
                            $ionicLoading.hide();
                            console.log(error);
                        });
                }

                $scope.ConfirmSuspend = function (device) {
                    console.log(device);

                    $cordovaDialogs.confirm('Are you sure you want to suspend this device?', ['Ok', 'Cancel'])
                        .then(function (buttonIndex) {

                            if (buttonIndex === 1) {
                                suspendDevice(device);
                            }
                            else {
                                console.log('You are not sure');
                            }
                        });
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

                function activateDevice(device) {
                    console.log('You are sure');
                    var orgId = $scope.orgId;
                    var deviceId = device.deviceId;
                    console.log(deviceId);

                    $ionicLoading.show();
                    DeviceManagementService.subscription(null,deviceId,false)
                        .then(function (result) {
                            $ionicLoading.hide();
                            if (result.status === 200) {

                                $scope.devices = [];
                                $scope.getDevices($scope.setOrg);
                            } else {
                                console.log("sorry");
                            }
                        }, function (error) {
                            $ionicLoading.hide();
                            console.log(error);
                        });
                }

                $scope.ConfirmActivation = function (device) {

                    $cordovaDialogs.confirm('Are you sure you want to activate this device?', ['Ok', 'Cancel'])
                        .then(function (buttonIndex) {

                            if (buttonIndex === 1) {
                                activateDevice(device);
                            }
                            else {
                                console.log('You are not sure');
                            }
                        });
                };

                function activateAllDevices() {

                    console.log('You are sure');
                    var orgId = $scope.orgId;

                    $ionicLoading.show();

                    DeviceManagementService.subscription(orgId,null,false)
                        .then(function (result) {
                            $ionicLoading.hide();
                            if (result.status === 200) {

                                $scope.devices = [];
                                $scope.getDevices($scope.setOrg);

                            } else {
                                console.log("sorry");
                            }
                        }, function (error) {
                            $ionicLoading.hide();
                            console.log(error);
                        });
                }

                $scope.ConfirmActivationAll = function () {
                    $cordovaDialogs.confirm('Are you sure you want to activate all the devices?', ['Ok', 'Cancel'])
                        .then(function (buttonIndex) {

                            if (buttonIndex === 1) {
                                activateAllDevices();
                            }
                            else {
                                console.log('You are not sure');
                            }
                        });
                };


                $scope.$on("$ionicView.beforeEnter", function () {
                    $scope.$emit('navbarHideEvent', false);
                });

                $scope.searchQuery = {};

                var match = function (item, val) {
                    var regex = new RegExp(val, 'i');
                    return item.deviceId.toString().search(regex) === 0 ||
                        moment(item.registration.date).format("YYYY-MM-DD hh:mm:ss").toString().search(regex) === 0 || item.authToken.toString().search(regex) === 0;
                };

                $scope.filterDevice = function (device) {

                    if (!$scope.searchQuery || !$scope.searchQuery.query) {
                        return true;
                    }

                    var matched = true;
                    var q = $scope.searchQuery.query;

                    q.split(' ').forEach(function (token) {
                        matched = matched && match(device, token);
                    });
                    return matched;
                };


            }]);
})();
