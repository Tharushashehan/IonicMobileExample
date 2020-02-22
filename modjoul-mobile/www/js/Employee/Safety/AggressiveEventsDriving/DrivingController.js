/* global angular */
/* global console */
/* global moment */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
/* jshint sub:true */
/* jshint shadow:true */

(function () {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('SafetyDrivingCtrl', ['$scope', '$localStorage', 'AggressiveEventsService', '$ionicLoading',
            '$ionicPopup', '$timeout', 'STRINGS',
            function ($scope, $localStorage, AggressiveEventsService, $ionicLoading, $ionicPopup, $timeout, STRINGS) {

                $scope.strings = STRINGS;
                $scope.triggerValue = 1;

                $scope.$on('dateSelected', function () {
                    $scope.doRefresh();
                });

                var selectedType = STRINGS.TYPESEGMENTS[0];

                $scope.segmentClicked = function ($index) {
                    selectedType = STRINGS.TYPESEGMENTS[$index];
                    $scope.aggressiveEvents = $scope.aggressiveEventSegs[selectedType];
                    $scope.aggressiveEventsUnits = $scope.aggressiveEventUnitsSegs[selectedType];

                    $scope.$apply();
                };

                $scope.doRefresh = function () {

                    $scope.triggerValue += 1;

                    var selectedDate = $localStorage.selectedDate || moment().format("YYYY-MM-DD");
                    var seriesParams = {period: selectedDate};
                    var summaryParams = {period: selectedDate};
                    var orgId = $localStorage.orgId;
                    var userId = $localStorage.userId;
                    var responseCount = 0;

                    $scope.aggressiveEventSegs = {};
                    $scope.aggressiveEventUnitsSegs = {};

                    var getDailyData = function () {
                        summaryParams = {period: selectedDate, type: STRINGS.TYPE_DAILY};
                        getData(STRINGS.TYPE_DAILY);

                    };

                    var getWeeklyData = function () {
                        var week = moment(selectedDate).format("YYYY-[W]ww");
                        summaryParams = {period: week, type: STRINGS.TYPE_WEEKLY};
                        getData(STRINGS.TYPE_WEEKLY);
                    };

                    var getMonthlyData = function () {
                        var month = moment(selectedDate).format("YYYY-MM");
                        summaryParams = {period: month, type: STRINGS.TYPE_MONTHLY};
                        getData(STRINGS.TYPE_MONTHLY);
                    };

                    var getData = function (type) {
                        AggressiveEventsService.getDriveAggressiveEventsByPeriod(summaryParams, orgId, userId).then(function (result) {
                            console.log(result);
                            checkAndHideProgressHUD();
                            if (result.status === 200) {

                                $scope.aggressiveEventSegs[type] = result.data.activities;
                                $scope.aggressiveEvents = $scope.aggressiveEventSegs[selectedType];

                                $scope.aggressiveEventUnitsSegs[type] = result.data.units;
                                $scope.aggressiveEventsUnits = $scope.aggressiveEventUnitsSegs[selectedType];

                                // var overLimitPct = (($scope.aggressiveEvents && $scope.aggressiveEvents.activities["over-speed"]) ? $scope.aggressiveEvents.activities["over-speed"].DrivingSpeedLimitPercentage : null);
                                //
                                // if (overLimitPct) {
                                //   $scope.drivingChartData = [{
                                //     name: 'Under Speed Limit',
                                //     y: (100.0 - overLimitPct)
                                //   }, {
                                //     name: 'Over Speed Limit',
                                //     y: overLimitPct,
                                //     sliced: true,
                                //     selected: true
                                //   }];
                                // }

                            }

                        }, function () {
                            checkAndHideProgressHUD();
                        });
                    };

                    var getSeriesData = function () {
                        AggressiveEventsService.getDriveAggressiveEventsSeries(seriesParams, orgId, userId).then(function (result) {
                            if (result.status === 200) {
                                console.log(result);
                                $scope.driveTimeSeries = result.data.activities;
                                $scope.driveSeriesUnits = result.data.units;

                                $scope.fillGraph();
                            }
                            checkAndHideProgressHUD();
                        }, function () {
                            checkAndHideProgressHUD();
                        });
                    };

                    function checkAndHideProgressHUD() {
                        responseCount++;
                        if (responseCount >= 4) {
                            $ionicLoading.hide();
                            $scope.$broadcast('scroll.refreshComplete');
                        }
                    }

                    $ionicLoading.show();

                    getDailyData();
                    getWeeklyData();
                    getMonthlyData();
                    getSeriesData();

                };

                $scope.doRefresh();

                $scope.fillGraph = function () {
                    var chartTimestamps = [];
                    var chartValues = [];
                    var dataArray = [];


                    var brakeCountArray = Array.from(($scope.driveTimeSeries["hard-brake"]) ? $scope.driveTimeSeries["hard-brake"].BrakeCount : []);
                    brakeCountArray.reverse();

                    dataArray.push({
                        data: brakeCountArray,
                        name: STRINGS.BRAKES
                    });


                    var HardCornerCountArray = Array.from(($scope.driveTimeSeries["hard-corner"]) ? $scope.driveTimeSeries["hard-corner"].HardCornersCount : []);
                    HardCornerCountArray.reverse();


                    dataArray.push({
                        data: HardCornerCountArray,
                        name: STRINGS.HARD_CORNERS
                    });

                    var swervesCountArray = Array.from(($scope.driveTimeSeries["swerve"]) ? $scope.driveTimeSeries["swerve"].SwervesCount : []);
                    swervesCountArray.reverse();

                    dataArray.push({
                        data: swervesCountArray,
                        name: STRINGS.SWERVES
                    });


                    var hardAccelerationCountArray = Array.from(($scope.driveTimeSeries["hard-acceleration"]) ? $scope.driveTimeSeries["hard-acceleration"].HardAccelerationCount : []);
                    hardAccelerationCountArray.reverse();

                    dataArray.push({
                        data: hardAccelerationCountArray,
                        name: STRINGS.HARD_ACCELERATIONS
                    });


                    for (var i = 0; i < dataArray[0].data.length; i++) {
                        chartTimestamps.push(moment(dataArray[0].data[i].start).format("HH:mm") + " - " +
                            moment(dataArray[0].data[i].end).format("HH:mm"));

                    }

                    for (var i = 0; i < dataArray.length; i++) {
                        var elementsArray = [];

                        for (var j = 0; j < dataArray[i].data.length; j++) {
                            elementsArray.push(dataArray[i].data[j].value);
                        }
                        chartValues.push({
                            name: dataArray[i].name,
                            data: elementsArray
                        });
                    }


                    $scope.chartOptions = {units: ""};
                    $scope.chartData = {values: chartValues, timestamps: chartTimestamps};

                };

                var chartTimestamps;
                var chartValues;
                var dataArray;

                function showHardBrakesGraph() {
                    dataArray = Array.from(($scope.driveTimeSeries["hard-brake"]) ? $scope.driveTimeSeries["hard-brake"].BrakeCount : []);
                    dataArray.reverse();
                    var unitLabel = $scope.driveSeriesUnits["hard-brake"] ? $scope.driveSeriesUnits["hard-brake"].BrakeCount : "";
                    if (unitLabel === "") {
                        $scope.chartMetric = STRINGS.DEFAULT_CHART_METRIC;
                        $scope.unit = STRINGS.DEFAULT_CHART_UNIT;
                    } else {
                        $scope.chartMetric = 'Count (' + unitLabel + ')';
                        $scope.unit = unitLabel;
                    }
                    $scope.chartTitle = "Hard Brakes";
                    $scope.prop = "popup2";
                }

                function showHardCornersGraph() {
                    dataArray = Array.from(($scope.driveTimeSeries["hard-corner"]) ? $scope.driveTimeSeries["hard-corner"].HardCornersCount : []);
                    dataArray.reverse();

                    var unitLabel = $scope.driveSeriesUnits["hard-corner"] ? $scope.driveSeriesUnits["hard-corner"].HardCornersCount : "";
                    if (unitLabel === "") {
                        $scope.chartMetric = STRINGS.DEFAULT_CHART_METRIC;
                        $scope.unit = STRINGS.DEFAULT_CHART_UNIT;
                    } else {
                        $scope.chartMetric = 'Count (' + unitLabel + ')';
                        $scope.unit = unitLabel;
                    }
                    $scope.chartTitle = "Hard Corners";
                    $scope.prop = "popup2";
                }

                function showSwervesGraph() {
                    dataArray = Array.from(($scope.driveTimeSeries["swerve"]) ? $scope.driveTimeSeries["swerve"].SwervesCount : []);
                    dataArray.reverse();

                    var unitLabel = $scope.driveSeriesUnits["swerve"] ? $scope.driveSeriesUnits["swerve"].SwervesCount : "";
                    if (unitLabel === "") {
                        $scope.chartMetric = STRINGS.DEFAULT_CHART_METRIC;
                        $scope.unit = STRINGS.DEFAULT_CHART_UNIT;
                    } else {
                        $scope.chartMetric = 'Count (' + unitLabel + ')';
                        $scope.unit = unitLabel;
                    }
                    $scope.chartTitle = "Swerves";
                    $scope.prop = "popup2";
                }

                function showAccelsGraph() {
                    dataArray = Array.from(($scope.driveTimeSeries["hard-acceleration"]) ? $scope.driveTimeSeries["hard-acceleration"].HardAccelerationCount : []);
                    dataArray.reverse();

                    var unitLabel = $scope.driveSeriesUnits["hard-acceleration"] ? $scope.driveSeriesUnits["hard-acceleration"].HardAccelerationCount : "";
                    if (unitLabel === "") {
                        $scope.chartMetric = STRINGS.DEFAULT_CHART_METRIC;
                        $scope.unit = STRINGS.DEFAULT_CHART_UNIT;
                    } else {
                        $scope.chartMetric = 'Count (' + unitLabel + ')';
                        $scope.unit = unitLabel;
                    }
                    $scope.chartTitle = "Hard Accelerations";
                    $scope.prop = "popup2";
                }

                function showDrivingEventsGraph() {
                    dataArray = Array.from(($scope.driveTimeSeries["summary"]) ? $scope.driveTimeSeries["summary"].AggressiveEventsCount : []);
                    dataArray.reverse();

                    var unitLabel = $scope.driveSeriesUnits.summary ? $scope.driveSeriesUnits.summary.AggressiveEventsCount : "";

                    if (unitLabel === "") {
                        $scope.chartMetric = STRINGS.DEFAULT_CHART_METRIC;
                        $scope.unit = STRINGS.DEFAULT_CHART_UNIT;
                    } else {
                        $scope.chartMetric = 'Count (' + unitLabel + ')';
                        $scope.unit = unitLabel;
                    }
                    $scope.chartTitle = "Aggressive Driving Events";
                    $scope.prop = "popup2";
                }

                function show100MilesGraph() {
                    dataArray = Array.from(($scope.driveTimeSeries["summary"]) ? $scope.driveTimeSeries["summary"].AggressiveEventsCount100Miles : []);
                    dataArray.reverse();

                    var unitLabel = $scope.driveSeriesUnits.summary ? $scope.driveSeriesUnits.summary.AggressiveEventsCount100Miles : "";
                    $scope.chartMetric = 'Count (' + unitLabel + ')';
                    $scope.unit = unitLabel;
                    $scope.chartTitle = "Aggressive Events Per 100 Miles";
                    $scope.prop = "popup2";
                }

                $scope.showAggressiveDriveGraph = function (type) {

                    chartTimestamps = [];
                    chartValues = [];
                    dataArray = [];

                    if (type === 'hard brakes') {
                        showHardBrakesGraph();
                    }
                    else if (type === 'hard corners') {
                        showHardCornersGraph();
                    }
                    else if (type === 'swerves') {
                        showSwervesGraph();
                    }
                    else if (type === 'accels') {
                        showAccelsGraph();
                    }
                    else if (type === 'driving events') {
                        showDrivingEventsGraph();
                    }
                    else if (type === '100 miles') {
                        show100MilesGraph();
                    }

                    for (var i = 0; i < dataArray.length; i++) {
                        var time = moment(dataArray[i].start).format('HH:mm') + "-" + moment(dataArray[i].end).format('HH:mm');
                        chartTimestamps.push(time);
                        chartValues.push(dataArray[i].value);
                    }

                    $scope.chartTimestamps = chartTimestamps;
                    $scope.chartValues = chartValues;

                    $scope.chartData = {values: $scope.chartValues, data: $scope.chartTimestamps};

                    $scope.graphOptions = {
                        "tooltipHeader": "<b>Aggressive Drive Time</b><br/>",
                        "color": "#0085c3", metric: $scope.chartMetric, property: $scope.prop, units: $scope.unit,
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

//                            $scope.brakeTimestamps = [];
//
//                            if (data.BrakeCount) {
//                                var dataArray = Array.from(data.BrakeCount || []).reverse();
//                                for (var i = 0; i < dataArray.length; i++) {
//                                    var brakeCounts = 0;
//                                    for (var j = 0; j < dataArray[i].value; j++) {
//                                        brakeCounts++;
//                                        $scope.brakeTimestamps.push([moment(dataArray[i].start).unix(), brakeCounts]);
//                                    }
//                                }
//                            }
//
//                            console.log($scope.brakeTimestamps);
//
//                            $scope.cornersTimeStamps = [];
//
//                            if (data.HardCornersCount) {
//                                var dataArray = Array.from(data.HardCornersCount || []).reverse();
//                                for (var i = 0; i < dataArray.length; i++) {
//                                    var cornersCount = 0;
//                                    for (var j = 0; j < dataArray[i].value; j++) {
//                                        cornersCount++;
//                                        $scope.cornersTimeStamps.push([moment(dataArray[i].start).unix(), cornersCount]);
//                                    }
//                                }
//                            }
//
//                            $scope.swervesTimeStamps = [];
//
//                            if (data.SwervesCount) {
//                                var dataArray = Array.from(data.SwervesCount || []).reverse();
//                                for (var i = 0; i < dataArray.length; i++) {
//                                    var swervesCount = 0;
//                                    for (var j = 0; j < dataArray[i].value; j++) {
//                                        swervesCount++;
//                                        $scope.swervesTimeStamps.push([moment(dataArray[i].start).unix(), swervesCount]);
//                                    }
//                                }
//                            }
//
//                            $scope.accelsTimeStamps = [];
//
//                            if (data.HardAccelerationCount) {
//                                var dataArray = Array.from(data.HardAccelerationCount || []).reverse();
//                                for (var i = 0; i < dataArray.length; i++) {
//                                    var accelsCount = 0;
//                                    for (var j = 0; j < dataArray[i].value; j++) {
//                                        accelsCount++;
//                                        $scope.accelsTimeStamps.push([moment(dataArray[i].start).unix(), accelsCount]);
//                                    }
//                                }
//                            }
//
//                            $scope.aggressiveTimeStamps = [];
//
//                            if (data.AggressiveEventsCount) {
//                                var dataArray = Array.from(data.AggressiveEventsCount || []).reverse();
//                                for (var i = 0; i < dataArray.length; i++) {
//                                    var eventsCount = 0;
//                                    for (var j = 0; j < dataArray[i].value; j++) {
//                                        eventsCount++;
//                                        $scope.aggressiveTimeStamps.push([moment(dataArray[i].start).unix(), eventsCount]);
//                                    }
//                                }
//                            }
//
//                            $scope.aggressive100TimeStamps = [];
//
//                            if (data.AggressiveEventsCount100Miles) {
//                                var dataArray = Array.from(data.AggressiveEventsCount100Miles || []).reverse();
//                                for (var i = 0; i < dataArray.length; i++) {
//                                    var eventsCount = 0;
//                                    for (var j = 0; j < dataArray[i].value; j++) {
//                                        eventsCount++;
//                                        $scope.aggressive100TimeStamps.push([moment(dataArray[i].start).unix(), eventsCount]);
//                                    }
//                                }
//                            }


//                $scope.showHardBrakesGraph = function () {
//
//                    $scope.graphOptions = {
//                        "tooltipHeader": "<b>Brakes</b><br/>",
//                        "color": "#0085c3"
//                    };
//                    $scope.graph = {data: $scope.brakeTimestamps, options: $scope.graphOptions};
//
//
//                    var myPopup = $ionicPopup.show({
//                        templateUrl: "templates/graphs/scatter-graph.html",
//                        scope: $scope,
//                        cssClass: 'popup-graph',
//                        title: "Brakes",
//                        buttons: [
//                            {
//                                text: '<b>Close</b>',
//                                type: 'btn btn-info'
//                            }
//                        ]
//                    });
//                };
//
//
//                $scope.showHardCornersGraph = function () {
//
//                    $scope.graphOptions = {
//                        "tooltipHeader": "<b>Hard corners</b><br/>",
//                        "color": "#0085c3"
//                    };
//                    $scope.graph = {data: $scope.cornersTimeStamps, options: $scope.graphOptions};
//
//
//                    var myPopup = $ionicPopup.show({
//                        templateUrl: "templates/graphs/scatter-graph.html",
//                        scope: $scope,
//                        cssClass: 'popup-graph',
//                        title: "Hard Corners",
//                        buttons: [
//                            {
//                                text: '<b>Close</b>',
//                                type: 'btn btn-info'
//                            }
//                        ]
//                    });
//                };
//
//
//                $scope.showSwervesGraph = function () {
//
//                    $scope.graphOptions = {
//                        "tooltipHeader": "<b>Swerves</b><br/>",
//                        "color": "#0085c3"
//                    };
//                    $scope.graph = {data: $scope.swervesTimeStamps, options: $scope.graphOptions};
//
//
//                    var myPopup = $ionicPopup.show({
//                        templateUrl: "templates/graphs/scatter-graph.html",
//                        scope: $scope,
//                        cssClass: 'popup-graph',
//                        title: "Swerves",
//                        buttons: [
//                            {
//                                text: '<b>Close</b>',
//                                type: 'btn btn-info'
//                            }
//                        ]
//                    });
//                };
//
//                $scope.showAccelsGraph = function () {
//
//                    $scope.graphOptions = {
//                        "tooltipHeader": "<b>Accelerations</b><br/>",
//                        "color": "#0085c3"
//                    };
//                    $scope.graph = {data: $scope.accelsTimeStamps, options: $scope.graphOptions};
//
//
//                    var myPopup = $ionicPopup.show({
//                        templateUrl: "templates/graphs/scatter-graph.html",
//                        scope: $scope,
//                        cssClass: 'popup-graph',
//                        title: "Accelerations",
//                        buttons: [
//                            {
//                                text: '<b>Close</b>',
//                                type: 'btn btn-info'
//                            }
//                        ]
//                    });
//                };
//
//
//                $scope.showAggressiveEventsGraph = function () {
//
//                    $scope.graphOptions = {
//                        "tooltipHeader": "<b>Aggressive Events</b><br/>",
//                        "color": "#0085c3"
//                    };
//                    $scope.graph = {data: $scope.aggressiveTimeStamps, options: $scope.graphOptions};
//
//
//                    var myPopup = $ionicPopup.show({
//                        templateUrl: "templates/graphs/scatter-graph.html",
//                        scope: $scope,
//                        cssClass: 'popup-graph',
//                        title: "Aggressive Events",
//                        buttons: [
//                            {
//                                text: '<b>Close</b>',
//                                type: 'btn btn-info'
//                            }
//                        ]
//                    });
//                };
//
//                $scope.showAggressiveFor100MileGraph = function () {
//
//                    $scope.graphOptions = {
//                        "tooltipHeader": "<b>Aggressive Events for 100 miles</b><br/>",
//                        "color": "#0085c3"
//                    };
//                    $scope.graph = {data: $scope.aggressive100TimeStamps, options: $scope.graphOptions};
//
//
//                    var myPopup = $ionicPopup.show({
//                        templateUrl: "templates/graphs/scatter-graph.html",
//                        scope: $scope,
//                        cssClass: 'popup-graph',
//                        title: "Aggressive Events for 100 miles",
//                        buttons: [
//                            {
//                                text: '<b>Close</b>',
//                                type: 'btn btn-info'
//                            }
//                        ]
//                    });
//                };


            }]);
})();
