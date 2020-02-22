/* global google */
/* global angular */
/* global moment */
/* global MarkerWithLabel */
/* global document */
/* jshint loopfunc:true */
(function () {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('SupervisorBreadcrumbCtrl', ['$scope', 'MapConstants', 'MapMessages', '$cordovaGeolocation',
            '$compile', '$timeout', '$ionicPopup', 'ionicDatePicker', 'BreadcrumbService', 'SupervisorOutOfBoundsService',
            'STRINGS', '$localStorage', '$cordovaDialogs', '$ionicLoading', '$log',
            function ($scope, MapConstants, MapMessages, $cordovaGeolocation, $compile, $timeout, $ionicPopup,
                      ionicDatePicker, BreadcrumbService, SupervisorOutOfBoundsService, STRINGS, $localStorage,
                      $cordovaDialogs, $ionicLoading, $log) {

                $scope.strings = STRINGS;
                var orgId = $localStorage.orgId;

                $scope.animationSlider = 1;

                $scope.animationSliderOptions = {
                    floor: 1,
                    ceil: 10,
                    onChange: function(sliderId, modelValue){
                        var index = modelValue - 1;
                        var locationLatLng = new google.maps.LatLng($scope.breadcrumbTrail[index].latitude, $scope.breadcrumbTrail[index].longitude);
                        $scope.movingMarker.setIcon({url: $scope.getMovingMarkerIcon($scope.breadcrumbTrail[index].activity)});
                        $scope.movingMarker.setPosition(locationLatLng);

                        $scope.map.panTo(locationLatLng);
                        $scope.streetView.getPanorama({location: locationLatLng, radius: 50}, processSVData);
                    }
                };

                $scope.$on('empSelected', function () {
                    $scope.cancelAllTimeouts();
                    $scope.isDataLoaded = false;
                    $scope.isAnimationStarted = false;
                    $scope.isResumed = false;
                    $scope.doRefresh();
                });

                $scope.$on('dateSelected', function () {
                    $scope.cancelAllTimeouts();
                    $scope.isDataLoaded = false;
                    $scope.isAnimationStarted = false;
                    $scope.isResumed = false;
                    $scope.doRefresh();
                });

                $scope.map = new google.maps.Map(document.getElementById('map-breadcrumb'), {

                    center: new google.maps.LatLng(MapConstants.latitude, MapConstants.latitude),
                    streetViewControl: false,
                    fullscreenControl: false,
                    mapTypeId: 'satellite',
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


                $scope.showDrivingHistory = false;
                $scope.showLocationsHistory = true;
                $scope.showOutOfBoundsHistory = true;

                $scope.showingStreetview = false;
                $scope.streetviewService;
                $scope.panorama;
                $scope.directionsService;
                $scope.directionsDisplay;
                $scope.mapControl = {};
                $scope.truckIcon = "img/icons/truck-icon.png";
                $scope.manIcon = "img/icons/man-icon.png";
                $scope.movingMarkericon = $scope.manIcon;
                $scope.speedLevel = 1;
                $scope.animationSpeed = 500;
                $scope.isAnimationRunning = false;
                $scope.isResumed = false;
                $scope.isAnimationStarted = false;
                $scope.isDataLoaded = false;

                $scope.changeSpeed = function (speedValue) {
                    $scope.speedLevel = speedValue;
                    switch (speedValue) {
                        case 1:
                            $scope.animationSpeed = 500;
                            break;
                        case 2:
                            $scope.animationSpeed = 300;
                            break;
                        case 4:
                            $scope.animationSpeed = 50;
                            break;
                    }

                    if ($scope.isAnimationRunning) {
                        $scope.cancelAllTimeouts();
                        searchCoordinates($scope.movingMarkerCoords);

                    }

                };


                var polylineOptions = {
                    strokeColor: '#C83939',
                    strokeOpacity: 0,
                    strokeWeight: 4,
                    visible: $scope.showDrivingHistory,
                    icons: [{
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            fillColor: '#19b6f7',
                            fillOpacity: 1,
                            scale: 2,
                            strokeColor: '#19b6f7',
                            strokeOpacity: 1
                        },
                        repeat: '10px'
                    }]
                };

                $scope.directionsService = new google.maps.DirectionsService();
                $scope.directionsDisplay = new google.maps.DirectionsRenderer({
                    polylineOptions: polylineOptions,
                    suppressMarkers: true
                });

                $scope.streetView = new google.maps.StreetViewService();


                $scope.doRefresh = function () {

                    $scope.map.setZoom(MapConstants.zoom);
                    $scope.map.panTo(new google.maps.LatLng(MapConstants.latitude, MapConstants.longitude));
                    $scope.breadcrumbTrail = [];
                    $scope.directionsDisplay.setMap(null);

                    // if ($scope.startMarker) {
                    //     $scope.startMarker.setMap(null);
                    // }
                    //
                    // if ($scope.endMarker) {
                    //     $scope.endMarker.setMap(null);
                    // }

                    if ($scope.movingMarker) {
                        $scope.movingMarker.setMap(null);
                    }

                    if ($scope.pathPolyline) {
                        $scope.pathPolyline.setMap(null);
                    }

                    if ($scope.blackboxMarkers) {
                        for (var i = 0; i < $scope.blackboxMarkers.length; i++) {
                            $scope.blackboxMarkers[i].setMap(null);
                        }
                    }

                    if ($scope.heatmap) {
                        $scope.heatmap.setMap(null);
                    }

                    $scope.blackboxMarkers = [];
                    $scope.timeIdle = [];
                    $scope.idleTimeCount = 0;

                    var selectedDate = $localStorage.selectedDate || moment().format("YYYY-MM-DD");
                    var selectedEmployee = $localStorage.selectedEmployee.userId || 'all';

                    if (selectedEmployee === 'all') {
                        $cordovaDialogs.alert(MapMessages.breadcrumb_no_employee, '', 'Ok')
                            .then(function () {
                                $log.debug(MapMessages.breadcrumb_no_employee);
                            });

                        return;
                    }

                    $scope.incidentMarkers = [];

                    //circle indications
                    $scope.stayMarkers = [];
                    //for directions
                    $scope.waypoints = [];

                    //markers for midway stops
                    $scope.midwayStops = [];

                    $ionicLoading.show();

                    BreadcrumbService.getBreadcrumbTrail({
                        period: selectedDate
                    }, orgId, selectedEmployee)
                        .then(function (result) {

                            $ionicLoading.hide();

                            $log.debug(result);

                            if (result.data.length === 0) {
                                $cordovaDialogs.alert('No breadcrumb data for selected date', '', 'Ok')
                                    .then(function () {
                                        $log.debug("No Breadcrumb Data");
                                    });

                                return;
                            }

                            $scope.breadcrumbTrailWithoutSmooth = result.data;

                            var smoothBreadcrumb = [];

                            for (var i = 0; i < $scope.breadcrumbTrailWithoutSmooth.length; i++) {

                                var isExists = searchBreadcrumbArray(smoothBreadcrumb, $scope.breadcrumbTrailWithoutSmooth[i]);
                                if (!isExists) {
                                    smoothBreadcrumb.push($scope.breadcrumbTrailWithoutSmooth[i]);
                                }
                            }


                            $scope.breadcrumbTrail = smoothBreadcrumb;

                            $scope.polyline = [];

                            for (var j = 0; j < $scope.breadcrumbTrail.length; j++) {
                                $scope.polyline.push({
                                    lat: $scope.breadcrumbTrail[j].latitude,
                                    lng: $scope.breadcrumbTrail[j].longitude
                                });


                                (function (locationValue) {

                                    var iconOption;
                                    var marker;
                                    var activityContent;
                                    var infowindow;

                                    var position = new google.maps.LatLng({
                                        lat: locationValue.latitude,
                                        lng: locationValue.longitude
                                    });


                                    switch (locationValue.activity) {
                                        case STRINGS.BREADCRUMB_ACTIVITY_LIST.DRIVE.HARD_BRAKE:
                                        case STRINGS.BREADCRUMB_ACTIVITY_LIST.DRIVE.HARD_CORNER:
                                        case STRINGS.BREADCRUMB_ACTIVITY_LIST.DRIVE.SWERVES:
                                        case STRINGS.BREADCRUMB_ACTIVITY_LIST.DRIVE.HARD_ACCELERATION:

                                            iconOption = {
                                                url: 'img/icons/map-marker-red.png'
                                            };

                                            marker = new google.maps.Marker({
                                                position: position,
                                                map: $scope.map,
                                                options: {icon: iconOption}
                                            });

                                            activityContent = "Activity: " + getMappedActivities(locationValue.activity);

                                            infowindow = new google.maps.InfoWindow({
                                                content: activityContent
                                            });

                                            marker.addListener('click', function () {

                                                $ionicLoading.show();

                                                BreadcrumbService.getBreadcrumbTrailEventDetails(orgId, selectedEmployee, locationValue.eventId).then(function (result) {

                                                    if (result.status === 200) {
                                                        $log.debug(result);
                                                        var detailedContent = activityContent;

                                                        if (result.data) {
                                                            detailedContent += "<br>";
                                                            if (result.data.humidity) {
                                                                detailedContent += "Humidity: " + result.data.humidity;
                                                                detailedContent += "<br>";
                                                            }
                                                            if (result.data.ambientTemperature) {
                                                                detailedContent += "Ambient Temperature: " + result.data.ambientTemperature;
                                                                detailedContent += "<br>";
                                                            }
                                                            if (result.data.altitude) {
                                                                detailedContent += "Altitude: " + result.data.altitude;
                                                                detailedContent += "<br>";
                                                            }

                                                        }

                                                        infowindow.setContent(detailedContent);
                                                        infowindow.open($scope.map, marker);
                                                    }

                                                    $ionicLoading.hide();
                                                }, function () {

                                                    $ionicLoading.hide();
                                                });


                                            });
                                            $scope.blackboxMarkers.push(marker);

                                            break;


                                        case STRINGS.BREADCRUMB_ACTIVITY_LIST.WORK.SLIP:
                                        case STRINGS.BREADCRUMB_ACTIVITY_LIST.WORK.TRIP:
                                        case STRINGS.BREADCRUMB_ACTIVITY_LIST.WORK.FALL_SIDEWAYS:
                                        case STRINGS.BREADCRUMB_ACTIVITY_LIST.WORK.FALL_BACKWARDS:
                                        case STRINGS.BREADCRUMB_ACTIVITY_LIST.WORK.FALL_FORWARDS:

                                            iconOption = {
                                                url: 'img/icons/map-marker-yellow.png'
                                            };

                                            marker = new google.maps.Marker({
                                                position: position,
                                                map: $scope.map,
                                                options: {icon: iconOption}
                                            });

                                            activityContent = "Activity: " + getMappedActivities(locationValue.activity);

                                            infowindow = new google.maps.InfoWindow({
                                                content: activityContent
                                            });

                                            marker.addListener('click', function () {

                                                $ionicLoading.show();

                                                BreadcrumbService.getBreadcrumbTrailEventDetails(orgId, selectedEmployee, locationValue.eventId).then(function (result) {

                                                    if (result.status === 200) {
                                                        $log.debug(result);
                                                        var detailedContent = activityContent;

                                                        if (result.data) {
                                                            detailedContent += "<br>";
                                                            if (result.data.humidity) {
                                                                detailedContent += "Humidity: " + result.data.humidity;
                                                                detailedContent += "<br>";
                                                            }
                                                            if (result.data.ambientTemperature) {
                                                                detailedContent += "Ambient Temperature: " + result.data.ambientTemperature;
                                                                detailedContent += "<br>";
                                                            }
                                                            if (result.data.altitude) {
                                                                detailedContent += "Altitude: " + result.data.altitude;
                                                                detailedContent += "<br>";
                                                            }

                                                        }

                                                        infowindow.setContent(detailedContent);
                                                        infowindow.open($scope.map, marker);
                                                    }

                                                    $ionicLoading.hide();
                                                }, function () {

                                                    $ionicLoading.hide();
                                                });


                                            });
                                            $scope.blackboxMarkers.push(marker);

                                            break;

                                        default:
                                            var testingMarker = new google.maps.Marker({
                                                position: position,
                                                map: null,
                                                options: {
                                                    icon: {
                                                        url: 'img/icons/map-marker-green.png'
                                                    }
                                                }
                                            });

                                            if($scope.showLocationsHistory){
                                                testingMarker.setMap($scope.map);
                                            }

                                            var infoContent = "Latitude: " + locationValue.latitude + "<br>Longitude: " + locationValue.longitude;


                                            if(locationValue.gpsSpeed != null || locationValue.gpsSpeed != undefined){
                                                infoContent += "<br>Speed: " +  locationValue.gpsSpeed.toFixed(2) + " mph";
                                            }

                                            if(locationValue.gpsCourse != null || locationValue.gpsCourse != undefined){
                                                infoContent += "<br>Course: " +  locationValue.gpsCourse.toFixed(2);
                                            }


                                            var testingInfowindow = new google.maps.InfoWindow({
                                                content: infoContent
                                            });



                                            testingMarker.addListener('click', function () {
                                                testingInfowindow.open($scope.map, testingMarker);
                                            });


                                            $scope.blackboxMarkers.push(testingMarker);
                                    }


                                }($scope.breadcrumbTrail[j], j));

                            }


                            $scope.pathPolyline = new google.maps.Polyline({
                                path: $scope.polyline,
                                geodesic: true,
                                strokeColor: '#FF0000',
                                strokeOpacity: 1.0,
                                strokeWeight: 2
                            });

                            if($scope.showDrivingHistory){
                                $scope.pathPolyline.setMap($scope.map);
                            }

                            $scope.startLocation = {
                                lat: $scope.breadcrumbTrail[0].latitude,
                                lng: $scope.breadcrumbTrail[0].longitude
                            };

                            $scope.endLocation = {
                                lat: $scope.breadcrumbTrail[$scope.breadcrumbTrail.length - 1].latitude,
                                lng: $scope.breadcrumbTrail[$scope.breadcrumbTrail.length - 1].longitude
                            };
                            // $scope.startMarker = new MarkerWithLabel({
                            //     position: $scope.startLocation,
                            //     map: $scope.map,
                            //     options: {draggable: false},
                            //     labelContent: 'Start',
                            //     title: 'Start',
                            //     icon: {
                            //         url: "img/icons/play-marker.png",
                            //         size: new google.maps.Size(60,60),
                            //         scaledSize: new google.maps.Size(60,60)
                            //     }
                            // });
                            //
                            //
                            // $scope.endMarker = new MarkerWithLabel({
                            //     position: $scope.endLocation,
                            //     map: $scope.map,
                            //     options: {draggable: false},
                            //     labelContent: 'End',
                            //     title: 'End'
                            // });

                            $scope.directionsDisplay.setMap($scope.map);


                            $scope.panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'));
                            $scope.streetView.getPanorama({location: $scope.startLocation, radius: 50}, processSVData);


                            var request = {
                                origin: $scope.startLocation,
                                destination: $scope.endLocation,
                                waypoints: $scope.waypoints,
                                travelMode: 'DRIVING'
                            };


                            // $scope.directionsService.route(request, function (result, status) {
                            //     if (status === 'OK') {
                            //         $scope.directionsDisplay.setMap($scope.map);
                            //         $scope.directionsDisplay.setDirections(result);
                            //     }
                            // });

                            var bounds = new google.maps.LatLngBounds();
                            bounds.extend($scope.startLocation);
                            bounds.extend($scope.endLocation);

                            $scope.map.fitBounds(bounds);

                            var strPlay = "<div><button ng-click='playButtonClick()' class='btn btn-info'><i class='fa fa-play' aria-hidden='true'></i>Play</button></div>";
                            var compiledStrPlay = $compile(strPlay)($scope);

                            // $scope.startInfoWindow = new google.maps.InfoWindow({
                            //     content: compiledStrPlay[0]
                            // });
                            //
                            // $scope.startMarker.addListener('click', function () {
                            //     $scope.startInfoWindow.open($scope.map, $scope.startMarker);
                            // });

                            $scope.movingMarker = new google.maps.Marker({
                                position: $scope.startLocation,
                                map: $scope.map,
                                visible: true,
                                icon: {
                                    url: $scope.getMovingMarkerIcon($scope.breadcrumbTrail[0].activity),
                                    scaledSize: new google.maps.Size(40, 40),
                                    anchor: new google.maps.Point(20, 20)
                                },
                                title: 'Mover'
                            });

                            var strMovingMarkerResume = "<div><button ng-click='resumeButtonClick(movingMarkerCoords)' class='btn btn-info'><i class='fa fa-play' aria-hidden='true'></i>Resume</button></div>";
                            var strMovingMarkerPause = "<div><button ng-click='pauseButtonClick()' class='btn btn-info'><i class='fa fa-pause' aria-hidden='true'></i>Pause</button></div>";

                            $scope.compiledStrMovingMarkerResume = $compile(strMovingMarkerResume)($scope);
                            $scope.compiledStrMovingMarkerPause = $compile(strMovingMarkerPause)($scope);

                            // $scope.movingMarkerInfoWindow = new google.maps.InfoWindow({
                            //     content: $scope.compiledStrMovingMarkerPause[0]
                            // });
                            //
                            // $scope.movingMarker.addListener('click', function () {
                            //     $scope.movingMarkerInfoWindow.open($scope.map, $scope.movingMarker);
                            // });

                            $scope.isDataLoaded = true;

                            $scope.animationSliderOptions.ceil = $scope.breadcrumbTrail.length;

                            $scope.streetView.getPanorama({location: $scope.startLocation, radius: 50}, processSVData);


                        }, function () {
                            $ionicLoading.hide();
                        });

                    SupervisorOutOfBoundsService.getOutOfBounds({
                        period: selectedDate
                    }, $localStorage.orgId, selectedEmployee).then(function (result) {

                        if (result.data.length === 0) {
                            // $cordovaDialogs.alert(MapMessages.supervisor_out_of_bounds_no_data, '', 'Ok')
                            //     .then(function () {
                            //         $log.debug(MapMessages.supervisor_out_of_bounds_no_data);
                            //     });

                            return;
                        }


                        $scope.getOutOfBounds = result.data;
                        var pointsArray = [];

                        for (var i = 0; i < $scope.getOutOfBounds.length; i++) {
                            var location = new google.maps.LatLng($scope.getOutOfBounds[i].lat, $scope.getOutOfBounds[i].long);
                            pointsArray.push(location);
                        }


                        $scope.heatmap = new google.maps.visualization.HeatmapLayer({
                            data: pointsArray,
                            map: $scope.map
                        });


                    }, function () {

                        $cordovaDialogs.alert(MapMessages.out_of_bounds_load_failed, '', 'Ok')
                            .then(function () {
                                $log.debug(MapMessages.out_of_bounds_load_failed);
                            });


                    });


                };


                $scope.doRefresh();

                $scope.activityMarkerClicked = function (marker) {
                    $scope.streetviewCords = {latitude: marker.latitude, longitude: marker.longitude};
                    $log.debug($scope.streetviewCords);

                };


                // $scope.movingMarkerEvents = {
                //     click: function () {
                //
                //         $scope.movingIconWindowClicked = true;
                //     }
                // };
                //
                // $scope.closeMovingMarkerWindow = function () {
                //
                //     $scope.movingIconWindowClicked = false;
                // };

                $scope.cancelAllTimeouts = function () {
                    $scope.isAnimationRunning = false;
                    for (var j = 0; j < $scope.timeIdle.length; j++) {
                        $timeout.cancel($scope.timeIdle[j]);
                    }
                };

                $scope.startAnimation = function(){
                    if($scope.isAnimationStarted){
                        $scope.resumeButtonClick($scope.movingMarkerCoords);
                    }
                    else{
                        $scope.playButtonClick();
                        $scope.isAnimationStarted = true;
                    }
                };

                $scope.playButtonClick = function () {
                    $scope.map.setZoom(18);
                    $scope.isResumed = true;
                    // $scope.movingMarkerInfoWindow.setContent($scope.compiledStrMovingMarkerPause[0]);
                    // $scope.startInfoWindow.close();
                    $scope.cancelAllTimeouts();
                    $scope.movingMarker.setVisible(true);
                    playAnimation(0);
                };


                $scope.resumeButtonClick = function (coordinates) {
                    $log.debug(coordinates);
                    $scope.isResumed = true;
                    // $scope.movingMarkerInfoWindow.close();
                    // $scope.movingMarkerInfoWindow.setContent($scope.compiledStrMovingMarkerPause[0]);
                    searchCoordinates(coordinates);

                };

                $scope.pauseButtonClick = function () {

                    $scope.isResumed = false;
                    // $scope.movingMarkerInfoWindow.setContent($scope.compiledStrMovingMarkerResume[0]);
                    $scope.cancelAllTimeouts();

                };

                function processSVData(data, status) {
                    if (status === 'OK') {

                        $scope.panorama.setPano(data.location.pano);
                        $scope.panorama.setPov({
                            heading: 0,
                            pitch: 0
                        });
                        $scope.panorama.setVisible(true);


                    } else {
                        $log.debug('Street View data not found for this location.');
                    }

                }


                function searchCoordinates(coordinates) {
                    if (coordinates !== $scope.breadcrumbTrail[$scope.breadcrumbTrail.length - 1]) {
                        for (var i = 0; i < $scope.breadcrumbTrail.length; i++) {
                            if (coordinates === $scope.breadcrumbTrail[i]) {

                                playAnimation(++i);
                                break;
                            }
                        }
                    }
                    else {
                        playAnimation(0);
                    }

                }


                function playAnimation(position) {
                    $scope.isAnimationRunning = true;
                    var initCount = 0;

                    // $scope.movingMarker.setVisible(true);
                    for (var i = position; i < $scope.breadcrumbTrail.length; i++) {
                        var location = $scope.breadcrumbTrail[i];

                        (function (locationValue) {
                            $scope.timeIdle[$scope.idleTimeCount++] = $timeout(function () {
                                /*jshint maxcomplexity:30 */
                                var locationLatLng = new google.maps.LatLng(locationValue.latitude, locationValue.longitude);


                                $scope.movingMarker.setPosition(locationLatLng);
                                $scope.movingMarkerCoords = locationValue;

                                $scope.map.panTo(locationLatLng);

                                $scope.movingMarker.setIcon({url: $scope.getMovingMarkerIcon(locationValue.activity)});

                                $scope.streetView.getPanorama({location: locationLatLng, radius: 50}, processSVData);

                            }, initCount++ * $scope.animationSpeed);
                        }(location));
                    }
                    $scope.timeIdle[$scope.idleTimeCount++] = $timeout(function () {
                        $scope.movingMarker.setPosition(null);
                        $scope.isAnimationRunning = false;
                        $scope.isAnimationStarted = false;
                        $scope.isResumed = false;

                    }, initCount * $scope.animationSpeed);
                }

                $scope.drivingFilterChanged = function (check) {
                    if (check) {
                        $scope.directionsDisplay.setMap($scope.map);
                        $scope.pathPolyline.setMap($scope.map);
                    }
                    else {
                        $scope.directionsDisplay.setMap(null);
                        $scope.pathPolyline.setMap(null);
                    }
                    $scope.showDrivingHistory = check;

                };

                $scope.locationsFilterChanged = function (check) {
                    $scope.showLocationsHistory = check;

                    if ($scope.showLocationsHistory) {
                        // $scope.startMarker.setMap($scope.map);
                        // $scope.endMarker.setMap($scope.map);
                        for (var i = 0; i < $scope.blackboxMarkers.length; i++) {
                            $scope.blackboxMarkers[i].setMap($scope.map);
                        }
                    }
                    else {
                        // $scope.startMarker.setMap(null);
                        // $scope.endMarker.setMap(null);
                        for (var i = 0; i < $scope.blackboxMarkers.length; i++) {
                            $scope.blackboxMarkers[i].setMap(null);
                        }
                    }

                };

                $scope.outOfBoundsFilterChanged = function (check) {
                    $scope.showOutOfBoundsHistory = check;

                    if ($scope.showOutOfBoundsHistory) {
                        $scope.heatmap.setMap($scope.map);
                    }
                    else {
                        $scope.heatmap.setMap(null);
                    }

                };


                $scope.filterBreadcrumb = function () {
                    $ionicPopup.show({
                        templateUrl: "templates/supervisorbreadcrumbmapfilter.html",
                        scope: $scope,
                        cssClass: 'map-filter',
                        buttons: [
                            {
                                text: '<b>Close</b>',
                                type: 'btn btn-info'
                            }
                        ]
                    });

                };

                $scope.showStreetview = function (checked) {
                    $scope.showingStreetview = !checked;
                };

                $scope.showCalendar = function () {
                    var ipObj1 = {
                        callback: function (val) {
                            $log.debug('Return value from the datepicker popup is : ' + val, new Date(val));
                        }
                    };
                    ionicDatePicker.openDatePicker(ipObj1);

                };

                function searchBreadcrumbArray(array, object) {

                    for (var i = 0; i < array.length; i++) {

                        if (array[i].latitude === object.latitude && array[i].longitude === object.longitude) {
                            return true;
                        }
                    }
                    return false;
                }

                $scope.getMovingMarkerIcon = function (activity) {

                    var movingMarkerIcon = $scope.manIcon;
                    switch (activity) {

                        case STRINGS.BREADCRUMB_ACTIVITY_LIST.DRIVE.DRIVING:
                        case STRINGS.BREADCRUMB_ACTIVITY_LIST.DRIVE.GETTING_IN_VEHICLE:
                        case STRINGS.BREADCRUMB_ACTIVITY_LIST.DRIVE.GETTING_OUT_VEHIVLE:
                            movingMarkerIcon = $scope.truckIcon;
                            break;


                        case STRINGS.BREADCRUMB_ACTIVITY_LIST.DRIVE.HARD_BRAKE:
                        case STRINGS.BREADCRUMB_ACTIVITY_LIST.DRIVE.HARD_CORNER:
                        case STRINGS.BREADCRUMB_ACTIVITY_LIST.DRIVE.SWERVES:
                        case STRINGS.BREADCRUMB_ACTIVITY_LIST.DRIVE.HARD_ACCELERATION:
                            movingMarkerIcon = $scope.truckIcon;
                            break;

                        default:
                            movingMarkerIcon = $scope.manIcon;
                    }

                    return movingMarkerIcon;

                };

                function getMappedActivities(activity) {

                    switch (activity) {

                        case STRINGS.BREADCRUMB_ACTIVITY_LIST.DRIVE.HARD_BRAKE:
                            return STRINGS.BREADCRUMB_ACTIVITY_LIST.DRIVE.HARD_BRAKE_MAP;

                        case STRINGS.BREADCRUMB_ACTIVITY_LIST.DRIVE.HARD_CORNER:
                            return STRINGS.BREADCRUMB_ACTIVITY_LIST.DRIVE.HARD_CORNER_MAP;

                        case STRINGS.BREADCRUMB_ACTIVITY_LIST.DRIVE.HARD_ACCELERATION:
                            return STRINGS.BREADCRUMB_ACTIVITY_LIST.DRIVE.HARD_ACCELERATION_MAP;

                        case STRINGS.BREADCRUMB_ACTIVITY_LIST.DRIVE.SWERVES:
                            return STRINGS.BREADCRUMB_ACTIVITY_LIST.DRIVE.SWERVES_MAP;


                        case STRINGS.BREADCRUMB_ACTIVITY_LIST.WORK.WORKING_FROM_HEIGHTS:
                            return STRINGS.BREADCRUMB_ACTIVITY_LIST.DRIVE.WORKING_FROM_HEIGHTS_MAP;

                        case STRINGS.BREADCRUMB_ACTIVITY_LIST.WORK.FALL_SIDEWAYS:
                            return STRINGS.BREADCRUMB_ACTIVITY_LIST.DRIVE.FALL_SIDEWAYS_MAP;

                        case STRINGS.BREADCRUMB_ACTIVITY_LIST.WORK.FALL_BACKWARDS:
                            return STRINGS.BREADCRUMB_ACTIVITY_LIST.DRIVE.FALL_BACKWARDS_MAP;

                        case STRINGS.BREADCRUMB_ACTIVITY_LIST.WORK.FALL_FORWARDS:
                            return STRINGS.BREADCRUMB_ACTIVITY_LIST.DRIVE.FALL_FORWARDS_MAP;

                        default:
                            return activity;
                    }


                }

            }]);
})();
