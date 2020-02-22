/* global angular */
/* global console */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

(function () {
    'use strict';
    /*Side Menu*/
    angular.module('modjoul-mobile.controllers')
        .controller('OrgAdminChangeDetailsCtrl', ['$scope', 'UserCache', 'OrgManagementService', '$localStorage', '$ionicLoading', '$log','$cordovaCamera',
            function ($scope, UserCache, OrgManagementService, $localStorage, $ionicLoading, $log, $cordovaCamera) {

                $scope.orgId = $localStorage.orgId;
//                $scope.enteredJobfunctions = [];
                $scope.currentSelection = null;
                $scope.showEditPrompt = false;

                $scope.$on('navbarHideEvent', function (event, args) {
                    $scope.tabHide = args;
//                    $scope.doRefresh();
                });

                $scope.doRefresh = function () {
                    function getOrganizationDetails() {
                        $ionicLoading.show();

                        OrgManagementService.getExistingOrgDetails($scope.orgId)
                            .then(function (result) {
                                $scope.$broadcast('scroll.refreshComplete');
                                $ionicLoading.hide();
                                console.log(result);
                                $scope.organization = result.data;
                                $scope.jobFunctionsList = result.data.orgJobFunctions;
                                $scope.enteredJobfunctions = $scope.jobFunctionsList;
                            }, function (error) {
                                $scope.$broadcast('scroll.refreshComplete');
                                $ionicLoading.hide();
                                $log.debug(error);
                            });
                    }

                    getOrganizationDetails();
                };


                $scope.doRefresh();

                $scope.upload = function () {
                    var options = {
                        quality: 75,
                        destinationType: Camera.DestinationType.DATA_URL,
                        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                        allowEdit: false,
                        encodingType: Camera.EncodingType.PNG

                    };
                    $cordovaCamera.getPicture(options).then(function (imageData) {
                        $log.debug("Image has been added");
                        //$log.debug(imageData);
                        $scope.uploadedImage = imageData;
                    }, function (error) {
                        $log.debug(error);
                    });
                };

                $scope.keyDown = function (event) {

                    if (event.keyCode === 13) {

                        if ($scope.enteredJobfunctions.indexOf(event.target.value) === -1) {
                            $scope.enteredJobfunctions.push(event.target.value);
                            event.target.value = "";
                        }

                    }
                };

                $scope.editJobFunction = function (item) {
                    $scope.currentSelection = item;
                    $scope.showEditPrompt = true;

                };

                $scope.removeJobFunction = function () {

                    $scope.enteredJobfunctions.splice($scope.enteredJobfunctions.indexOf($scope.currentSelection),1);
                    $scope.currentSelection = null;
                    $scope.showEditPrompt = false;
                };

                $scope.closePrompt = function () {
                    $scope.showEditPrompt = false;
                };

                $scope.changeOrgDetails = function (orgAdd, phone) {
                  console.log("changeOrgDetails");

                  var image = null;
                  var mimeType = null;

                    $ionicLoading.show();

                    var payload = {
                        address: orgAdd,
                        contact: phone,
                        orgJobFunctions: $scope.enteredJobfunctions
                    };

                    if($scope.uploadedImage){
                        payload.orgLogo = $scope.uploadedImage;
                        payload.logoMimeType = "image/png";
                    }

                    OrgManagementService.updateOrgDetails($scope.orgId, payload).then(function (result) {
                        $ionicLoading.hide();
                        if (result.status === 200) {
                          console.log($scope.orgId);
                          delete $scope.uploadedImage;
                        }
                    }, function (error){
                        console.log(error);
                        console.log($scope.orgId);
                    });

                };


            }]);

})();
