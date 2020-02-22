/* global angular */
/* global console */
/* global google */
/* global document */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
/* jshint loopfunc:true */
(function () {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('DashboardController', ['$scope', 'MapConstants', '$state', '$compile', '$ionicModal', '$ionicPopup',
          '$localStorage', '$rootScope', 'LocationService', '$ionicLoading', function ($scope, MapConstants, $state, $compile,
                                         $ionicModal, $ionicPopup, $localStorage, $rootScope, LocationService, $ionicLoading) {



                $scope.$on("$ionicView.beforeEnter", function() {
                  $scope.$emit('navbarHideEvent', false);
                });

                console.log("Loading page");
                $scope.mapRadius = MapConstants.zoom;

                $scope.center = new google.maps.LatLng(MapConstants.latitude, MapConstants.longitude);

                $scope.map = new google.maps.Map(document.getElementById('dashboardMap'), {
                    zoom: $scope.mapRadius,
                    center: $scope.center,
                    streetViewControl: false

                });


                $scope.mapControl = [];
                $scope.markers = [];
                $scope.circles = [];

                $scope.showCities = true;


                $scope.sizeParam = new google.maps.Size(30, 30);
                $scope.movingIconAnchor = new google.maps.Point(15, 15);


                $scope.map.addListener('zoom_changed', function () {
                    /*jshint maxcomplexity:30 */
                    var zoomLevel = $scope.map.getZoom();
                    if (zoomLevel === 0) {
                        zoomLevel = 1;
                    }
                    var zoomInTimes = 1;

                    switch (zoomLevel) {
                        case 1:
                            zoomInTimes = 1;
                            break;
                        case 2:
                            zoomInTimes = 1;
                            break;
                        case 3:
                            zoomInTimes = 1;
                            break;
                        case 4:
                            zoomInTimes = 1;
                            break;
                        case 5:
                            zoomInTimes = 2;
                            break;
                        case 6:
                            zoomInTimes = 3;
                            break;
                        case 7:
                            zoomInTimes = 6;
                            break;
                        case 8:
                            zoomInTimes = 10;
                            break;
                        case 9:
                            zoomInTimes = 20;
                            break;
                        case 10:
                            zoomInTimes = 30;
                            break;
                        case 11:
                            zoomInTimes = 50;
                            break;
                        case 12:
                            zoomInTimes = 100;
                            break;
                        case 13:
                            zoomInTimes = 200;
                            break;
                        case 14:
                            zoomInTimes = 300;
                            break;
                        case 15:
                            zoomInTimes = 400;
                            break;
                        case 16:
                            zoomInTimes = 800;
                            break;
                        case 17:
                            zoomInTimes = 1200;
                            break;
                        case 18:
                            zoomInTimes = 1600;
                            break;
                        case 19:
                            zoomInTimes = 2500;
                            break;
                        case 20:
                            zoomInTimes = 4900;
                            break;
                        case 21:
                            zoomInTimes = 8100;
                            break;

                    }

                    for (var i = 0; i < $scope.circles.length; i++) {
                        var radius = (20000 * $scope.circles[i].intensity * 100) / (zoomLevel * zoomInTimes);
                        $scope.circles[i].setRadius(radius);

                    }

                });


                $ionicLoading.show();
                LocationService.getLocations()
                    .then(function (result) {

                        if (!$localStorage.selectedLocation && result.data.length > 0)
                        {
                          $localStorage.selectedLocation = result[0];
                        }

                        $scope.warehouseLocations = result.data;

                        console.log($scope.warehouseLocations);

                        $scope.bounds = new google.maps.LatLngBounds();

                        for (var i = 0; i < $scope.warehouseLocations.length; i++) {


                            (function (warehouseData, count) {


                                var iconOption = {
                                    url: 'img/icons/warehouse.png',
                                    scaledSize: new google.maps.Size(20, 20),
                                    anchor: new google.maps.Point(10, 10)
                                };

                                if(warehouseData.lat || warehouseData.long){

                                var position = new google.maps.LatLng({
                                    lat: warehouseData.lat,
                                    lng: warehouseData.long
                                });

                                if (warehouseData.radius !== undefined) {

                                    var fillColor;
                                    fillColor = '#C50808';
                                    // if (warehouseData.intensity <= 30) {
                                    //     fillColor = '#54AA09';
                                    // }
                                    // else if (warehouseData.intensity > 30 && warehouseData.intensity <= 65) {
                                    //     fillColor = '#F99D1C';
                                    // }
                                    // else if (warehouseData.intensity > 65 && warehouseData.intensity <= 100) {
                                    //     fillColor = '#C50808';
                                    // }

                                    var cityCircle = new google.maps.Circle({
                                        strokeColor: '#FF0000',
                                        strokeOpacity: 0,
                                        strokeWeight: 2,
                                        fillColor: fillColor,
                                        fillOpacity: 0.35,
                                        map: $scope.map,
                                        center: position,
                                        radius: (20000 * warehouseData.radius * 100) / ($scope.mapRadius),
                                        intensity: warehouseData.radius
                                    });

                                    $scope.circles.push(cityCircle);

                                }


                                $scope.bounds.extend(position);


                                var marker = new google.maps.Marker({
                                    position: position,
                                    map: $scope.map,
                                    options: {icon: iconOption}
                                });

                                var contentString = "Name: " + warehouseData.locationName;


                                if (warehouseData.metrics !== undefined) {

                                    var contentString2 = "";

                                    if (warehouseData.metrics.AggressiveEventsCount !== undefined) {
                                        contentString2 += "<br>Aggressive Events: " + warehouseData.metrics.AggressiveEventsCount;

                                    }

                                    if (warehouseData.metrics.NearMissWork !== undefined) {
                                        contentString2 += "<br>Near Miss Work: " + warehouseData.metrics.NearMissWork;

                                    }


                                    if (warehouseData.metrics.TotalIdleTime !== undefined) {
                                        contentString2 += "<br>Belt Lying On Table: " + warehouseData.metrics.TotalIdleTime.toFixed(2);

                                    }


                                    if (warehouseData.metrics.WorkTime !== undefined) {
                                        contentString2 += "<br>Work Time: " + warehouseData.metrics.WorkTime.toFixed(2);

                                    }


                                    contentString += contentString2;
                                }


                                var infowindow = new google.maps.InfoWindow({
                                    content: contentString
                                });

                                marker.addListener('click', function () {
                                    infowindow.open($scope.map, marker);
                                });

                                $scope.markers.push(marker);

                                if (count === ($scope.warehouseLocations.length - 1)) {
                                    $scope.map.fitBounds($scope.bounds);
                                }

                                }


                            })($scope.warehouseLocations[i], i);

                        }
                      console.log("Locations fetched");
                      $ionicLoading.hide();
                    }, function (error) {
                        console.log(error);
                        console.log("Locations fetch failed");
                        $ionicLoading.hide();
                    });


                $scope.reloadMap = function () {
                    $scope.showCities = true;
                    $scope.map.setZoom(4);
                    $scope.map.panTo($scope.center);
                    $scope.markerCluster.setMap(null);
                    $scope.markerCluster = null;

                    if ($scope.markers.length !== 0) {
                        for (var i = 0; i < $scope.markers.length; i++) {
                            $scope.markers[i].setMap(null);
                            //$scope.markers[i] = null;
                            $scope.circles[i].setMap(null);
                        }
                        $scope.markers = [];
                        $scope.circles = [];

                    }

                };


            }]);
})();
