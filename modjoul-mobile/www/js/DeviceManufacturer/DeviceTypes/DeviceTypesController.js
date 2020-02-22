/* global angular */
/* jshint loopfunc:true */
(function() {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('DeviceTypesController', ['$scope', '$state', 'DeviceManagementService','$localStorage','$ionicLoading',
        '$ionicModal','$cordovaDialogs', 'OrgManagementService', 'MESSAGES', '$ionicPopup','$log',function($scope, $state, DeviceManagementService,
        $localStorage, $ionicLoading, $ionicModal, $cordovaDialogs, OrgManagementService, MESSAGES, $ionicPopup, $log) {

            $scope.doRefresh = function(){

              $scope.changeDeviceTypes = function(selectedOrg){
              var orgId = selectedOrg;

              DeviceManagementService.getDeviceTypes(orgId)
              .then(function(result) {
                  $ionicLoading.hide();
                  $log.debug(orgId);
                  $scope.deviceTypes = result.data;

                  var dataTypesList = [];

                  for(var i=0; i< $scope.deviceTypes.length; i++){
                        var object = $scope.deviceTypes[i];

                        $log.debug(object.metadata);

                        var metadata = [];

                  if(object.metadata){

                      Object.keys(object.metadata).forEach(function(key){
                          var value = object.metadata[key];
                          $log.debug(key + ':' + value);

                          metadata.push({
                              key: key,
                              value: value
                          });

                      });

                  }

                  dataTypesList.push({
                      title: object.deviceType,
                      metadata: metadata
                  });


                  }

                  $log.debug(dataTypesList);

                  $scope.dataTypesList = dataTypesList;


                  }, function(error) {
                      $ionicLoading.hide();
                      $log.debug(error);
                  });
              };
            };

            $scope.doRefresh();

            $ionicModal.fromTemplateUrl('templates/device_manufacturer/add-device-type-form.html', {
              scope: $scope,
              animation: 'slide-in-up'
            }).then(function(modal) {
              $scope.modal = modal;
            });

            $scope.openAddDeviceType = function(){
                $log.debug("add device Type");
                $scope.fields = [{}];
                $scope.modal.show();

                $ionicLoading.show();

                OrgManagementService.getOrganizations()
                    .then(function (result) {
                        $log.debug(result);
                        $ionicLoading.hide();
                        $scope.orgs = result.data;
                        $scope.$broadcast('scroll.refreshComplete');
                    }, function (error) {
                        $ionicLoading.hide();
                        $log.debug(error);
                    });
            };


               $scope.addField = function(){
                  $log.debug("Add field");
                   $scope.fields.push({});
               };

              $scope.removeField = function() {
                    $log.debug("Remove field");
                    var lastItem = $scope.fields.length-1;
                    $scope.fields.splice(lastItem);
              };

            $scope.addDeviceType = function(deviceTypeName,selectedOrg){

              if(!deviceTypeName || deviceTypeName === ""){
                $cordovaDialogs.alert('Device Type name empty', '', 'Ok')
                .then(function() {
                    $log.debug("Fields empty");
                });
              }
              else if(!selectedOrg ||selectedOrg === ""){
                $cordovaDialogs.alert('Oraganisation not selected', '', 'Ok')
                .then(function() {
                    $log.debug("Oraganisation not selected");
                });
              }
              else{
                      var metadata = {};


                      if($scope.fields.length !== 0){

                      var isError = false;

                      $log.debug($scope.fields.length);

                          for(var i = 0; i< $scope.fields.length; i++){
                              if(!$scope.fields[i].key || !$scope.fields[i].value){
                                  $cordovaDialogs.alert('Invalid metadata field(s)', '', 'Ok')
                                  .then(function() {
                                      $log.debug("Fields empty");
                                  });
                                  isError = true;
                                  break;
                              }
                              else{
                                  metadata[$scope.fields[i].key] = $scope.fields[i].value;
                              }

                          }

                          if(isError){
                            return;
                          }

                      }


                      $log.debug("We're through");
                      $log.debug(metadata);

                      DeviceManagementService.createDeviceType({
                        deviceType: deviceTypeName,
                        metadata: metadata
                      },selectedOrg)
                      .then(function () {
                            $cordovaDialogs.alert(MESSAGES.DEVICE_TYPE_CREATED_MESSAGE, '', 'Ok')
                            .then(function() {
                                $log.debug(MESSAGES.DEVICE_TYPE_CREATED_MESSAGE);
                            });
                      }, function (error) {
                          $scope.showLoading = false;
                            $cordovaDialogs.alert(MESSAGES.DEVICE_TYPE_FAILURE_MESSAGE, '', 'Ok')
                            .then(function() {
                                $log.debug(MESSAGES.DEVICE_TYPE_FAILURE_MESSAGE);
                            });
                          $log.debug(error);
                      });
                }
              };

                $scope.openDeviceTypes = function (deviceType) {
                $log.debug(deviceType);
                $scope.deviceInfo = deviceType;
                 $ionicPopup.show({
                    templateUrl: "templates/open-device-info.html",
                    scope: $scope,
                    cssClass: 'popup-graph',
                    buttons: [
                        {
                            text: '<b>Close</b>',
                            type: 'btn btn-scorecard'
                        }

                    ]
                });

            };


            $scope.navSafetyWork = function() {
                $state.go("employee.safety-work");
            };

            $scope.navSafetyDriving = function() {
                $state.go("employee.safety-driving");
            };


        }]);
})();
