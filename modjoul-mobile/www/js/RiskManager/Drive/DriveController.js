/* global angular */
/* global console */
/* global moment */
/* global Highcharts */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
(function () {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('RiskManagerDriveController', ['$scope', '$state', 'RiskManagerMetricsService', '$localStorage',
            'STRINGS', '$ionicLoading', '$ionicPopup', 'ionicDatePicker',
            function ($scope, $state, RiskManagerMetricsService, $localStorage, STRINGS, $ionicLoading,
                      $ionicPopup, ionicDatePicker) {

                $scope.strings = STRINGS;

                $scope.$on('dateSelected', function () {
                    $scope.doRefresh();
                });

                $scope.$on('locationSelected', function () {
                    $scope.doRefresh();
                });

                var selectedType = STRINGS.TYPESEGMENTS[0];
                $scope.selectedType = STRINGS.RISKMANAGERTREND[0];


                $scope.segmentClicked = function ($index) {
                    // selectedType = STRINGS.RISKMANAGERTREND[$index];
                    $scope.selectedType = STRINGS.RISKMANAGERTREND[$index];
                    $scope.$apply();
                };

                $scope.doRefresh = function () {

                    var orgId = $localStorage.orgId;
                    // var userId = $localStorage.selectedEmployee ? $localStorage.selectedEmployee.id : null;
                    var locationId = $localStorage.selectedLocation.locationId;

                    var selectedDate = $localStorage.selectedDate || moment().subtract(1, "days").format("YYYY-MM-DD");
                    var startDate = moment(selectedDate, "YYYY-MM-DD").subtract(STRINGS.DATES.DAYS, "days").format("YYYY-MM-DD");

                    // var summaryParams = {period: selectedDate};
                    var responseCount = 0;
                    $scope.driveSummarySegs = {};
                    $scope.driveSummaryUnitSegs = {};


                    var getData = function () {

                        RiskManagerMetricsService.getDriveMetrics({period: selectedDate}, orgId, locationId)
                            .then(function (result) {
                                console.log(result);
                                $scope.driveSummary = result.data.activities;
                                $scope.driveSummaryUnits = result.data.units;


                                RiskManagerMetricsService.getDriveMetricsTimeSeries({
                                    start: startDate,
                                    end: selectedDate
                                }, orgId, locationId)
                                    .then(function (result) {

                                        console.log(result);
                                        $scope.driveTimeSeries = result.data.activities;
                                        $scope.driveTimeSeriesUnits = result.data.units;
                                        console.log($scope.workFoundationSeries);

                                        checkAndHideProgressHUD();

                                    }, function (error) {
                                        checkAndHideProgressHUD();
                                        console.log(error);
                                    });

                            }, function (error) {
                                checkAndHideProgressHUD();
                                console.log(error);
                            });
                    };

                    function checkAndHideProgressHUD() {
                        $ionicLoading.hide();
                        $scope.$broadcast('scroll.refreshComplete');

                    }


                    // $ionicLoading.show();

                    // getData();

                };

                $scope.doRefresh();

                $scope.showDriveGraph = function (type) {

                    var chartTimestamps = [];
                    var chartValues = [];
                    var dataArray = [];

                    if (type === 'driving distance') {
                        dataArray = Array.from(($scope.driveTimeSeries["drive-time"]) ? $scope.driveTimeSeries["drive-time"].driving.DrivingDistance : []);
                        dataArray.reverse();
                        $scope.chartMetric = ($scope.driveTimeSeries["drive-time"]) ? STRINGS.DISTANCE + ' (' + $scope.driveTimeSeriesUnits["drive-time"].driving.DrivingDistance + ')' : STRINGS.DISTANCE;
                        $scope.unit = ($scope.driveTimeSeries["drive-time"]) ? '(' + $scope.driveTimeSeriesUnits["drive-time"].driving.DrivingDistance + ')' : '';
                        $scope.headerFormat = "Distance Driven";
                        $scope.chartTitle = "Total Miles Driven";
                    }
                    else if (type === 'driving time') {
                        dataArray = Array.from(($scope.driveTimeSeries["drive-time"]) ? $scope.driveTimeSeries["drive-time"].driving.DrivingTime : []);
                        dataArray.reverse();
                        $scope.chartMetric = ($scope.driveTimeSeries["drive-time"]) ? STRINGS.DURATION + ' (' + $scope.driveTimeSeriesUnits["drive-time"].driving.DrivingTime + ')' : STRINGS.DURATION;
                        $scope.unit = ($scope.driveTimeSeries["drive-time"]) ? '(' + $scope.driveTimeSeriesUnits["drive-time"].driving.DrivingTime + ')' : '';
                        $scope.headerFormat = "Hours Driven";
                        $scope.chartTitle = "Total Time Driving";

                    }
                    else if (type === 'aggressive events') {
                        dataArray = Array.from(($scope.driveTimeSeries["aggressive-events"]) ? $scope.driveTimeSeries["aggressive-events"].summary.AggressiveEventsCount : []);
                        dataArray.reverse();
                        $scope.chartMetric = STRINGS.COUNT;
                        $scope.unit = '';
                        $scope.headerFormat = "Events Occurred";
                        $scope.chartTitle = "Driving Safety Events";
                    }
                    else if (type === 'brakes') {
                        dataArray = Array.from(($scope.driveTimeSeries["aggressive-events"]) ? $scope.driveTimeSeries["aggressive-events"]["hard-brake"].BrakeCount : []);
                        dataArray.reverse();
                        $scope.chartMetric = STRINGS.COUNT;
                        $scope.unit = '';
                        $scope.headerFormat = "Brake Occured";
                        $scope.chartTitle = "Brakes Count";
                    }
                    else if (type === 'hard corners') {
                        dataArray = Array.from(($scope.driveTimeSeries["aggressive-events"]) ? $scope.driveTimeSeries["aggressive-events"]["hard-corner"].HardCornersCount : []);
                        dataArray.reverse();
                        $scope.chartMetric = STRINGS.COUNT;
                        $scope.unit = '';
                        $scope.headerFormat = "Hard Corners Occured";
                        $scope.chartTitle = "Hard Corners Count";
                    }
                    else if (type === 'swerves') {
                        dataArray = Array.from(($scope.driveTimeSeries["aggressive-events"]) ? $scope.driveTimeSeries["aggressive-events"].swerve.SwervesCount : []);
                        dataArray.reverse();
                        $scope.chartMetric = STRINGS.COUNT;
                        $scope.unit = '';
                        $scope.headerFormat = "Swerves Occured";
                        $scope.chartTitle = "Swerves Count";
                    }
                    else if (type === 'acceleration') {
                        dataArray = Array.from(($scope.driveTimeSeries["aggressive-events"]) ? $scope.driveTimeSeries["aggressive-events"]["hard-acceleration"].HardAccelerationCount : []);
                        dataArray.reverse();
                        $scope.chartMetric = STRINGS.COUNT;
                        $scope.unit = '';
                        $scope.headerFormat = "Hard Acceleration Occured";
                        $scope.chartTitle = "Hard Acceleration Count";
                    }
                    else if (type === 'over-speed') {
                        dataArray = Array.from(($scope.driveTimeSeries["aggressive-events"]) ? $scope.driveTimeSeries["aggressive-events"]["over-speed"].OverSpeedLimitPercentage : []);
                        dataArray.reverse();
                        $scope.chartMetric = STRINGS.COUNT;
                        $scope.unit = '';
                        $scope.headerFormat = "Events";
                        $scope.chartTitle = "Over Speed Limit Percentage";
                    }

                    for (var i = 0; i < dataArray.length; i++) {
                        chartTimestamps.push(dataArray[i].date);
                        chartValues.push(dataArray[i].value);
                    }

                    $scope.chartTimestamps = chartTimestamps;
                    $scope.chartValues = chartValues;

                    $scope.chartData = {values: $scope.chartValues, data: $scope.chartTimestamps};

                    $scope.graphOptions = {
                        "tooltipHeader": "<b>Aggressive Drive Time</b><br/>",
                        "color": "#0085c3", metric: $scope.chartMetric, format: $scope.headerFormat, units: $scope.unit,
                    };

                    $scope.graph = {data: $scope.chartData, options: $scope.graphOptions};
                    $ionicPopup.show({
                        templateUrl: "templates/graphs/columns-graph.html",
                        scope: $scope,
                        cssClass: 'popup-graph',
                        title: $scope.chartTitle,
                        buttons: [
                            {
                                text: '<b>Close</b>',
                                type: 'btn btn-info'
                            }
                        ]
                    });
                };

                var todayDate = moment();
                var maxDate = moment().add(1, "years");
                var minimumDate = moment().subtract(1, "years");

                $scope.selectStartDate = function () {
                    var dateObject = {
                        callback: function (val) {
                            $scope.startDate = moment(val, "x");
                            var startDate = $scope.startDate.format("YYYY-MM-DD");

                            $scope.startDateText = startDate;
                        },
                        from: new Date(minimumDate.format('YYYY'), minimumDate.format('M') - 1, minimumDate.format('D')),
                        to: new Date(maxDate.format('YYYY'), maxDate.format('M') - 1, maxDate.format('D')),
                        inputDate: new Date(todayDate.format('YYYY'), todayDate.format('M') - 1, todayDate.format('D'))
                    };

                    ionicDatePicker.openDatePicker(dateObject);

                };

                $scope.selectEndDate = function () {

                    var dateObject = {
                        callback: function (val) {
                            $scope.endDate = moment(val, "x");
                            $scope.endDateText = $scope.endDate.format("YYYY-MM-DD");
                        },
                        from: new Date($scope.startDate.format('YYYY'), $scope.startDate.format('M') - 1, $scope.startDate.format('D')),
                        to: new Date(maxDate.format('YYYY'), maxDate.format('M') - 1, maxDate.format('D')),
                        inputDate: new Date(todayDate.format('YYYY'), todayDate.format('M') - 1, todayDate.format('D'))
                    };

                    ionicDatePicker.openDatePicker(dateObject);

                };

                $scope.getTrendAnalysis = function () {
                    var orgId = $localStorage.orgId;
                    var locationId = $localStorage.selectedLocation.locationId;

                    $ionicLoading.show();

                    RiskManagerMetricsService.getDriveTrendAnalysis({
                        start: $scope.startDateText,
                        end: $scope.endDateText,
                        type: 'daily'
                    }, orgId, locationId)
                        .then(function (result) {
                            $ionicLoading.hide();
                            $scope.driveTrendAnalysis = result.data.activities;

                            var dataArray = {};
                            dataArray.labels = [];

                            var series = [];

                            var aggressiveEventsArray = [];
                            var totalAggressiveEvents = $scope.driveTrendAnalysis["aggressive-events"] ? $scope.driveTrendAnalysis["aggressive-events"].summary.AggressiveEventsCount : [];

                            for (var i = 0; i < totalAggressiveEvents.length; i++) {
                                dataArray.labels.push(totalAggressiveEvents[i].date);
                                aggressiveEventsArray.push(totalAggressiveEvents[i].value);
                            }

                            dataArray.labels.reverse();
                            series.push({
                                name: "Driving Safety",
                                data: aggressiveEventsArray.reverse()
                            });

                            Highcharts.chart('drive-trend-chart', {
                                colors: ['#F99D1C', '#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee',
                                    '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
                                chart: {
                                    type: 'line',
                                    backgroundColor: 'transparent'
                                },
                                title: {
                                    text: ''
                                },

                                xAxis: {
                                    categories: dataArray.labels,
                                    style: {
                                        color: '#ffffff'
                                    },
                                    labels: {
                                        style: {
                                            color: '#ffffff'
                                        }
                                    }
                                },
                                noData: {
                                    style: {
                                        color: "#ffffff"
                                    }
                                },
                                yAxis: {
                                    title: {
                                        text: STRINGS.COUNT,
                                        style: {
                                            color: '#ffffff'
                                        }
                                    },
                                    labels: {
                                        style: {
                                            color: '#ffffff'
                                        }
                                    },
                                    gridLineColor: 'transparent'
                                },
                                legend: {
                                    enabled: true,
                                    itemStyle: {
                                        color: '#fff'
                                    }

                                },
                                credits: {
                                    enabled: false
                                },
                                series: series

                            });


                            // $scope.showChart(STRINGS.TREND_WORK_INCIDENTS);
                        }, function (error) {
                            $ionicLoading.hide();
                        });

                };

            }]);
})();
