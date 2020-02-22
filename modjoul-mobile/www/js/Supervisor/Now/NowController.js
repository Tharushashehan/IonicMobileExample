/* global google */
/* global angular */
/* global document */
/* jshint loopfunc:true */
(function () {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('SupervisorNowController', ['$scope', '$state', '$compile', '$ionicModal', '$ionicPopup', '$localStorage',
            '$rootScope', 'SupervisorEmployeeService', 'moment', 'STRINGS', '$log', '$ionicLoading', function ($scope, $state,
                   $compile, $ionicModal, $ionicPopup, $localStorage, $rootScope, SupervisorEmployeeService, moment,
                        STRINGS, $log, $ionicLoading) {

                $scope.map = new google.maps.Map(document.getElementById('nowMap'), {
                    zoom: 4,
                    center: new google.maps.LatLng(34.682567, -82.837249),
                    streetViewControl: false,
                    styles: [
                        {
                            "featureType": "all",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "visibility": "simplified"
                                },
                                {
                                    "hue": "#ff7700"
                                }
                            ]
                        },
                        {
                            "featureType": "administrative",
                            "elementType": "all",
                            "stylers": [
                                {
                                    "visibility": "simplified"
                                }
                            ]
                        },
                        {
                            "featureType": "administrative.country",
                            "elementType": "labels.text.fill",
                            "stylers": [
                                {
                                    "color": "#1d1d1d"
                                }
                            ]
                        },
                        {
                            "featureType": "administrative.province",
                            "elementType": "labels.text.fill",
                            "stylers": [
                                {
                                    "color": "#ffffff"
                                },
                                {
                                    "visibility": "on"
                                }
                            ]
                        },
                        {
                            "featureType": "administrative.province",
                            "elementType": "labels.text.stroke",
                            "stylers": [
                                {
                                    "color": "#ed5929"
                                },
                                {
                                    "weight": "5.00"
                                },
                                {
                                    "visibility": "on"
                                }
                            ]
                        },
                        {
                            "featureType": "administrative.locality",
                            "elementType": "labels.text.fill",
                            "stylers": [
                                {
                                    "color": "#787878"
                                },
                                {
                                    "visibility": "on"
                                }
                            ]
                        },
                        {
                            "featureType": "administrative.locality",
                            "elementType": "labels.text.stroke",
                            "stylers": [
                                {
                                    "color": "#ffffff"
                                },
                                {
                                    "visibility": "on"
                                },
                                {
                                    "weight": "5.00"
                                }
                            ]
                        },
                        {
                            "featureType": "administrative.neighborhood",
                            "elementType": "labels.text",
                            "stylers": [
                                {
                                    "visibility": "on"
                                }
                            ]
                        },
                        {
                            "featureType": "administrative.neighborhood",
                            "elementType": "labels.text.fill",
                            "stylers": [
                                {
                                    "visibility": "on"
                                },
                                {
                                    "color": "#2d2d2d"
                                }
                            ]
                        },
                        {
                            "featureType": "administrative.neighborhood",
                            "elementType": "labels.text.stroke",
                            "stylers": [
                                {
                                    "color": "#ffffff"
                                },
                                {
                                    "visibility": "on"
                                },
                                {
                                    "weight": "5.00"
                                }
                            ]
                        },
                        {
                            "featureType": "administrative.land_parcel",
                            "elementType": "geometry.fill",
                            "stylers": [
                                {
                                    "saturation": "64"
                                }
                            ]
                        },
                        {
                            "featureType": "landscape",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#fafafa"
                                }
                            ]
                        },
                        {
                            "featureType": "poi",
                            "elementType": "all",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "road",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#2c2c2c"
                                }
                            ]
                        },
                        {
                            "featureType": "road",
                            "elementType": "geometry.fill",
                            "stylers": [
                                {
                                    "visibility": "on"
                                },
                                {
                                    "color": "#d5d5d5"
                                }
                            ]
                        },
                        {
                            "featureType": "road",
                            "elementType": "geometry.stroke",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "road",
                            "elementType": "labels",
                            "stylers": [
                                {
                                    "visibility": "on"
                                },
                                {
                                    "color": "#ff0000"
                                }
                            ]
                        },
                        {
                            "featureType": "road",
                            "elementType": "labels.text.fill",
                            "stylers": [
                                {
                                    "color": "#ed5929"
                                }
                            ]
                        },
                        {
                            "featureType": "road",
                            "elementType": "labels.text.stroke",
                            "stylers": [
                                {
                                    "visibility": "on"
                                },
                                {
                                    "color": "#ffffff"
                                },
                                {
                                    "weight": "5.00"
                                }
                            ]
                        },
                        {
                            "featureType": "road",
                            "elementType": "labels.icon",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "road.highway",
                            "elementType": "geometry.fill",
                            "stylers": [
                                {
                                    "color": "#ed5929"
                                },
                                {
                                    "visibility": "on"
                                }
                            ]
                        },
                        {
                            "featureType": "road.highway",
                            "elementType": "geometry.stroke",
                            "stylers": [
                                {
                                    "visibility": "on"
                                },
                                {
                                    "color": "#ed5929"
                                }
                            ]
                        },
                        {
                            "featureType": "road.highway",
                            "elementType": "labels.text",
                            "stylers": [
                                {
                                    "color": "#ffffff"
                                }
                            ]
                        },
                        {
                            "featureType": "road.highway",
                            "elementType": "labels.text.fill",
                            "stylers": [
                                {
                                    "color": "#ffffff"
                                }
                            ]
                        },
                        {
                            "featureType": "road.highway",
                            "elementType": "labels.text.stroke",
                            "stylers": [
                                {
                                    "visibility": "on"
                                },
                                {
                                    "color": "#ed5929"
                                }
                            ]
                        },
                        {
                            "featureType": "road.arterial",
                            "elementType": "geometry.stroke",
                            "stylers": [
                                {
                                    "color": "#d9d9d9"
                                },
                                {
                                    "visibility": "on"
                                }
                            ]
                        },
                        {
                            "featureType": "transit.station",
                            "elementType": "labels.icon",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "transit.station.airport",
                            "elementType": "geometry.fill",
                            "stylers": [
                                {
                                    "visibility": "simplified"
                                },
                                {
                                    "lightness": "4"
                                },
                                {
                                    "saturation": "-100"
                                }
                            ]
                        },
                        {
                            "featureType": "water",
                            "elementType": "all",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "water",
                            "elementType": "geometry.fill",
                            "stylers": [
                                {
                                    "color": "#e1e1e1"
                                },
                                {
                                    "visibility": "on"
                                }
                            ]
                        }
                    ]

                });


                $scope.strings = STRINGS;
                $scope.showWorkingCheck = true;
                $scope.showDrivingCheck = true;
                $scope.showIdlingCheck = true;
                $scope.showWorkingFromHeightsCheck = true;
                $scope.showUncategorizedCheck = true;
                $scope.drivingCheckVisibility = true;
                $scope.mapControl = [];

                $scope.sizeParam = new google.maps.Size(30, 30);
                $scope.movingIconAnchor = new google.maps.Point(15, 15);
                $scope.incidientIconAnchor = new google.maps.Point(15, 15);

                $scope.workingIconUrl = "img/icons/user-icon-blue.png";
                $scope.drivingIconUrl = "img/icons/user-icon-orange.png";

                $ionicLoading.show();

                SupervisorEmployeeService.GetEmployeesForSupervisor($localStorage.orgId, $localStorage.userId)
                    .then(function (result) {

                        $ionicLoading.hide();
                        var employees = {};
                        var employeeObjects = {};

                        for (var i = 0; i < result.data.length; i++) {
                            employees[result.data[i].userId] = {};
                            employees[result.data[i].userId].name = result.data[i].firstName + " " + result.data[i].lastName;
                            employeeObjects[result.data[i].userId] = result.data[i];
                        }

                        $scope.employees = employees;
                        $scope.employeeObjects = employeeObjects;

                        SupervisorEmployeeService.getNow($localStorage.orgId, $localStorage.userId)
                            .then(function (result) {


                                var users = result.data.now;

                                if (!users.working) {
                                    users.working = [];
                                }

                                if (!users.driving) {
                                    users.driving = [];
                                }

                                if (!users.idling) {
                                    users.idling = [];
                                }

                                //for(var i = 0; i < users.length; i++) {
                                //    users[i].name = employees[users[i].userId].name;
                                //}

                                var bounds = new google.maps.LatLngBounds();


                                $scope.drivingEmployeeMarkers = [];
                                $scope.workingEmployeeMarkers = [];


                                for (var j = 0; j < users.driving.length; j++) {

                                    if(users.driving[j].latitude >= -90 && users.driving[j].latitude <= 90 && users.driving[j].longitude >= -180 && users.driving[j].longitude <= 180){
                                        (function (markerObject) {

                                            var name = $scope.employees[markerObject.userId].name;
                                            var userId = markerObject.userId;
                                            var activity = markerObject.activity;
                                            var timestamp = markerObject.timestamp;
                                            timestamp = moment.utc(timestamp).format("YYYY-MM-DD HH:mm:ss");

                                            var iconOption = {
                                                url: $scope.drivingIconUrl,
                                                scaledSize: new google.maps.Size(24, 24),
                                                anchor: new google.maps.Point(12, 12)
                                            };


                                            var position = new google.maps.LatLng({
                                                lat: parseFloat(markerObject.latitude),
                                                lng: parseFloat(markerObject.longitude)
                                            });

                                            bounds.extend(position);
                                            var marker = new google.maps.Marker({
                                                position: position,
                                                map: $scope.map,
                                                options: {icon: iconOption}
                                            });

                                            var contentString = '<div>' +
                                                '<p style="font-weight:bold">' + name + '</p><p>Currently: ' + activity + '</p>' +
                                                '<p>Latest timestamp: ' + timestamp + '</p>' +
                                                '<button class="btn btn-info" ng-click="viewEmployeeScorecard(\'' + userId + '\', \'' + name + '\')">View Details</button>' +
                                                '</div>';

                                            var compiledContent = $compile(contentString)($scope);


                                            var infowindow = new google.maps.InfoWindow({
                                                content: compiledContent[0]
                                            });

                                            marker.addListener('click', function () {
                                                infowindow.open($scope.map, marker);
                                            });


                                            $scope.drivingEmployeeMarkers.push(marker);


                                        })(users.driving[j]);
                                    }



                                }


                                for (var k = 0; k < users.working.length; k++) {

                                    if(users.working[k].latitude >= -90 && users.working[k].latitude <= 90 && users.working[k].longitude >= -180 && users.working[k].longitude <= 180){
                                        (function (markerObject) {

                                            var name = $scope.employees[markerObject.userId].name;
                                            var userId = markerObject.userId;
                                            var activity = markerObject.activity;
                                            var timestamp = markerObject.timestamp;
                                            timestamp = moment.utc(timestamp).format("YYYY-MM-DD HH:mm:ss");

                                            var iconOption = {
                                                url: $scope.workingIconUrl,
                                                scaledSize: new google.maps.Size(24, 24),
                                                anchor: new google.maps.Point(12, 12)
                                            };


                                            var position = new google.maps.LatLng({
                                                lat: parseFloat(markerObject.latitude),
                                                lng: parseFloat(markerObject.longitude)
                                            });

                                            bounds.extend(position);
                                            var marker = new google.maps.Marker({
                                                position: position,
                                                map: $scope.map,
                                                options: {icon: iconOption}
                                            });

                                            var contentString = '<div>' +
                                                '<p style="font-weight:bold">' + name + '</p><p>Currently: ' + activity + '</p>' +
                                                '<p>Latest timestamp: ' + timestamp + '</p>' +
                                                '<button class="btn btn-info" ng-click="viewEmployeeScorecard(\'' + userId + '\', \'' + name + '\')">View Details</button>' +
                                                '</div>';

                                            var compiledContent = $compile(contentString)($scope);


                                            var infowindow = new google.maps.InfoWindow({
                                                content: compiledContent[0]
                                            });

                                            marker.addListener('click', function () {
                                                infowindow.open($scope.map, marker);
                                            });


                                            $scope.workingEmployeeMarkers.push(marker);


                                        })(users.working[k]);
                                    }



                                }

                                $scope.map.fitBounds(bounds);


                            }, function () {
                                $scope.showLoading = false;

                            });

                    }, function () {
                        $ionicLoading.hide();
                    });


                $scope.marker = {
                    events: {
                        click: function (marker) {
                            $log.debug(marker.getPosition().lat());
                            $scope.cancelAllTimeouts();
                        }
                    }
                };


                $scope.$on("$ionicView.beforeEnter", function () {
                    $scope.$emit('navbarHideEvent', false);
                });


                $scope.filterEmployee = function () {

                    $ionicPopup.show({
                        templateUrl: "js/Supervisor/Now/nowmapfilter.html",
                        scope: $scope,
                        cssClass: 'map-filter',
                        buttons: [
                            {
                                text: '<b>Ok</b>',
                                type: 'btn btn-info'
                            }
                        ]
                    });

                };

                $scope.filterVisibleChange = function (type, filter) {

                    var markerArray;
                    if (type === STRINGS.WORK) {
                        $scope.showWorkingCheck = filter;
                        markerArray = $scope.workingEmployeeMarkers;
                    }
                    else if (type === STRINGS.DRIVE) {
                        $scope.showDrivingCheck = filter;
                        markerArray = $scope.drivingEmployeeMarkers;
                    }
                    else if (type === STRINGS.IDLE) {
                        markerArray = $scope.runningEmployeeMarkers;
                    }
                    else if (type === STRINGS.WORKINGFROMHEIGHTS) {
                        markerArray = $scope.workingAtHeightEmployeeMarkers;
                    }

                    else if (type === STRINGS.UNCATEGORIZED) {
                        markerArray = $scope.uncategorizedEmployeeMarkers;
                    }

                    for (var i = 0; i < markerArray.length; i++) {
                        if (filter) {
                            markerArray[i].setMap($scope.map);
                        }
                        else {
                            markerArray[i].setMap(null);
                        }

                    }

                };


//      $scope.$on("$ionicView.enter", function (scopes, states) {
//        google.maps.event.trigger(map, 'resize');
//      });


                $rootScope.viewEmployeeScorecard = function (userid, username) {

                    //var employee = {id: userid, name: username};
                    $localStorage.selectedEmployee = $scope.employeeObjects[userid];
                    $rootScope.$broadcast('empSelected', true);




                  $log.debug("View Scorecard: user id-> " + userid + " name-> " + username);

                    $localStorage.selectedEmployeeIdForSC = userid;
                    $localStorage.selectedEmployeeNameForSC = username;
                    $state.go('supervisor.scorecard', {obj: userid}, {reload: true});

                };

                $scope.workingFilterChanged = function (checked) {
                    $scope.showWorkingCheck = checked;

                };


                $scope.drivingFilterChanged = function (checked) {
                    $scope.showDrivingCheck = checked;

                };

            }]);
})();
