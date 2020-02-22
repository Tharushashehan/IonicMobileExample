/* global angular */
/* global console */
/* global google */
/* global document */
/* global window */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
/* jshint shadow:true */

(function () {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('FeedController', ['$scope', '$localStorage', 'FeedService', 'SupervisorEmployeeService',
            '$ionicSlideBoxDelegate', '$ionicLoading', '$ionicPopup', '$log', 'STRINGS', 'moment','ClaimsService',
            '$ionicModal','$timeout','MESSAGES',
            function ($scope, $localStorage, FeedService, SupervisorEmployeeService, $ionicSlideBoxDelegate, $ionicLoading,
                      $ionicPopup, $log, STRINGS, moment, ClaimsService, $ionicModal, $timeout, MESSAGES) {

                $scope.showMe = false;
                $scope.$on('empSelected', function () {
                    $scope.doRefresh();
                });

                $scope.$on('dateSelected', function () {
                    $scope.doRefresh();
                });

                var orgId = $localStorage.orgId;
                var userId = $localStorage.userId;

                $scope.doRefresh = function(){

                    var selectedDate = $localStorage.selectedDate || moment().subtract(1, "days").format("YYYY-MM-DD");
                    var params = {period: selectedDate};


                    console.log(userId);


                    $scope.getFeeds = function () {
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
                                            icons: STRINGS.FEED_ICONS[$scope.feedData[i].activity],
                                            latitude : $scope.feedData[i].latitude,
                                            longitude : $scope.feedData[i].longitude,
                                            orgId : $scope.feedData[i].organizationId,
                                            supervisorId : $scope.feedData[i].supervisorId,
                                            userId : $scope.feedData[i].userId
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

                    $scope.getFeeds();
                };

                $scope.onInitiateClaim = function(feed){
                  console.log("Initiate Claim" + feed);
                  $scope.selectedFeed = feed;
                  $scope.claimInfo = {description : ""};
                  $scope.formattedDate = moment($localStorage.selectedDate).format('YYYY-MM-DD');
                  $timeout(function(){
                  var myLatLng = new google.maps.LatLng(feed.latitude, feed.longitude);
                  console.log(myLatLng);
                  var mapOptions = {
                    center: myLatLng,
                    zoom:16
                  };

                  var map = new google.maps.Map(document.getElementById("initiate-claim-map2"),mapOptions);

                  var marker = new google.maps.Marker({
                    position: myLatLng,
                    map: map
                  });
                  console.log(marker);

                  $scope.map = map;
                  console.log($scope.map);
                },800);


                  var titleString = "<div class='shiftTime-Title'>Initiate Claim</div>";

                  $ionicPopup.show({
                    templateUrl: "templates/initiate-claim-popup.html",
                    scope: $scope,
                    title: titleString,
                    cssClass : 'initiateClaim-popup2',
                    buttons: [
                      {
                        text: '<b>Cancel</b>',
                        type: 'button-positive-orange'
                      },
                      {
                        text: '<b>Initiate</b>',
                        type: 'button-positive-orange',
                        onTap: function() {
                          createClaim(feed);
                        }
                      }
                    ]
                  });
                };


                var createClaim = function (feed){
                    var data = {
                      supervisorId: userId,
                      supervisorName: $localStorage.profile.firstName + ' ' + $localStorage.profile.lastName,
                      userName: feed.name,
                      lat: feed.latitude,
                      long: feed.longitude,
                      incident: feed.activity,
                      reason: feed.activity,
                      description: $scope.claimInfo.description
                    };

                    ClaimsService.createClaim(data, orgId, userId)
                      .then(function() {
                          showToast(MESSAGES.CLAIM_CREATE_SUCCESS);
                      }, function() {
                          showToast(MESSAGES.CLAIM_CREATE_FAILURE);
                      });
                };

                function showToast(data) {
                    window.plugins.toast.showWithOptions(
                        {
                            message: data,
                            duration: 7000, // ms
                            position: 'top',
                            addPixelsY: -25,
                            styling: {
                                opacity: 0.8,
                                backgroundColor: '#000000',
                                textColor: '#FFFFFF',
                                textSize: 15,
                                cornerRadius: 5.0, // minimum is 0 (square). iOS default 20, Android default 100
                                horizontalPadding: 90, // iOS default 16, Android default 50
                                verticalPadding: 18 // iOS default 12, Android default 30
                            }

                        },
                        function () {

                        }
                    );
                }

                $scope.doRefresh();

            }
        ]);
})();
