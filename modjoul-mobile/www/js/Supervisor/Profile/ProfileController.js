/* global angular */
/* global console */
/* global moment */
/* global Camera */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

(function () {
    'use strict';
    /*Side Menu*/
    angular.module('modjoul-mobile.controllers')
        .controller('SupervisorProfileCtrl', ['$scope', 'UserCache', 'ProfileService', '$state', '$ionicLoading',
            '$localStorage', '$rootScope', 'ionicDatePicker',
            function ($scope, UserCache, ProfileService, $state, $ionicLoading, $localStorage, $rootScope, ionicDatePicker) {

                $scope.profile = $localStorage.profile;

                $scope.navProductivity = function () {
                    $state.go("supervisor.productivity-rankings");
                };

                $scope.navNow = function () {
                    $state.go("supervisor.now");
                };


                $scope.navSafety = function () {
                    $state.go("supervisor.safety-rankings");
                };

                $scope.$on('navbarHideEvent', function (event, args) {
                    $scope.tabHide = args;
                    $scope.profile = $localStorage.profile;
                });


                $scope.openCalendar = function () {
                    var selectedDate;
                    if ($localStorage.selectedDate === undefined) {

                        selectedDate = moment();
                    }
                    else {

                        selectedDate = moment($localStorage.selectedDate, "YYYY-MM-DD");

                    }

                    var ipObj1 = {
                        callback: function (val) {
                            var dateObject = moment(val, "x").format("YYYY-MM-DD");
                            $localStorage.selectedDate = dateObject;
                            $rootScope.$broadcast('dateSelected', true);
                            console.log(dateObject);
                        },
                        inputDate: new Date(selectedDate.format('YYYY'), selectedDate.format('M') - 1, selectedDate.format('D'))
                    };
                    ionicDatePicker.openDatePicker(ipObj1);
                };


            }]);


    /*Profile*/
    angular.module('modjoul-mobile.controllers')
        .controller('SupervisorProfileCtrl2', ['$scope', 'UserCache', 'ProfileService', '$state', '$localStorage',
            '$ionicLoading','$cordovaCamera', '$cordovaDialogs',
            function ($scope, UserCache, ProfileService, $state, $localStorage, $ionicLoading,$cordovaCamera, $cordovaDialogs) {

                $scope.$on("$ionicView.beforeEnter", function () {
                    // handle event

                    $scope.$emit('navbarHideEvent', true);
                });

                var orgId = $localStorage.orgId;
                var userId = $localStorage.userId;

                $scope.doRefresh = function () {
                    var serviceParams = {};

                    $ionicLoading.show();

                    ProfileService.ProfileByUserID(serviceParams, orgId, userId).then(function (result) {
                        $ionicLoading.hide();
                        if (result.status === 200) {
                            $scope.profile = result.data;
                        }
                        $scope.$broadcast('scroll.refreshComplete');

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
                        console.log(imageData);
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


})();
