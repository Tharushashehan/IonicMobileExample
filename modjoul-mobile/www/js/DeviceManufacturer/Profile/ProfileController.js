/* global angular */
/* global console */
/* global Camera */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
(function () {
    'use strict';
    /*Side Menu*/
    angular.module('modjoul-mobile.controllers')
        .controller('DeviceManufacturerProfileCtrl', ['$scope', 'UserCache', 'ProfileService', '$state', '$ionicLoading', '$localStorage',

            function ($scope, UserCache, ProfileService, $state, $ionicLoading, $localStorage) {

                $scope.$on('navbarHideEvent', function (event, args) {
                    $scope.tabHide = args;
                    $scope.profile = $localStorage.profile;
                });

                $scope.profile = $localStorage.profile;
                $scope.doRefresh = function () {

                };
                $scope.doRefresh();


            }]);

})();

/*Profile*/
angular.module('modjoul-mobile.controllers')
    .controller('DeviceManufacturerProfileCtrl2', ['$scope', 'UserCache', 'ProfileService', '$state', '$localStorage', '$ionicLoading',
        '$log', '$cordovaCamera', '$cordovaDialogs',
        function ($scope, UserCache, ProfileService, $state, $localStorage, $ionicLoading, $log, $cordovaCamera, $cordovaDialogs) {

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
