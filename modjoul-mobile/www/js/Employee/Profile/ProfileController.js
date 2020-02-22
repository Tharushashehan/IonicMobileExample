/* global angular */
/* global console */
/* global moment */
/* global Camera */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
/* jshint shadow:true */
(function () {
    'use strict';
    /*Side Menu*/
    angular.module('modjoul-mobile.controllers')
        .controller('EmployeeProfileCtrl', ['$scope', 'UserCache', 'ProfileService', '$state', '$ionicLoading', '$localStorage',
            'ionicDatePicker', '$rootScope', 'TemperatureService',
            function ($scope, UserCache, ProfileService, $state, $ionicLoading, $localStorage, ionicDatePicker, $rootScope,
          TemperatureService) {

                $scope.$on('navbarHideEvent', function (event, args) {
                    $scope.tabHide = args;
                    $scope.doRefresh();
                });

                $scope.navProductivity = function () {
                    // $state.go("employee.productivity");
                    $state.go("employee.productivity-worktime");
                };

                $scope.navSafety = function () {
                    $state.go("employee.safety");
                };

                $scope.$on('dateSelected', function () {
                    $scope.doRefresh();
                });

                $scope.openCalendar = function () {


                    var currentDate = moment();
                  var maxDate = currentDate;
                    var lastMonth = moment().subtract(12, "months");

                    var selectedDate;
                    if ($localStorage.selectedDate === undefined) {

                        selectedDate = currentDate;
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
                        from: new Date(lastMonth.format('YYYY'), lastMonth.format('M') - 1, lastMonth.format('D')),
                        to: new Date(maxDate.format('YYYY'), maxDate.format('M') - 1, maxDate.format('D')),
                        inputDate: new Date(selectedDate.format('YYYY'), selectedDate.format('M') - 1, selectedDate.format('D'))
                    };
                    ionicDatePicker.openDatePicker(ipObj1);
                };

                $scope.doRefresh = function () {
                  var orgId = $localStorage.orgId;
                  var userId = $localStorage.userId;
                  var selectedDate = $localStorage.selectedDate || moment().format("YYYY-MM-DD");
                  var params = {period: selectedDate};

                  $scope.profile = $localStorage.profile;

                  TemperatureService.getTemperatureSummary(params, orgId, userId).then(function (result) {
                    console.log(result);
                    if (result.status === 200) {
                      $scope.temperature = result.data.activities;
                      $scope.temperatureUnits = result.data.units;
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                  }, function () {
                    $scope.$broadcast('scroll.refreshComplete');
                  });


                };

                $scope.doRefresh();


            }]);

})();

/*Profile*/
angular.module('modjoul-mobile.controllers')
    .controller('EmployeeProfileCtrl2', ['$scope', 'UserCache', 'ProfileService', '$state', '$localStorage',
        '$ionicLoading', '$ionicActionSheet', '$cordovaCamera','$cordovaDialogs',
        function ($scope, UserCache, ProfileService, $state, $localStorage, $ionicLoading, $ionicActionSheet,
                  $cordovaCamera, $cordovaDialogs) {

            $scope.$on("$ionicView.beforeEnter", function () {
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
                        $scope.productivityTrend = result.data.trend.productivity;
                        $scope.safetyTrend = result.data.trend.safety;
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

          $scope.showPhotoChangeActions = function()
          {
            $ionicActionSheet.show({
              buttons: [
                { text: 'Take a New Profile Picture' },
                { text: 'Select Profile Picture' }
              ],
              cancelText: 'Cancel',
              cancel: function() {
                // add cancel code..
              },
              buttonClicked: function(index) {
                if (index === 0){
                  console.log("Pressed index 0");
                }
                else if (index === 1)
                {
                  console.log("Pressed index 1");
                }
                return true;
              }
            });
          };

        }]);
