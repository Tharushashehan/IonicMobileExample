/* global angular */
/* global console */
/* global Highcharts */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
(function () {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('StatisticsController', ['$scope', '$state', 'OrgManagementService', '$localStorage', '$ionicLoading',
            '$ionicModal', '$cordovaDialogs', 'MESSAGES', 'STRINGS',
            function ($scope, $state, OrgManagementService, $localStorage, $ionicLoading, $ionicModal, $cordovaDialogs,
                      MESSAGES, STRINGS) {

                var orgId = $localStorage.orgId;
                var role = $localStorage.profile.role;

                $scope.messages = MESSAGES;

                $scope.isRiskManager = false;

                if(role != 'supervisor'){
                    $scope.$on("$ionicView.beforeEnter", function () {
                        $scope.$emit('navbarHideEvent', true);

                    });
                }



                $scope.loadLocations = function () {

                    $ionicLoading.show();

                    OrgManagementService.getLocations(orgId)
                        .then(function (result) {
                            $ionicLoading.hide();
                            console.log(result);
                            $scope.locations = result.data;


                            OrgManagementService.getLocationCount(orgId)
                                .then(function (resultCount) {

                                    $ionicLoading.hide();
                                    $scope.$broadcast('scroll.refreshComplete');

                                    $scope.locationCount = resultCount.data;

                                    var locationStats = [];


                                    for (var i = 0; i < $scope.locations.length; i++) {

                                        var count = 0;

                                        for (var j = 0; j < $scope.locationCount.length; j++) {
                                            if ($scope.locations[i].locationId === $scope.locationCount[j].locationId) {
                                                count++;
                                                locationStats.push({
                                                    name: $scope.locations[i].locationName,
                                                    y: $scope.locationCount[j].userCount
                                                });

                                            }

                                        }

                                        if (count === 0) {
                                            locationStats.push({
                                                name: $scope.locations[i].locationName,
                                                y: 0
                                            });
                                        }
                                    }

                                    $scope.locationCount = locationStats;


                                    Highcharts.chart('org-location-statistics', {
                                        chart: {
                                            backgroundColor: "transparent",
                                            plotBackgroundColor: null,
                                            plotBorderWidth: null,
                                            plotShadow: false,
                                            type: 'pie'
                                        },
                                        colors: [STRINGS.COLORS.MODJOUL_ORANGE, STRINGS.COLORS.MODJOUL_GREEN, STRINGS.COLORS.MODJOUL_BLUE, STRINGS.COLORS.MODJOUL_GRAY,STRINGS.COLORS.MODJOUL_RED,STRINGS.COLORS.MODJOUL_PINK, STRINGS.COLORS.MODJOUL_BROWN, STRINGS.COLORS.MODJOUL_YELLOW],
                                        title: {
                                            text: 'Location Statistics',
                                            style: {
                                                color: '#FFFFFF'
                                            }
                                        },
                                        tooltip: {
                                            pointFormat: '<b>{point.percentage:.1f}%</b><br>Users: {point.y}'
                                        },
                                        plotOptions: {
                                            pie: {
                                                allowPointSelect: true,
                                                cursor: 'pointer',
                                                dataLabels: {
                                                    enabled: false
                                                },
                                                showInLegend: true
                                            }
                                        },
                                        credits: {
                                            enabled: false
                                        },
                                        legend: {
                                            itemStyle: {
                                                color: '#fff'
                                            }
                                        },
                                        series: [{
                                            name: 'Locations',
                                            colorByPoint: true,
                                            data: locationStats
                                        }]
                                    });


                                }, function (error) {
                                    $scope.$broadcast('scroll.refreshComplete');
                                    $ionicLoading.hide();
                                    console.log(error);
                                });


                        }, function (error) {
                            $scope.$broadcast('scroll.refreshComplete');
                            $ionicLoading.hide();
                            console.log(error);
                        });
                };


                $scope.loadJobFunctionStats = function () {

                    OrgManagementService.getJobFunctionCount(orgId)
                        .then(function (result) {

                            $ionicLoading.hide();
                            $scope.$broadcast('scroll.refreshComplete');

                            $scope.jobCounts = result.data;

                            var jobStats = [];


                            for (var i = 0; i < $scope.jobCounts.length; i++) {
                                jobStats.push({
                                    name: $scope.jobCounts[i].jobFunction,
                                    y: $scope.jobCounts[i].userCount
                                });

                            }

                            $scope.jobFunctionCount = jobStats;

                            Highcharts.chart('org-job-statistics', {
                                colors: [STRINGS.COLORS.MODJOUL_ORANGE, STRINGS.COLORS.MODJOUL_GREEN, STRINGS.COLORS.MODJOUL_BLUE, STRINGS.COLORS.MODJOUL_GRAY,STRINGS.COLORS.MODJOUL_RED,STRINGS.COLORS.MODJOUL_PINK, STRINGS.COLORS.MODJOUL_BROWN, STRINGS.COLORS.MODJOUL_YELLOW],
                                chart: {
                                    backgroundColor: "transparent",
                                    plotBackgroundColor: null,
                                    plotBorderWidth: null,
                                    plotShadow: false,
                                    type: 'pie'
                                },
                                title: {
                                    text: 'Job Statistics',
                                    style: {
                                        color: '#FFFFFF'
                                    }
                                },
                                tooltip: {
                                    pointFormat: '<b>{point.percentage:.1f}%</b><br>Users: {point.y}'
                                },
                                plotOptions: {
                                    pie: {
                                        allowPointSelect: true,
                                        cursor: 'pointer',
                                        dataLabels: {
                                            enabled: false
                                        },
                                        showInLegend: true
                                    }
                                },
                                credits: {
                                    enabled: false
                                },
                                legend: {
                                    itemStyle: {
                                        color: '#fff'
                                    }
                                },
                                series: [{
                                    name: 'Locations',
                                    colorByPoint: true,
                                    data: jobStats
                                }]
                            });


                        }, function (error) {
                            $scope.$broadcast('scroll.refreshComplete');
                            $ionicLoading.hide();
                            console.log(error);
                        });
                };


                $scope.loadLocations();

                $scope.doRefresh = function () {
                    $scope.loadLocations();

                    if (role === 'risk_manager') {
                        $scope.loadJobFunctionStats();
                    }
                };



                if (role === 'risk_manager') {
                    $scope.isRiskManager = true;
                    $scope.loadJobFunctionStats();
                }

            }]);
})();
