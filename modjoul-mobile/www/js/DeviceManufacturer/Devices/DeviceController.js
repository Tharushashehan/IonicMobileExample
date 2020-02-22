/* global angular */
/* global console */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
/* jshint shadow:true */
/* jshint loopfunc: true */

(function () {
  'use strict';

  angular.module('modjoul-mobile.controllers')
        .controller('DeviceController', ['$scope', '$state', 'EmployeeManagementService', '$localStorage', '$ionicLoading', '$ionicModal', 'STRINGS', 'OrgManagementService', '$cordovaDialogs', 'MESSAGES', 'DeviceManagementService', function ($scope, $state, EmployeeManagementService, $localStorage, $ionicLoading, $ionicModal, STRINGS, OrgManagementService, $cordovaDialogs, MESSAGES, DeviceManagementService) {
            $scope.$on('$ionicView.beforeEnter', function () {
            $scope.$emit('navbarHideEvent', false);
          });

          $scope.doRefresh = function () {
            $ionicLoading.show();

            OrgManagementService.getOrganizations()
              .then(function (result) {
                console.log(result);
                $ionicLoading.hide();
                $scope.orgs = result.data;
                $scope.$broadcast('scroll.refreshComplete');
              }, function (error) {
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                console.log(error);
              });
          };

          $scope.changeDeviceTypes = function (selectedOrg) {
            var orgId = selectedOrg;
            $scope.orgId = selectedOrg;

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

          $scope.changeDeviceByType = function (selectedDeviceType) {
            var selectedDeviceType = selectedDeviceType;
            var orgId = $scope.orgId;
            console.log(selectedDeviceType);
            $scope.dataTypesList = [];

            $ionicLoading.show();

            DeviceManagementService.getDevicesByType(orgId, selectedDeviceType)
              .then(function (result) {
                $ionicLoading.hide();
                console.log(result);
                console.log(orgId);
                $scope.devices = result.data;
                console.log($scope.devices);

                for (var i = 0; i < $scope.devices.length; i++) {
                  var object = $scope.devices[i];
                  console.log(object.metadata);
                  var metadata = [];

                  if (object.metadata) {
                    Object.keys(object.metadata).forEach(function (key) {
                      var value = object.metadata[key];
                      console.log(key + ':' + value);
                      metadata.push({
                        key: key,
                        value: value
                      });
                    });
                  }

                  $scope.dataTypesList.push({
                    title: object.deviceType,
                    metadata: metadata
                  });
                }

                console.log($scope.dataTypesList);
              }, function (error) {
                $ionicLoading.hide();
                console.log(error);
              });

            console.log($scope.orgId);
          };

          $ionicModal.fromTemplateUrl('templates/device_manufacturer/add-device-form.html', {
            scope: $scope,
            animation: 'slide-in-up'
          }).then(function (modal) {
            $scope.modal = modal;
          });

          $scope.openAddDevice = function () {
            console.log('add device');
            $scope.fields = [{}];
            $scope.modal.show();
          };

          $scope.addField = function () {
            console.log('Add field');
            $scope.fields.push({});
          };

          $scope.removeField = function () {
            console.log('Remove field');
            var lastItem = $scope.fields.length - 1;
            $scope.fields.splice(lastItem);
          };

          $scope.addField = function () {
            console.log('Add field');
            $scope.fields.push({});
          };

          $scope.removeField = function () {
            console.log('Remove field');
            var lastItem = $scope.fields.length - 1;
            $scope.fields.splice(lastItem);
          };

          $scope.addDevice = function (deviceName, selectedDeviceType, selectedOrg) {
            if (!deviceName  || deviceName === '') {
              $cordovaDialogs.alert('Device name empty', '', 'Ok')
                .then(function () {
                  console.log('Fields empty');
                });
            } else if (!selectedOrg  || selectedOrg === '') {
              $cordovaDialogs.alert('Oraganisation not selected', '', 'Ok')
                .then(function () {
                  console.log('Oraganisation not selected');
                });
            } else if (!selectedDeviceType  || selectedDeviceType === '') {
              $cordovaDialogs.alert('Device type not selected', '', 'Ok')
                .then(function () {
                  console.log('Device Type not selected');
                });
            } else {
              var metadata = {};

              if ($scope.fields.length !== 0) {
                var isError = false;

                console.log($scope.fields.length);

                for (var i = 0; i < $scope.fields.length; i++) {
                  if (!$scope.fields[i].key || !$scope.fields[i].value) {
                    $cordovaDialogs.alert('Invalid metadata field(s)', '', 'Ok')
                      .then(function () {
                        console.log('Fields empty');
                      });
                    isError = true;
                    break;
                  } else {
                    metadata[$scope.fields[i].key] = $scope.fields[i].value;
                  }
                }

                if (isError) {
                  return;
                }
              }


              console.log(metadata);

              $ionicLoading.show();

              DeviceManagementService.createDevice({
                deviceType: selectedDeviceType,
                deviceId: deviceName,
                metadata: metadata
              }, selectedOrg)
                .then(function () {
                  $ionicLoading.hide();

                  $cordovaDialogs.alert(MESSAGES.DEVICE_CREATED_MESSAGE, '', 'Ok')
                    .then(function () {
                      console.log(MESSAGES.DEVICE_CREATED_MESSAGE);
                    });
                }, function (error) {
                  $ionicLoading.hide();

                  $scope.showLoading = false;
                  $cordovaDialogs.alert(MESSAGES.DEVICE_FAILURE_MESSAGE, '', 'Ok')
                    .then(function () {
                      console.log(MESSAGES.DEVICE_FAILURE_MESSAGE);
                    });
                  console.log(error);
                });
            }
          };

          $scope.doRefresh();
        }]);
})();
