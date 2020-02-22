/* global angular */
/* global console */
/* global moment */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
/* jshint shadow:true */
(function () {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('WorkingHeightsCtrl', ['$scope', '$localStorage', '$ionicLoading', 'WorkingHeightsService', 'STRINGS', '$ionicPopup',
            function ($scope, $localStorage, $ionicLoading, WorkingHeightsService, STRINGS, $ionicPopup) {

                $scope.strings = STRINGS;

                $scope.triggerValue = 1;

                $scope.$on('dateSelected', function () {
                    $scope.doRefresh();
                });

                var selectedType = STRINGS.TYPESEGMENTS[0];

                $scope.segmentClicked = function ($index) {
                    selectedType = STRINGS.TYPESEGMENTS[$index];
                    $scope.workingHeightsSummary = $scope.workingHeightsSummarySegs[selectedType];
                    $scope.workingHeightsSummaryUnits = $scope.workingHeightsUnitSegs[selectedType];

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

                    $scope.workingHeightsSummarySegs = {};
                    $scope.workingHeightsUnitSegs = {};

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
                        WorkingHeightsService.getWorkingHeightsSummary(summaryParams, orgId, userId).then(function (result) {
                            console.log(result);
                            if (result.status === 200) {
                                $scope.workingHeightsSummarySegs[type] = result.data.activities;
                                $scope.workingHeightsUnitSegs[type] = result.data.units;
                                $scope.workingHeightsSummary = $scope.workingHeightsSummarySegs[selectedType];
                                $scope.workingHeightsSummaryUnits = $scope.workingHeightsUnitSegs[selectedType];
                            }
                            checkAndHideProgressHUD();

                        }, function (error) {
                            console.log(error);
                            checkAndHideProgressHUD();
                        });
                    };


                    var getAggregationSeriesData = function () {
                        WorkingHeightsService.getWorkingHeightsSeries(seriesParams, orgId, userId).then(function (result) {

                            if (result.status === 200) {
                                console.log(result);
                                $scope.workingFromHeightsSeriesAggregation = result.data.activities[STRINGS.ACTIVITIES_MAPPING.WORK_FROM_HEIGHTS_PARENT];
                                $scope.workingFromHeightsSeriesAggregationUnits = result.data.units[STRINGS.ACTIVITIES_MAPPING.WORK_FROM_HEIGHTS_PARENT];

                                $ionicLoading.hide();
                                $scope.$broadcast('scroll.refreshComplete');

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
                    getAggregationSeriesData();

                };

                $scope.doRefresh();

                $scope.showWorkingHeightsGraph = function (type) {

                    var chartTimestamps = [];
                    var chartValues = [];
                    var dataArray = [];
                    var unitLabel;
                    var min;
                    var lines;

                    if (type === 'max height') {
                        dataArray = Array.from(($scope.workingHeightsSummarySeries) ? $scope.workingHeightsSummarySeries.AltitudeMax : []);
                        dataArray.reverse();

                        unitLabel = $scope.workingHeightsSeriesSummaryUnits ? $scope.workingHeightsSeriesSummaryUnits.AltitudeMax : "";
                        $scope.chartMetric = 'Height (' + unitLabel + ')';
                        $scope.unit = unitLabel;
                        $scope.chartTitle = "Maximum Height";
                        $scope.prop = "popup2";
                        min = 4;
                        lines = [{
                            color: STRINGS.COLORS.MODJOUL_RED,
                            value: 6,
                            width: 1,
                            zIndex: 2
                        }];
                    }
                    else if (type === 'how long') {
                        dataArray = Array.from(($scope.workingHeightsSeries) ? $scope.workingHeightsSeries.WorkingHeightTime : []);
                        dataArray.reverse();

                        unitLabel = $scope.workingHeightsSeriesUnits ? $scope.workingHeightsSeriesUnits.WorkingHeightTime : "";
                        $scope.chartMetric = 'Duration (' + unitLabel + ')';
                        $scope.unit = unitLabel;
                        $scope.chartTitle = "How Long";
                        $scope.prop = "popup2";
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
                        "color": "#0085c3", metric: $scope.chartMetric, property: $scope.prop, units: $scope.unit
                    };


                    if (min) {
                        $scope.graphOptions.min = min;
                    }

                    if (lines) {
                        $scope.graphOptions.lines = lines;
                    }


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

                $scope.fillGraph = function () {
                    var chartTimestamps = [];
                    var chartValues = [];
                    var dataArray = [];
                    var unitLabel;

                    dataArray = Array.from(($scope.workingFromHeightsSeriesAggregation) ? $scope.workingFromHeightsSeriesAggregation[STRINGS.ACTIVITIES_MAPPING.ALTITUDE_MAX] : []);

                    unitLabel = $scope.workingFromHeightsSeriesAggregationUnits ? $scope.workingFromHeightsSeriesAggregationUnits[STRINGS.ACTIVITIES_MAPPING.ALTITUDE_MAX] : "";
                    $scope.chartMetric = 'Height (' + unitLabel + ')';
                    $scope.unit = unitLabel;
                    $scope.prop = "dark";
                    var min = 4;
                    var lines = [{
                        color: STRINGS.COLORS.MODJOUL_RED,
                        value: 6,
                        width: 1,
                        zIndex: 2
                    }];

                    for (var i = 0; i < dataArray.length; i++) {
                        var time = moment(dataArray[i].timestamp).format('HH:mm');
                        chartTimestamps.push(time);
                        chartValues.push(dataArray[i].value);
                    }

                    $scope.aggregateGraphOptions = {
                        "color": "#0085c3", metric: $scope.chartMetric, property: $scope.prop, units: $scope.unit,
                        lines: lines, min: min
                    };

                    $scope.aggregateChartData = {values: chartValues, data: chartTimestamps, property: "dark"};


                };


            }]);
})();
