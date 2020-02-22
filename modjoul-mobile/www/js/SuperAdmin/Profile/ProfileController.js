/* global angular */
/* global Camera */
/* global console */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
(function () {
    'use strict';
    /*Side Menu*/
    angular.module('modjoul-mobile.controllers')
        .controller('SuperAdminProfileCtrl', ['$scope', 'UserCache', 'ProfileService', '$state', '$ionicLoading', '$localStorage',
            'ionicDatePicker', '$rootScope', 'TemperatureService', 'DeviceManagementService', '$log', 'STRINGS',
            function ($scope, UserCache, ProfileService, $state, $ionicLoading, $localStorage, ionicDatePicker, $rootScope,
                      TemperatureService, DeviceManagementService, $log, STRINGS) {

                $scope.strings = STRINGS;

                $scope.$on('navbarHideEvent', function (event, args) {
                    $scope.tabHide = args;
                    $scope.doRefresh();
                });


                $scope.navOrganizations = function () {
                    $state.go("super-admin.organizations");
                };

                $scope.doRefresh = function () {
                    var orgId = $localStorage.orgId;
                    $scope.profile = $localStorage.profile;
                    DeviceManagementService.getOrgDeviceStatistics(orgId, true)
                        .then(function (result) {
                            $log.debug(orgId);
                            $log.debug(result.data);
                            $scope.deviceStatistics = result.data;
                            $scope.showDeviceStatistics = true;
                            $scope.$broadcast('scroll.refreshComplete');
                        }, function (error) {
                            $log.debug(error);
                            $scope.$broadcast('scroll.refreshComplete');
                        });

                };

                $scope.doRefresh();

            }]);

})();

/*Profile*/
angular.module('modjoul-mobile.controllers')
    .controller('SuperAdminProfileCtrl2', ['$scope', 'UserCache', 'ProfileService', '$state', '$localStorage', '$ionicLoading',
        '$cordovaCamera', '$cordovaDialogs',
        function ($scope, UserCache, ProfileService, $state, $localStorage, $ionicLoading, $cordovaCamera, $cordovaDialogs) {

            $scope.$on("$ionicView.beforeEnter", function () {
                $scope.$emit('navbarHideEvent', true);
            });

            var orgId = $localStorage.orgId;
            var userId = $localStorage.userId;


            $scope.doRefresh = function () {

                var serviceParams = {};
                var orgId = $localStorage.orgId;
                var userId = $localStorage.userId;

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
