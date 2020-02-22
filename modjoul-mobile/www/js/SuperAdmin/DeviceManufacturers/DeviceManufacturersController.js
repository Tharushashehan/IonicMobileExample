/* global angular */
/* global console */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
(function () {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('DeviceManufacturersController', ['$scope', '$state', 'UsersService', '$localStorage', '$ionicLoading',
            '$ionicModal', '$cordovaDialogs', 'MESSAGES', '$ionicListDelegate',
          function ($scope, $state, UsersService, $localStorage, $ionicLoading, $ionicModal, $cordovaDialogs, MESSAGES, $ionicListDelegate) {

                var orgId = $localStorage.orgId;

                $scope.listCanSwipe = true;

                $scope.doRefresh = function() {
                  $ionicLoading.show();

                  UsersService.getUsers({role: "device_manufacturer"}, orgId)
                    .then(function (result) {
                      console.log(result);
                      $scope.deviceManufacturers = result.data.users;
                      $ionicLoading.hide();
                      $scope.$broadcast('scroll.refreshComplete');

                    }, function (error) {
                      $ionicLoading.hide();
                      $scope.$broadcast('scroll.refreshComplete');
                      console.log(error);
                    });
                };

                $scope.openAddDeviceManufacturer = function () {
                    console.log("add device manufacturer");
                    $ionicModal.fromTemplateUrl('templates/add-device-manufacturer-form.html', {
                        scope: $scope,
                        animation: 'slide-in-up'
                    }).then(function (modal) {
                        $scope.modal = modal;
                        $scope.modal.show();
                    });

                };

                $scope.addDeviceManufacturer = function (email, firstName, lastName) {
                    var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    if (!email  || email === "" || !firstName  || firstName === "" || !lastName  || lastName === "") {
                        $cordovaDialogs.alert('Fields empty', '', 'Ok')
                            .then(function () {
                                console.log("Fields empty");
                            });
                    } else if (!pattern.test(email)) {
                        $cordovaDialogs.alert('Invalid email address', '', 'Ok')
                            .then(function () {
                                console.log("Invalid email address");
                            });
                    }

                    else {
                        console.log(email);
                        $ionicLoading.show();

                        UsersService.createUser({
                            firstName: firstName,
                            lastName: lastName,
                            email: email,
                            role: 'device_manufacturer',
                            job: "Device Manufacturer",
                            orgId: orgId
                        }).then(function (result) {
                            $ionicLoading.hide();
                            console.log(result);
                            if (result.status === 201) {
                                $scope.clearFields();
                                $cordovaDialogs.alert(MESSAGES.DEVICE_MANUFACTURER_CREATED_MESSAGE, '', 'Ok')
                                    .then(function () {
                                        console.log(MESSAGES.DEVICE_MANUFACTURER_CREATED_MESSAGE);
                                    });
                                $scope.modal.remove();
                                $scope.doRefresh();
                            }
                        }, function (error) {
                            $ionicLoading.hide();
                            $cordovaDialogs.alert(MESSAGES.DEVICE_MANUFACTURER_FAILURE_MESSAGE, '', 'Ok')
                                .then(function () {
                                    console.log(MESSAGES.DEVICE_MANUFACTURER_FAILURE_MESSAGE);
                                });
                            console.log(error);
                        });

                    }
                };

              $scope.showDeleteConfirmation = function(user)
              {
                $cordovaDialogs.confirm('Are you sure you want to delete this manufacturer?', ['Ok', 'Cancel'])
                  .then(function (buttonIndex) {

                    // var btnIndex = buttonIndex;

                    if (buttonIndex === 1) {
                      deleteDeviceManufacturer(user);
                    }
                    else {
                      console.log('You are not sure');
                    }

                    $ionicListDelegate.closeOptionButtons();
                  });
              };

              var deleteDeviceManufacturer = function(deviceManufacturer) {

                $ionicLoading.show();

                UsersService.deleteUser(deviceManufacturer.userId, orgId)
                  .then(function() {
                    $ionicLoading.hide();
                    $scope.doRefresh();
                    $cordovaDialogs.alert(MESSAGES.DEVICEMAN_DELETED_MESSAGE, '', 'Ok')
                      .then(function () {
                      });
                  }, function() {
                    $ionicLoading.hide();
                    $cordovaDialogs.alert(MESSAGES.DEVICEMAN_DELETED_FAILURE_MESSAGE, '', 'Ok')
                      .then(function () {
                      });

                  });
              };

                $scope.clearFields = function () {
                    $scope.email = "";
                    $scope.firstName = "";
                    $scope.lastName = "";
                };

                $scope.doRefresh();


            }]);
})();
