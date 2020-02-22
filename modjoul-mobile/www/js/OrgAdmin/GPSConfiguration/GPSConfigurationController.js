/* global angular */
/* global console */
/* global moment */
/* global window */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

(function () {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('GPSConfigurationCtrl', ['$scope', '$state', 'EmployeeManagementService', '$localStorage', '$ionicLoading',
            '$ionicModal', 'STRINGS', 'OrgManagementService', '$cordovaDialogs', 'MESSAGES', 'DeviceManagementService',
            'GPSConfigurationService',
            function ($scope, $state, EmployeeManagementService, $localStorage, $ionicLoading, $ionicModal, STRINGS,
                      OrgManagementService, $cordovaDialogs, MESSAGES, DeviceManagementService, GPSConfigurationService) {

                $scope.devices = [];
                $scope.isMetadata = false;

                var orgId = $localStorage.orgId;

                var limit = 50;
                $scope.pageNumber = 0;
                // $scope.moreDataCanBeLoaded = false;


                $scope.getDevices = function () {

                    var pageNumber = $scope.pageNumber;

                    $scope.hasActives = false;
                    $scope.hasSuspends = false;

                    console.log("Page Number");
                    console.log(pageNumber);

                    $ionicLoading.show();

                    DeviceManagementService.getAllDevicesForOrganization({page: pageNumber, limit: limit},
                        orgId)
                        .then(function (result) {

                            $ionicLoading.hide();

                            console.log(result);
                            if(result.data.devices && result.data.devices.length === 0){
                                $scope.moreDataCanBeLoaded = false;
                            }

                            $scope.devices = $scope.devices.concat(result.data.devices);

                            for (var i = 0; i < $scope.devices.length; i++) {
                                var device = $scope.devices[i];
                                if (device.isSuspend) {
                                    $scope.hasSuspends = true;
                                }
                                else {
                                    $scope.hasActives = true;
                                }

                                if ($scope.hasActives === true && $scope.hasSuspends === true) {
                                    break;
                                }
                            }

                            $scope.$broadcast('scroll.refreshComplete');
                            $scope.$broadcast('scroll.infiniteScrollComplete');

                        }, function (error) {
                            $scope.$broadcast('scroll.refreshComplete');
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            $ionicLoading.hide();
                            console.log(error);
                        });
                };



                $scope.doRefresh = function () {

                    $scope.strings = STRINGS;

                    $scope.shouldShowDelete = true;
                    $scope.listCanSwipe = true;


                    $scope.getDevices();

                };

                $scope.doRefresh();


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


                $scope.changeOrgGPSStatus = function (gpsStatus) {

                    var param = {
                        "status": true
                    };

                    if (gpsStatus === 'on') {
                        param = {
                            "status": true
                        };
                    }
                    else {
                        param = {
                            "status": false
                        };
                    }

                    $ionicLoading.show();

                    GPSConfigurationService.setOrgGPS(param, orgId)
                        .then(function (result) {
                            $ionicLoading.hide();
                            showToast("Successfully issued Command to switch " + gpsStatus + " GPS");
                            console.log(result.data);
                        }, function (error) {
                            $ionicLoading.hide();
                            console.log(error);
                        });
                };


                $scope.changeDeviceGPSStatus = function (gpsStatus, deviceId) {

                    var param = {
                        "status": true
                    };

                    if (gpsStatus === 'on') {
                        param = {
                            "status": true
                        };
                    }
                    else {
                        param = {
                            "status": false
                        };
                    }

                    $ionicLoading.show();

                    GPSConfigurationService.setDeviceGPS(param, deviceId)
                        .then(function (result) {
                            $ionicLoading.hide();
                            showToast("Successfully issued Command to switch " + gpsStatus + " GPS");

                        }, function (error) {
                            $ionicLoading.hide();
                            console.log(error);
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
