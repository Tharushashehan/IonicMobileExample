/* global angular */
/* global console */
/* global moment */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

(function () {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('OrgAdminDeviceCtrl', ['$scope', '$state', '$localStorage', '$ionicLoading', 'STRINGS',
            'OrgManagementService', '$cordovaDialogs', 'MESSAGES', 'DeviceManagementService', '$ionicListDelegate',
            function ($scope, $state, $localStorage, $ionicLoading, STRINGS, OrgManagementService, $cordovaDialogs, MESSAGES,
                      DeviceManagementService, $ionicListDelegate) {

                $scope.$on("$ionicView.beforeEnter", function () {
                    $scope.$emit('navbarHideEvent', false);
                });

                var orgId = $localStorage.orgId;
                $scope.listCanSwipe = true;

                $scope.messages = MESSAGES;
                $scope.doRefresh = function () {

                    $ionicLoading.show();

                    // DeviceManagementService.getOrgDevicesForStage(orgId, "pre-delivery")
                    DeviceManagementService.getDevices(orgId)
                        .then(function (result) {
                            $ionicLoading.hide();
                            $scope.$broadcast('scroll.refreshComplete');

                            $scope.devices = result.data.devices;
                            console.log($scope.devices);

                        }, function (error) {
                            $ionicLoading.hide();
                            $scope.$broadcast('scroll.refreshComplete');
                            console.log(error);
                        });

                };

                function activateDevice(device) {

                    var deviceId = device.deviceId;
                    console.log(deviceId);

                    $ionicLoading.show();

                    OrgManagementService.activateDevice(orgId, STRINGS.DEFAULT_DEVICE_TYPE, {'deviceId': deviceId})
                        .then(function (result) {
                            $ionicLoading.hide();
                            if (result.status === 200) {
                                console.log(result);
                                console.log(orgId);
                                $cordovaDialogs.alert('Successfully activated', 'Success', 'Ok')
                                    .then(function () {
                                        console.log("Successfully activated");
                                    });
                            }
                        }, function (error) {
                            $ionicLoading.hide();

                            $cordovaDialogs.alert('Failed to activate. Please try again.', 'Error', 'Ok')
                                .then(function () {
                                    console.log("Failed to activate. Please try again.");
                                });
                            console.log(error);
                        });
                }

                $scope.ConfirmActivation = function (device) {
                    console.log(device);

                    $cordovaDialogs.confirm('Are you sure you want to receive this device?', ['Ok', 'Cancel'])
                        .then(function (buttonIndex) {

                            // var btnIndex = buttonIndex;

                            if (buttonIndex === 1) {
                                activateDevice(device);
                            }
                            else {
                                console.log('You are not sure');
                            }
                            $ionicListDelegate.closeOptionButtons();

                        });
                };

              function deleteDevice(device) {

                var deviceId = device.deviceId;
                console.log(deviceId);

                $ionicLoading.show();

                OrgManagementService.deleteDevice(deviceId, 'smart', orgId)
                  .then(function (result) {
                    $ionicLoading.hide();
                    if (result.status === 200) {
                      console.log(result);
                      console.log(orgId);
                      $cordovaDialogs.alert('Successfully deleted', 'Success', 'Ok')
                        .then(function () {
                          console.log("Successfully deleted");
                        });
                    }
                  }, function (error) {
                    $ionicLoading.hide();

                    $cordovaDialogs.alert('Failed to delete this device. Please try again.', 'Error', 'Ok')
                      .then(function () {
                        console.log("Failed to delete. Please try again.");
                      });
                    console.log(error);
                  });
              }

                $scope.confirmDeletion = function (device) {
                  console.log(device);

                  $cordovaDialogs.confirm('Are you sure you want to delete this device?', ['Ok', 'Cancel'])
                    .then(function (buttonIndex) {

                      // var btnIndex = buttonIndex;

                      if (buttonIndex === 1) {
                        deleteDevice(device);
                      }
                      else {
                        console.log('You are not sure');
                      }

                      $ionicListDelegate.closeOptionButtons();

                    });
                };

              $scope.searchQuery = {};

              var match = function (item, val) {
                var regex = new RegExp(val, 'i');
                return item.deviceId.toString().search(regex) === 0 ||
                  moment(item.registration.date).format("YYYY-MM-DD hh:mm:ss").toString().search(regex) === 0 || item.authToken.toString().search(regex) === 0;
              };

              $scope.filterDevice = function(device)
              {

                if (!$scope.searchQuery || !$scope.searchQuery.query) {
                  return true;
                }

                var matched = true;
                var q = $scope.searchQuery.query;

                q.split(' ').forEach(function(token) {
                  matched = matched && match(device, token);
                });
                return matched;
              };

                $scope.doRefresh();


            }]);
})();
