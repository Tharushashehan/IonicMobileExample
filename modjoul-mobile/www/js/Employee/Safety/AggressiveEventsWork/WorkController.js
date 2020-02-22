/* global angular */
/* global console */
/* global moment */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
/* jshint shadow:true */
(function () {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('SafetyWorkCtrl',
            function ($scope, $localStorage, AggressiveEventsService, $ionicLoading, $ionicPopup, STRINGS) {

                $scope.strings = STRINGS;
                $scope.triggerValue = 1;

                $scope.$on('dateSelected', function () {
                    $scope.doRefresh();
                });

                var selectedType = STRINGS.TYPESEGMENTS[0];

                $scope.segmentClicked = function($index)
                {
                  selectedType = STRINGS.TYPESEGMENTS[$index];
                  $scope.aggressiveEvents = $scope.aggressiveEventSegs[selectedType];
                  $scope.aggressiveEventsUnits = $scope.aggressiveUnitSegs[selectedType] ;
                  $scope.FallCount = $scope.FallCountSegs[selectedType];
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
                    $scope.aggressiveUnitSegs = {};
                    $scope.FallCountSegs = {};

                    var getDailyData = function () {
                      summaryParams = {period: selectedDate, type:STRINGS.TYPE_DAILY};
                      getData(STRINGS.TYPE_DAILY);

                    };

                    var getWeeklyData = function() {
                      var week = moment(selectedDate).format("YYYY-[W]ww");
                      summaryParams = {period: week, type:STRINGS.TYPE_WEEKLY};
                      getData(STRINGS.TYPE_WEEKLY);
                    };

                    var getMonthlyData = function () {
                      var month = moment(selectedDate).format("YYYY-MM");
                      summaryParams = {period: month, type:STRINGS.TYPE_MONTHLY};
                      getData(STRINGS.TYPE_MONTHLY);
                    };

                    var getData = function(type) {
                      AggressiveEventsService.getWorkAggressiveEventsByPeriod(summaryParams, orgId, userId).then(function (result) {

                        if (result.status === 200) {

                          $scope.aggressiveEventSegs[type] = result.data.activities;
                          $scope.aggressiveUnitSegs[type] = result.data.units;

                          console.log(result.data);

                          $scope.FallCountSegs[type] = result.data.activities.fall ? (parseInt(result.data.activities.fall.FallBackwardsCount, 10) +
                              parseInt(result.data.activities.fall.FallForwardsCount, 10)) : 0;

                          $scope.aggressiveEvents = $scope.aggressiveEventSegs[selectedType];
                          $scope.aggressiveEventsUnits = $scope.aggressiveUnitSegs[selectedType];
                          $scope.FallCount = $scope.FallCountSegs[selectedType];
                        }
                        checkAndHideProgressHUD();
                      }, function () {
                        checkAndHideProgressHUD();
                      });
                    };


                    var getSeriesData = function() {
                      AggressiveEventsService.getWorkAggressiveEventsSeries(seriesParams, orgId, userId).then(function (result) {
                        console.log(result);
                        if (result.status === 200) {
                          $scope.aggressiveWorkEventsSeries = result.data.activities;
                          $scope.WorkEventsSeriesUnits = result.data.units;
                          $scope.fillGraph();
                        }
                        checkAndHideProgressHUD();
                      }, function () {
                        checkAndHideProgressHUD();
                      });
                    };

                    function checkAndHideProgressHUD() {
                      responseCount++;
                      if (responseCount >= 3) {
                        $ionicLoading.hide();
                        $scope.$broadcast('scroll.refreshComplete');
                      }
                    }

                    $ionicLoading.show();

                    getDailyData();
                    getWeeklyData();
                    getMonthlyData();
                    // getSeriesData();

                };

                $scope.doRefresh();

                $scope.fillGraph = function () {
                    var chartTimestamps = [];
                    var chartValues = [];
                    var dataArray = [];


                    var slipCountArray = Array.from(($scope.aggressiveWorkEventsSeries.slip && $scope.aggressiveWorkEventsSeries.slip.SlipsCount) ? $scope.aggressiveWorkEventsSeries.slip.SlipsCount : []);
                    slipCountArray.reverse();

                    dataArray.push({
                        data: slipCountArray,
                        name: STRINGS.SLIPS
                    });


                    var tripCountArray = Array.from(($scope.aggressiveWorkEventsSeries.trip && $scope.aggressiveWorkEventsSeries.trip.TripsCount) ? $scope.aggressiveWorkEventsSeries.trip.TripsCount : []);
                    tripCountArray.reverse();

                    dataArray.push({
                        data: tripCountArray,
                        name: STRINGS.TRIPS
                    });

                    var FallForwardCountArray = Array.from(($scope.aggressiveWorkEventsSeries.fall && $scope.aggressiveWorkEventsSeries.fall.FallForwardsCount) ? $scope.aggressiveWorkEventsSeries.fall.FallForwardsCount : []);
                    FallForwardCountArray.reverse();

                    dataArray.push({
                        data: FallForwardCountArray,
                        name: STRINGS.FALL_FORWARDS
                    });


                    var fallBackwardsCountArray = Array.from(($scope.aggressiveWorkEventsSeries.fall && $scope.aggressiveWorkEventsSeries.fall.FallBackwardsCount) ? $scope.aggressiveWorkEventsSeries.fall.FallBackwardsCount : []);
                    fallBackwardsCountArray.reverse();

                    dataArray.push({
                        data: fallBackwardsCountArray,
                        name: STRINGS.FALL_BACKWARDS
                    });

                    var fallLeftCountArray = Array.from(($scope.aggressiveWorkEventsSeries.fall && $scope.aggressiveWorkEventsSeries.fall.FallLeftCount) ? $scope.aggressiveWorkEventsSeries.fall.FallLeftCount : []);
                    fallLeftCountArray.reverse();

                    dataArray.push({
                        data: fallLeftCountArray,
                        name: STRINGS.FALL_LEFT
                    });

                    var fallRightCountArray = Array.from(($scope.aggressiveWorkEventsSeries.fall && $scope.aggressiveWorkEventsSeries.fall.FallRightCount) ? $scope.aggressiveWorkEventsSeries.fall.FallRightCount : []);
                    fallRightCountArray.reverse();

                    dataArray.push({
                        data: fallRightCountArray,
                        name: STRINGS.FALL_RIGHT
                    });


                    var temperatureArray = Array.from(($scope.aggressiveWorkEventsSeries.summary && $scope.aggressiveWorkEventsSeries.summary.AmbientTemperature) ? $scope.aggressiveWorkEventsSeries.summary.AmbientTemperature : []);
                    temperatureArray.reverse();

                    dataArray.push({
                        data: temperatureArray,
                        name: STRINGS.AMBIENT_TEMPERATURE
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

                        if(dataArray[i].name === STRINGS.AMBIENT_TEMPERATURE){
                            chartValues.push({
                                name: dataArray[i].name,
                                data: elementsArray,
                                type: "spline"
                            });
                        }
                        else{
                            chartValues.push({
                                name: dataArray[i].name,
                                data: elementsArray
                            });
                        }

                    }


                    $scope.chartOptions = {units: ""};
                    $scope.chartData = {values: chartValues, timestamps: chartTimestamps};

                };


                $scope.showAggressiveWorkGraph = function (type) {

                    var chartTimestamps = [];
                    var chartValues = [];
                    var dataArray = [];

                    if (type === 'slips') {
                        dataArray = Array.from(($scope.aggressiveWorkEventsSeries.slip) ? $scope.aggressiveWorkEventsSeries.slip.SlipsCount : []);
                        dataArray.reverse();
                        var unitLabel = $scope.WorkEventsSeriesUnits.slip ? $scope.WorkEventsSeriesUnits.slip.SlipsCount : "";
                        if (unitLabel === "") {
                            $scope.chartMetric = STRINGS.DEFAULT_CHART_METRIC;
                            $scope.unit = STRINGS.DEFAULT_CHART_UNIT;
                        } else {
                            $scope.chartMetric = 'Count (' +  unitLabel + ')';
                            $scope.unit = unitLabel;
                        }
                        $scope.chartTitle = "Slips";
                        $scope.prop = "popup2";
                    }
                    else if (type === 'trips') {
                        dataArray = Array.from(($scope.aggressiveWorkEventsSeries.trip) ? $scope.aggressiveWorkEventsSeries.trip.TripsCount : []);
                        dataArray.reverse();
                        var unitLabel = $scope.WorkEventsSeriesUnits.trip ? $scope.WorkEventsSeriesUnits.trip.TripsCount : "";
                        if (unitLabel === "") {
                            $scope.chartMetric = STRINGS.DEFAULT_CHART_METRIC;
                            $scope.unit = STRINGS.DEFAULT_CHART_UNIT;
                        } else {
                            $scope.chartMetric = 'Count (' +  unitLabel + ')';
                            $scope.unit = unitLabel;
                        }
                        $scope.chartTitle = "Trips";
                        $scope.prop = "popup2";
                    }
                    else if (type === 'fall forwards') {
                        dataArray = Array.from(($scope.aggressiveWorkEventsSeries.fall) ? $scope.aggressiveWorkEventsSeries.fall.FallForwardsCount : []);
                        dataArray.reverse();
                        var unitLabel = $scope.WorkEventsSeriesUnits.fall ? $scope.WorkEventsSeriesUnits.fall.FallForwardsCount : "";
                        if (unitLabel === "") {
                            $scope.chartMetric = STRINGS.DEFAULT_CHART_METRIC;
                            $scope.unit = STRINGS.DEFAULT_CHART_UNIT;
                        } else {
                            $scope.chartMetric = 'Count (' +  unitLabel + ')';
                            $scope.unit = unitLabel;
                        }
                        $scope.chartTitle = "Fall Forwards";
                        $scope.prop = "popup2";
                    }
                    // else if (type === 'fall backwards') {
                    //     dataArray = Array.from(($scope.aggressiveWorkEventsSeries.fall) ? $scope.aggressiveWorkEventsSeries.fall.FallBackwardsCount : []);
                    //     dataArray.reverse();
                    //     var unitLabel = $scope.WorkEventsSeriesUnits.fall ? $scope.WorkEventsSeriesUnits.fall.FallBackwardsCount : "";
                    //     if (unitLabel === "") {
                    //         $scope.chartMetric = STRINGS.DEFAULT_CHART_METRIC;
                    //         $scope.unit = STRINGS.DEFAULT_CHART_UNIT;
                    //     } else {
                    //         $scope.chartMetric = 'Count (' +  unitLabel + ')';
                    //         $scope.unit = unitLabel;
                    //     }
                    //     $scope.chartTitle = "Fall Backwards";
                    //     $scope.prop = "popup2";
                    // }
                    else if (type === 'fall sideways') {
                        dataArray = Array.from(($scope.aggressiveWorkEventsSeries.fall) ? $scope.aggressiveWorkEventsSeries.fall.FallSidewaysCount : []);
                        dataArray.reverse();
                        var unitLabel = $scope.WorkEventsSeriesUnits.fall ? $scope.WorkEventsSeriesUnits.fall.FallSidewaysCount : "";
                        if (unitLabel === "") {
                            $scope.chartMetric = STRINGS.DEFAULT_CHART_METRIC;
                            $scope.unit = STRINGS.DEFAULT_CHART_UNIT;
                        } else {
                            $scope.chartMetric = 'Count (' +  unitLabel + ')';
                            $scope.unit = unitLabel;
                        }
                        $scope.chartTitle = "Fall Sideways";
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
                        "tooltipHeader": "<b>Aggressive Drive Time</b><br/>",
                        "color": "#0085c3", metric: $scope.chartMetric, property: $scope.prop, units: $scope.unit
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


//                            var slipsTimestamps = [];
//
//                            if (data.SlipsCount) {
//                                for (var i = 0; i < data.SlipsCount.length; i++) {
//                                    var slipsCount = 0;
//                                    for (var j = 0; j < data.SlipsCount[i].value; j++) {
//                                        slipsCount++;
//                                        slipsTimestamps.push([moment(data.SlipsCount[i].start).unix(), slipsCount]);
//                                    }
//
//                                }
//                            }
//
//                            console.log(slipsTimestamps);
//                            var tripsTimestamps = [];
//                            var tripsCounts = [];
//
//                            if (data.TripsCount) {
//                                for (var i = 0; i < data.TripsCount.length; i++) {
//                                    var tripsCount = 0;
//                                    for (var j = 0; j < data.TripsCount[i].value; j++) {
//                                        tripsCount++;
//                                        tripsTimestamps.push([moment(data.TripsCount[i].start).unix(), tripsCount]);
//                                    }
//                                }
//                            }
//
//                            console.log(tripsTimestamps);
//
//                            var fallsSidewaysTimestamps = [];
//                            var fallsSidewaysCount = [];
//
//                            if (data.FallSidewaysCount) {
//                                for (var i = 0; i < data.FallSidewaysCount.length; i++) {
//                                    var fallsSidewaysCount = 0;
//                                    for (var j = 0; j < data.FallSidewaysCount[i].value; j++) {
//                                        fallsSidewaysCount++;
//                                        fallsSidewaysTimestamps.push([moment(data.FallSidewaysCount[i].start).unix(), fallsSidewaysCount]);
//                                    }
//                                }
//                            }
//
//
//                            var fallsBackwardsTimestamps = [];
//                            var fallsBackwardsCounts = [];
//
//                            if (data.FallBackwardsCount) {
//                                for (var i = 0; i < data.FallBackwardsCount.length; i++) {
//                                    var fallsBackwardsCounts = 0;
//                                    for (var j = 0; j < data.FallBackwardsCount[i].value; j++) {
//                                        fallsBackwardsCounts++;
//                                        fallsBackwardsTimestamps.push([moment(data.FallBackwardsCount[i].start).unix(), fallsBackwardsCounts]);
//                                    }
//                                }
//                            }
//
//
//                            var fallsForwardsTimestamps = [];
//                            var fallsForwardsCounts = [];
//
//                            if (data.FallForwardsCount) {
//                                for (var i = 0; i < data.FallForwardsCount.length; i++) {
//                                    var fallsForwardsCounts = 0;
//                                    for (var j = 0; j < data.FallForwardsCount[i].value; j++) {
//                                        fallsForwardsCounts++;
//                                        fallsForwardsTimestamps.push([moment(data.FallForwardsCount[i].start).unix(), fallsForwardsCounts]);
//                                    }
//                                }
//                            }
//
//                            $scope.slipsTimestamps = slipsTimestamps;
//                            $scope.slipsTimestampsOptions = {
//                                "tooltipHeader": "<br>Slip occured at <br>",
//                                "color": "#2b908f"
//
//
//                            };
//
//
//                            $scope.tripsTimestamps = tripsTimestamps;
//                            $scope.tripsTimestampsOptions = {
//                                "tooltipHeader": "<b>Trip occured at</b><br/>",
//                                "color": "#FFFF00"
//                            };
//
//                            $scope.fallsSidewaysTimestamps = fallsSidewaysTimestamps;
//                            $scope.fallsSidewaysTimestampsOptions = {
//                                "tooltipHeader": "<b>Fall Sideways occured at</b><br/>",
//                                "color": "#DD8305"
//                            };
//
//                            $scope.fallsBackwardsTimestamps = fallsBackwardsTimestamps;
//                            $scope.fallsBackwardsTimestampsOptions = {
//                                "tooltipHeader": "<b>Fall Backwards occured at</b><br/>",
//                                "color": "#C1C923"
//                            };
//
//                            $scope.fallsForwardsTimestamps = fallsForwardsTimestamps;
//                            $scope.fallsForwardsTimestampsOptions = {
//                                "tooltipHeader": "<b>Fall Forwards occured at</b><br/>",
//                                "color": "#0085c3"
//                            };


//                    $scope.fallChartOptions = {
//                        seriesName: 'Count',
//                        xAxisTitle: ''
//                    };


//                $scope.showSlipsGraph = function () {
//                    $scope.graphOptions = {
//                        "tooltipHeader": "<b>slips</b><br/>",
//                        "color": "#0085c3"
//                    };
//                    $scope.graph = {data: $scope.slipsTimestamps, options: $scope.graphOptions};
//
//
//                    var myPopup = $ionicPopup.show({
//                        templateUrl: "templates/graphs/scatter-graph.html",
//                        scope: $scope,
//                        cssClass: 'popup-graph',
//                        title: "Slips",
//                        buttons: [
//                            {
//                                text: '<b>Close</b>',
//                                type: 'btn btn-info'
//                            }
//                        ]
//                    });
//                }
//
//
//                $scope.showTripsGraph = function () {
//                    $scope.graphOptions = {
//                        "tooltipHeader": "<b>trips</b><br/>",
//                        "color": "#0085c3"
//                    };
//                    $scope.graph = {data: $scope.tripsTimestamps, options: $scope.graphOptions};
//
//
//                    var myPopup = $ionicPopup.show({
//                        templateUrl: "templates/graphs/scatter-graph.html",
//                        scope: $scope,
//                        cssClass: 'popup-graph',
//                        title: "Trips",
//                        buttons: [
//                            {
//                                text: '<b>Close</b>',
//                                type: 'btn btn-info'
//                            }
//                        ]
//                    });
//                };
//
//                $scope.showFallForwardsGraph = function () {
//                    $scope.graphOptions = {
//                        "tooltipHeader": "<b>Fall forwards</b><br/>",
//                        "color": "#0085c3"
//                    };
//                    $scope.graph = {data: $scope.fallsForwardsTimestamps, options: $scope.graphOptions};
//
//
//                    var myPopup = $ionicPopup.show({
//                        templateUrl: "templates/graphs/scatter-graph.html",
//                        scope: $scope,
//                        cssClass: 'popup-graph',
//                        title: "Fall Forwards",
//                        buttons: [
//                            {
//                                text: '<b>Close</b>',
//                                type: 'btn btn-info'
//                            }
//                        ]
//                    });
//                };
//
//                $scope.showFallBackwardsGraph = function () {
//                    $scope.graphOptions = {
//                        "tooltipHeader": "<b>Fall backwards</b><br/>",
//                        "color": "#0085c3"
//                    };
//                    $scope.graph = {data: $scope.fallsBackwardsTimestamps, options: $scope.graphOptions};
//
//
//                    var myPopup = $ionicPopup.show({
//                        templateUrl: "templates/graphs/scatter-graph.html",
//                        scope: $scope,
//                        cssClass: 'popup-graph',
//                        title: "Fall Backwards",
//                        buttons: [
//                            {
//                                text: '<b>Close</b>',
//                                type: 'btn btn-info'
//                            }
//                        ]
//                    });
//                };
//
//                $scope.showFallSidewaysGraph = function () {
//                    $scope.graphOptions = {
//                        "tooltipHeader": "<b>Fall sideways</b><br/>",
//                        "color": "#0085c3"
//                    };
//                    $scope.graph = {data: $scope.fallsSidewaysTimestamps, options: $scope.graphOptions};
//
//
//                    var myPopup = $ionicPopup.show({
//                        templateUrl: "templates/graphs/scatter-graph.html",
//                        scope: $scope,
//                        cssClass: 'popup-graph',
//                        title: "Fall Sideways",
//                        buttons: [
//                            {
//                                text: '<b>Close</b>',
//                                type: 'btn btn-info'
//                            }
//                        ]
//                    });
//                };


            });
})();
