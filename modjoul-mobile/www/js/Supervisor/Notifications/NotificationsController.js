/* global angular */
/* global console */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
/* jshint shadow:true */

(function () {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('NotificationsController', ['$scope', '$localStorage', 'FeedService', 'SupervisorEmployeeService',
            '$ionicSlideBoxDelegate', '$ionicLoading', '$ionicPopup', '$log', 'STRINGS', 'moment',
            function ($scope, $localStorage, FeedService, SupervisorEmployeeService, $ionicSlideBoxDelegate, $ionicLoading,
                      $ionicPopup, $log, STRINGS, moment) {



                $scope.$on('empSelected', function () {
                  $scope.doRefresh();
                });

                $scope.$on('dateSelected', function () {
                    $scope.doRefresh();
                });

                $scope.$on('navbarHideEvent', function (event, args) {
                  $scope.tabHide = args;
                });

                $scope.$on("$ionicView.beforeEnter", function() {
                  $scope.$emit('navbarHideEvent', true);
                });

                $scope.doRefresh = function (){

                    var selectedDate = $localStorage.selectedDate || moment().subtract(1, "days").format("YYYY-MM-DD");

                    var params = {period: selectedDate};

                    var orgId = $localStorage.orgId;

                    var userId = $localStorage.userId;

                    console.log(userId);


                    $scope.getIdleTimeByPeriod = function () {
                        $ionicLoading.show();


                        SupervisorEmployeeService.GetEmployeesForSupervisor(orgId, userId)
                            .then(function (result) {
                                $ionicLoading.hide();
                                $scope.$broadcast('scroll.refreshComplete');

                                var employees = {};
                                for (var i = 0; i < result.data.length; i++) {
                                    employees[result.data[i].userId] = {};
                                    employees[result.data[i].userId].name = result.data[i].firstName + " " + result.data[i].lastName;
                                    employees[result.data[i].userId].profilePhoto = result.data[i].profilePhoto;
                                    employees[result.data[i].userId].profileMimeType = result.data[i].profileMimeType;
                                }
                                $scope.employees = employees;

                                console.log($scope.employees);

                                FeedService.getFeed(params, orgId, userId)
                                    .then(function (result) {
                                        $ionicLoading.hide();

                                        $scope.feedData = result.data.feed;

                                        var feedList = [];


                                        if($scope.feedData.length === 0){
                                              $scope.isNoData = true;

                                        }
                                        else{
                                            $scope.isNoData = false;
                                        }

                                        for (var i = 0; i < $scope.feedData.length; i++) {
                                            var employee = $scope.employees[$scope.feedData[i].userId];


                                            feedList.push({
                                                name: employee.name,
                                                profileMimeType: employee.profileMimeType,
                                                profilePhoto: employee.profilePhoto,
                                                activity: $scope.feedData[i].activity,
                                                time: moment($scope.feedData[i].timestamp).format("hh:mm a"),
                                                message: STRINGS.FEED_MAPPING[$scope.feedData[i].activity],
                                                icons: STRINGS.FEED_ICONS[$scope.feedData[i].activity]

                                            });
                                        }

                                        $scope.feedList = feedList;

                                        console.log($scope.feedData);

                                    }, function (error) {
                                        console.log(error);
                                        $ionicLoading.hide();
                                        $scope.$broadcast('scroll.refreshComplete');
                                    });


                            }, function (error) {
                                console.log(error);
                                $ionicLoading.hide();
                                $scope.$broadcast('scroll.refreshComplete');
                            });


                    };

                    $scope.getIdleTimeByPeriod();

                };
                $scope.doRefresh();

            }
        ]);
})();
