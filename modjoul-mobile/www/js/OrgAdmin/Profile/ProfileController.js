/* global angular */
/* global console */
/* global Camera */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
(function () {
    'use strict';
    /*Side Menu*/
    angular.module('modjoul-mobile.controllers')
        .controller('OrgAdminProfileCtrl', ['$scope', 'UserCache', 'ProfileService', '$state', '$ionicLoading', '$localStorage',
            'ionicDatePicker', '$rootScope', 'TemperatureService', 'DeviceManagementService', 'STRINGS',
            function ($scope, UserCache, ProfileService, $state, $ionicLoading, $localStorage, ionicDatePicker, $rootScope,
                      TemperatureService, DeviceManagementService, STRINGS) {

                $scope.strings = STRINGS;

                $scope.$on('navbarHideEvent', function (event, args) {
                    $scope.tabHide = args;
                    $scope.doRefresh();
                });

                $scope.profile = $localStorage.profile;
                $scope.doRefresh = function () {
                    var orgId = $localStorage.orgId;

                    DeviceManagementService.getOrgDeviceStatistics(orgId, false)
                        .then(function (result) {
                            console.log(orgId);
                            console.log(result.data);
                            $scope.deviceStatistics = result.data;
                            $scope.showDeviceStatistics = true;
                            $scope.$broadcast('scroll.refreshComplete');
                        }, function (error) {
                            console.log(error);
                            $scope.$broadcast('scroll.refreshComplete');
                        });

                };

                $scope.navUsers = function () {
                    $state.go("org-admin.users");
                };


                $scope.doRefresh();

            }]);

})();

/*Profile*/
angular.module('modjoul-mobile.controllers')
    .controller('OrgAdminProfileCtrl2', ['$scope', 'UserCache', 'ProfileService', '$state', '$localStorage', '$ionicLoading',
        '$cordovaCamera', '$cordovaDialogs',
        function ($scope, UserCache, ProfileService, $state, $localStorage, $ionicLoading,$cordovaCamera, $cordovaDialogs) {

            $scope.$on("$ionicView.beforeEnter", function () {
                $scope.$emit('navbarHideEvent', true);
            });

            var orgId = $localStorage.orgId;
            var userId = $localStorage.userId;

            $scope.doRefresh = function () {

                var serviceParams = {};


                $ionicLoading.show();

                ProfileService.ProfileByUserID(serviceParams, orgId, userId).then(function (result) {
                    if (result.status === 200) {
                        $scope.profile = result.data;
                        $scope.productivityTrend = result.data.trend.productivity;
                        $scope.safetyTrend = result.data.trend.safety;
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                    $ionicLoading.hide();
                }, function () {
                    $scope.$broadcast('scroll.refreshComplete');
                    $ionicLoading.hide();
                });


            };

            $scope.doRefresh();

            $scope.editProfilePicture = function () {
                var options = {
                    quality: 75,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    allowEdit: false,
                    encodingType: Camera.EncodingType.JPEG

                };
                $cordovaCamera.getPicture(options).then(function (imageData) {
                    console.log("Image has been added");
                    $scope.uploadingImage = imageData;

                    $cordovaDialogs.confirm('Do you want to edit the profile picture?', ['Ok', 'Cancel'])
                        .then(function (buttonIndex) {

                            if (buttonIndex === 1) {
                                //Upload
                                var params = {
                                    userId: userId,
                                    profilePhoto: $scope.uploadingImage,
                                    profileMimeType: "image/jpeg"
                                };
                                $ionicLoading.show();
                                ProfileService.updateProfile(params, orgId)
                                    .then(function(result) {
                                        $ionicLoading.hide();

                                        console.log(result.data);
                                        $scope.doRefresh();

                                    }, function(error) {
                                        $ionicLoading.hide();
                                        console.log(error);
                                    });
                            }
                            else {
                                console.log('You are not sure');
                            }
                        });

                }, function (error) {
                    console.log(error);
                });
            };

        }]);
