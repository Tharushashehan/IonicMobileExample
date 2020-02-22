/* global angular */
/* global console */
/* global moment */
/* global Highcharts */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

(function () {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('RiskManagerWorkController', ['$scope', '$state', 'RiskManagerMetricsService', 'OrgManagementService', '$localStorage', 'STRINGS',
            '$ionicLoading', '$ionicPopup', 'ionicDatePicker',
            function ($scope, $state, RiskManagerMetricsService, OrgManagementService, $localStorage, STRINGS, $ionicLoading, $ionicPopup,
                      ionicDatePicker) {

                $scope.strings = STRINGS;
                $scope.startDate = moment();

                var orgId = $localStorage.orgId;

                $scope.$on('dateSelected', function () {
                    $scope.doRefresh();
                });

                $scope.$on('locationSelected', function () {
                    $scope.doRefresh();
                });

                var selectedType = STRINGS.TYPESEGMENTS[0];
                $scope.selectedType = STRINGS.RISKMANAGERTREND[0];
                $scope.selectedAnalysisType = STRINGS.RISKMANAGERANALYSIS[0];


                $scope.segmentClicked = function ($index) {
                    // selectedType = STRINGS.RISKMANAGERTREND[$index];
                    $scope.selectedType = STRINGS.RISKMANAGERTREND[$index];
                    $scope.$apply();
                };

                $scope.analysisSegmentClicked = function ($index) {
                    $scope.selectedAnalysisType = STRINGS.RISKMANAGERANALYSIS[$index];
                    $scope.$apply();
                };


                $scope.getOrgJobFunctions = function(){
                    OrgManagementService.getExistingOrgDetails(orgId)
                        .then(function (result) {
                            console.log(result);
                            $ionicLoading.hide();
                            $scope.jobFunctions = result.data.orgJobFunctions;

                            $scope.orgFunctions = $scope.jobFunctions[0];

                        }, function (error) {
                            $ionicLoading.hide();
                            console.log(error);
                        });
                };


                $scope.doRefresh = function () {

                    var orgId = $localStorage.orgId;
                    // var userId = $localStorage.selectedEmployee ? $localStorage.selectedEmployee.id : null;
                    var locationId = $localStorage.selectedLocation.locationId;

                    $scope.selectedDate = $localStorage.selectedDate || moment().subtract(1, "days").format("YYYY-MM-DD");
                    var startDate = moment($scope.selectedDate, "YYYY-MM-DD").subtract(STRINGS.DATES.DAYS, "days").format("YYYY-MM-DD");

                    var summaryParams = {period: $scope.selectedDate};
                    var responseCount = 0;


                    $scope.getOrgJobFunctions();

                    function getData() {

                        $ionicLoading.show();

                        RiskManagerMetricsService.getWorkMetrics(summaryParams, orgId, locationId)
                            .then(function (result) {

                                console.log(result);
                                $scope.workSummary = result.data.activities;
                                $scope.workSummaryUnits = result.data.units;

                                RiskManagerMetricsService.getWorkMetricsTimeSeries({
                                    start: startDate,
                                    end: $scope.selectedDate
                                }, orgId, locationId)
                                    .then(function (result) {

                                        checkAndHideProgressHUD();
                                        console.log(result);
                                        $scope.workTimeSeries = result.data.activities;
                                        $scope.workTimeSeriesUnits = result.data.units;

                                    }, function (error) {
                                        checkAndHideProgressHUD();
                                        console.log(error);
                                    });

                            }, function (error) {
                                checkAndHideProgressHUD();
                                console.log(error);
                            });
                    }

                    function checkAndHideProgressHUD() {
                        $ionicLoading.hide();
                        $scope.$broadcast('scroll.refreshComplete');

                    }


                    // getData();

                };

                $scope.doRefresh();

                $scope.selectJobFunction = function(selectedJobFunction){

                    console.log(selectedJobFunction);
                    $ionicLoading.show();

                    RiskManagerMetricsService.getWorkJobFunctionMetrics(
                        {startDate: $scope.jobFunctionStartDateText,
                            endDate: $scope.jobFunctionEndDateText}, orgId, selectedJobFunction)
                        .then(function (result) {
                            console.log(result);
                            $ionicLoading.hide();

                            $scope.jobFunctionMetrics = result.data.activities;


                            var series = [];

                            var dataArray = {};
                            dataArray.labels = [];

                            if($scope.jobFunctionMetrics["near-miss-events"]){
                                var nearMissEventsArray = [];
                                var totalSlipsTripsFalls = $scope.jobFunctionMetrics["near-miss-events"].fall.TotalSlipTripFallCount;
                                for(var i =0; i < totalSlipsTripsFalls.length; i++){
                                    dataArray.labels.push(totalSlipsTripsFalls[i].date);
                                    nearMissEventsArray.push(totalSlipsTripsFalls[i].value);
                                }

                                series.push({
                                    name: "Trips & Falls",
                                    data: nearMissEventsArray.reverse()
                                });
                            }

                            if($scope.jobFunctionMetrics["working-from-heights"]){
                                var workingFromheightsArray = [];
                                var workingFromheights = $scope.jobFunctionMetrics["working-from-heights"].WorkingHeightCount;
                                for(var i =0; i < workingFromheights.length; i++){
                                    workingFromheightsArray.push(workingFromheights[i].value);
                                }

                                series.push({
                                    name: "Working From heights",
                                    data: workingFromheightsArray.reverse()
                                });
                            }

                            if($scope.jobFunctionMetrics["bending"]){
                                var bendingArray = [];
                                var bending = $scope.jobFunctionMetrics["bending"].BendingCount;
                                for(var i =0; i < bending.length; i++){
                                    bendingArray.push(bending[i].value);
                                }

                                series.push({
                                    name: "Bending",
                                    data: bendingArray.reverse()
                                });
                            }

                            dataArray.labels.reverse();


                            Highcharts.chart('job-function-chart', {
                                colors: [STRINGS.COLORS.MODJOUL_ORANGE, STRINGS.COLORS.MODJOUL_BLUE, STRINGS.COLORS.MODJOUL_GREEN],
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
                                    labels : {
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
                                    labels : {
                                        style: {
                                            color: '#ffffff'
                                        }
                                    },
                                    gridLineColor: 'transparent'
                                },
                                legend: {
                                    enabled: true,
                                    itemStyle:{
                                        color: '#fff'
                                    }

                                },
                                credits: {
                                    enabled: false
                                },
                                series: series

                            });



                        }, function (error) {
                            $ionicLoading.hide();
                            console.log(error);
                        });
                };

                var chartTimestamps;
                var chartValues;
                var dataArray;

                function makeWorkTimeChart() {

                    dataArray = Array.from(($scope.workTimeSeries["work-time"]) ? $scope.workTimeSeries["work-time"].summary.WorkTime : []);
                    dataArray.reverse();
                    $scope.chartMetric = ($scope.workTimeSeriesUnits["work-time"]) ? STRINGS.DURATION + ' (' + $scope.workTimeSeriesUnits["work-time"].summary.WorkTime + ')' : STRINGS.DURATION;
                    $scope.unit = ($scope.workTimeSeriesUnits["work-time"]) ? '(' + $scope.workTimeSeriesUnits["work-time"].summary.WorkTime + ')' : '';
                    $scope.headerFormat = "Hours Worked";
                    $scope.chartTitle = "Actual hours worked";

                }

                function makeIdleTimeChart() {

                    dataArray = Array.from(($scope.workTimeSeries["work-time"]["idle-time"]) ? $scope.workTimeSeries["work-time"]["idle-time"].TotalIdleTime : []);
                    dataArray.reverse();
                    $scope.chartMetric = ($scope.workTimeSeriesUnits["work-time"]["idle-time"]) ? STRINGS.DURATION + '(' + $scope.workTimeSeriesUnits["work-time"]["idle-time"].TotalIdleTime + ')' : STRINGS.DURATION;
                    $scope.unit = ($scope.workTimeSeriesUnits["work-time"]["idle-time"]) ? '(' + $scope.workTimeSeriesUnits["work-time"]["idle-time"].TotalIdleTime + ')' : '';
                    $scope.headerFormat = "Minute Idling";
                    $scope.chartTitle = "Static Time";

                }

                function makeNearMissChart() {

                    dataArray = Array.from(($scope.workTimeSeries["near-miss-events"]) ? $scope.workTimeSeries["near-miss-events"].fall.TotalSlipTripFallCount : []);
                    dataArray.reverse();
                    $scope.chartMetric = 'Event';
                    $scope.headerFormat = "Events Occured";
                    $scope.unit = '(events)';
                    $scope.chartTitle = "Near Miss Work Events";

                }

                function makeWorkRateChart() {

                    dataArray = Array.from(($scope.workTimeSeries["near-miss-events"]) ? $scope.workTimeSeries["near-miss-events"].summary.NearMissWorkRate : []);
                    dataArray.reverse();
                    $scope.chartMetric = ($scope.workTimeSeriesUnits["near-miss-events"]) ? STRINGS.COUNT + ' (' + $scope.workTimeSeriesUnits["near-miss-events"].summary.NearMissWorkRate + ')' : STRINGS.COUNT;
                    $scope.unit = '';
                    $scope.headerFormat = "Events Occurred";
                    $scope.chartTitle = "Near Miss Work Events";

                }

                function makeWorkHoursChart() {
                    dataArray = Array.from(($scope.workTimeSeries["near-miss-events"]) ? $scope.workTimeSeries["near-miss-events"].summary.NearMissWorkXhours : []);
                    dataArray.reverse();
                    $scope.chartMetric = ($scope.workTimeSeriesUnits["near-miss-events"]) ? STRINGS.COUNT + ' (' + $scope.workTimeSeriesUnits["near-miss-events"].summary.NearMissWorkXhours + ')' : STRINGS.COUNT;
                    $scope.unit = '';
                    $scope.headerFormat = "Events Occurred";
                    $scope.chartTitle = "Black Box Work Events";
                }

                function makeSlipsChart() {

                    dataArray = Array.from(($scope.workTimeSeries["near-miss-events"]) ? $scope.workTimeSeries["near-miss-events"].slip.SlipsCount : []);
                    dataArray.reverse();
                    $scope.chartMetric = STRINGS.COUNT;
                    $scope.unit = '';
                    $scope.headerFormat = "Slip Count";
                    $scope.chartTitle = "Slip Count";

                }

                function makeTripsChart() {

                    dataArray = Array.from(($scope.workTimeSeries["near-miss-events"]) ? $scope.workTimeSeries["near-miss-events"].trip.TripsCount : []);
                    dataArray.reverse();
                    $scope.chartMetric = STRINGS.COUNT;
                    $scope.unit = '';
                    $scope.headerFormat = "Trip Count";
                    $scope.chartTitle = "Trip Count";

                }

                function makeSidewaysChart() {

                    dataArray = Array.from(($scope.workTimeSeries["near-miss-events"]) ? $scope.workTimeSeries["near-miss-events"].fall.FallSidewaysCount : []);
                    dataArray.reverse();
                    $scope.chartMetric = STRINGS.COUNT;
                    $scope.unit = '';
                    $scope.headerFormat = "Falling Sideways Count";
                    $scope.chartTitle = "Falling Sideways Count";

                }

                function makeBackwardsChart() {

                    dataArray = Array.from(($scope.workTimeSeries["near-miss-events"]) ? $scope.workTimeSeries["near-miss-events"].fall.FallBackwardsCount : []);
                    dataArray.reverse();
                    $scope.chartMetric = STRINGS.COUNT;
                    $scope.unit = '';
                    $scope.headerFormat = "Falling Backwards Count";
                    $scope.chartTitle = "Falling Backwards Count";

                }

                function makeForwardsChart() {

                    dataArray = Array.from(($scope.workTimeSeries["near-miss-events"]) ? $scope.workTimeSeries["near-miss-events"].fall.FallForwardsCount : []);
                    dataArray.reverse();
                    $scope.chartMetric = STRINGS.COUNT;
                    $scope.unit = '';
                    $scope.headerFormat = "Falling Forwards Count";
                    $scope.chartTitle = "Falling Forwards Count";

                }

                function makeHightCountChart() {

                    dataArray = Array.from(($scope.workTimeSeries["working-from-heights"]) ? $scope.workTimeSeries["working-from-heights"].WorkingHeightCount : []);
                    dataArray.reverse();
                    $scope.chartMetric = STRINGS.COUNT;
                    $scope.unit = '';
                    $scope.headerFormat = "Working Height Count";
                    $scope.chartTitle = "Working Height Count";

                }

                function makeHightTimeChart() {

                    dataArray = Array.from(($scope.workTimeSeries["working-from-heights"]) ? $scope.workTimeSeries["working-from-heights"].WorkingHeightTime : []);
                    dataArray.reverse();
                    $scope.chartMetric = ($scope.workTimeSeriesUnits["working-from-heights"]) ? STRINGS.DURATION + ' (' + $scope.workTimeSeriesUnits["working-from-heights"].WorkingHeightTime + ')' : STRINGS.DURATION;
                    $scope.unit = '';
                    $scope.headerFormat = "Working Height Time";
                    $scope.chartTitle = "Working Height Time";

                }

                function makeMinChart() {

                    dataArray = Array.from(($scope.workTimeSeries["working-from-heights"]) ? $scope.workTimeSeries["working-from-heights"].AltitudeMin : []);
                    dataArray.reverse();
                    $scope.chartMetric = ($scope.workTimeSeriesUnits["working-from-heights"]) ? STRINGS.HEIGHT + ' (' + $scope.workTimeSeriesUnits["working-from-heights"].AltitudeMin + ')' : STRINGS.HEIGHT;
                    $scope.unit = '';
                    $scope.headerFormat = "Lowest Height";
                    $scope.chartTitle = "Lowest Height";

                }

                function makeMaxChart() {

                    dataArray = Array.from(($scope.workTimeSeries["working-from-heights"]) ? $scope.workTimeSeries["working-from-heights"].AltitudeMax : []);
                    dataArray.reverse();
                    $scope.chartMetric = ($scope.workTimeSeriesUnits["working-from-heights"]) ? STRINGS.HEIGHT + ' (' + $scope.workTimeSeriesUnits["working-from-heights"].AltitudeMax + ')' : STRINGS.HEIGHT;
                    $scope.unit = '';
                    $scope.headerFormat = "Maximum Height";
                    $scope.chartTitle = "Maximum Height";

                }

                function makeMedianChart() {

                    dataArray = Array.from(($scope.workTimeSeries["working-from-heights"]) ? $scope.workTimeSeries["working-from-heights"].AltitudeMean : []);
                    dataArray.reverse();
                    $scope.chartMetric = 'Feet';
                    $scope.unit = '';
                    $scope.headerFormat = "Median Height";
                    $scope.chartTitle = "Median Height";

                }

                $scope.showWorkGraph = function (type) {

                    chartTimestamps = [];
                    chartValues = [];
                    dataArray = [];

                    if (type === 'work time') {
                        makeWorkTimeChart();
                    }

                    if (type === 'idle time') {
                        makeIdleTimeChart();
                    }

                    if (type === 'near misses') {
                        makeNearMissChart();
                    }

                    if (type === 'work rate') {
                        makeWorkRateChart();
                    }

                    if (type === 'work hours') {
                        makeWorkHoursChart();
                    }

                    if (type === 'slips') {
                        makeSlipsChart();
                    }

                    if (type === 'trips') {
                        makeTripsChart();
                    }

                    if (type === 'sideways') {
                        makeSidewaysChart();
                    }

                    if (type === 'backwards') {
                        makeBackwardsChart();
                    }

                    if (type === 'forwards') {
                        makeForwardsChart();
                    }

                    if (type === 'height count') {
                        makeHightCountChart();
                    }

                    if (type === 'height time') {
                        makeHightTimeChart();
                    }

                    if (type === 'min') {
                        makeMinChart();
                    }

                    if (type === 'max') {
                        makeMaxChart();
                    }

                    if (type === 'median') {
                        makeMedianChart();
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
                        "color": "#0085c3", metric: $scope.chartMetric, format: $scope.headerFormat, units: $scope.unit
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

                $scope.selectStartDate = function(){
                    var dateObject = {
                        callback: function (val) {
                            $scope.startDate = moment(val, "x");
                            $scope.startDateText =  $scope.startDate.format("YYYY-MM-DD");
                        },
                        from: new Date(minimumDate.format('YYYY'), minimumDate.format('M') - 1, minimumDate.format('D')),
                        to: new Date(maxDate.format('YYYY'), maxDate.format('M') - 1, maxDate.format('D')),
                        inputDate: new Date(todayDate.format('YYYY'), todayDate.format('M') - 1, todayDate.format('D'))
                    };

                    ionicDatePicker.openDatePicker(dateObject);

                };

                $scope.selectEndDate = function(){

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


                $scope.selectJobFunctionStartDate = function(){
                    var dateObject = {
                        callback: function (val) {
                            $scope.jobFunctionStartDate = moment(val, "x");
                            $scope.jobFunctionStartDateText = $scope.jobFunctionStartDate.format("YYYY-MM-DD");
                        },
                        from: new Date(minimumDate.format('YYYY'), minimumDate.format('M') - 1, minimumDate.format('D')),
                        to: new Date(maxDate.format('YYYY'), maxDate.format('M') - 1, maxDate.format('D')),
                        inputDate: new Date(todayDate.format('YYYY'), todayDate.format('M') - 1, todayDate.format('D'))
                    };

                    ionicDatePicker.openDatePicker(dateObject);

                };

                $scope.selectJobFunctionEndDate = function(){

                    var dateObject = {
                        callback: function (val) {
                            $scope.jobFunctionEndDate = moment(val, "x");
                            $scope.jobFunctionEndDateText = $scope.jobFunctionEndDate.format("YYYY-MM-DD");
                        },
                        from: new Date($scope.jobFunctionStartDate.format('YYYY'), $scope.jobFunctionStartDate.format('M') - 1, $scope.jobFunctionStartDate.format('D')),
                        to: new Date(maxDate.format('YYYY'), maxDate.format('M') - 1, maxDate.format('D')),
                        inputDate: new Date(todayDate.format('YYYY'), todayDate.format('M') - 1, todayDate.format('D'))
                    };

                    ionicDatePicker.openDatePicker(dateObject);

                };
                $scope.getTrendAnalysis = function(){
                    var orgId = $localStorage.orgId;
                    var locationId = $localStorage.selectedLocation.locationId;

                    $ionicLoading.show();

                    RiskManagerMetricsService.getWorkTrendAnalysis({
                        start: $scope.startDateText,
                        end: $scope.endDateText,
                        type: 'daily'
                    }, orgId, locationId)
                        .then(function(result) {
                            $ionicLoading.hide();
                            $scope.workTrendAnalysis = result.data.activities;
                            $scope.workTrendAnalysisUnits = result.data.units;

                            var dataArray = {};
                            dataArray.labels = [];

                            var series = [];

                            var nearMissEventsArray = [];
                            if($scope.workTrendAnalysis["near-miss-events"]){
                                var totalSlipsTripsFalls = $scope.workTrendAnalysis["near-miss-events"].fall.TotalSlipTripFallCount;
                                for(var i =0; i < totalSlipsTripsFalls.length; i++){
                                    dataArray.labels.push(totalSlipsTripsFalls[i].date);
                                    nearMissEventsArray.push(totalSlipsTripsFalls[i].value);
                                }

                                series.push({
                                    name: "Trips & Falls",
                                    data: nearMissEventsArray
                                });
                            }


                            if($scope.workTrendAnalysis["working-from-heights"]){
                                var workingFromheightsArray = [];
                                var workingFromheights = $scope.workTrendAnalysis["working-from-heights"].WorkingHeightCount;
                                for(var i =0; i < workingFromheights.length; i++){
                                    workingFromheightsArray.push(workingFromheights[i].value);
                                }

                                series.push({
                                    name: "Working From heights",
                                    data: workingFromheightsArray
                                });
                            }


                            if($scope.workTrendAnalysis["bending"]){
                                var bendingArray = [];
                                var bending = $scope.workTrendAnalysis["bending"].BendingCount;
                                for(var i =0; i < bending.length; i++){
                                    bendingArray.push(bending[i].value);
                                }

                                series.push({
                                    name: "Bending",
                                    data: bendingArray
                                });
                            }

                            /*var walkingArray = [];
                            var walking = $scope.workTrendAnalysis["work-time"].walking.HowLong;
                            for(var i =0; i < walking.length; i++){
                                walkingArray.push(walking[i].value);
                            }

                            var bendingDurationArray = [];
                            var bendingDuration = $scope.workTrendAnalysis.bending.BendingTime;
                            for(var i =0; i < bendingDuration.length; i++){
                                bendingDurationArray.push(bendingDuration[i].value);
                            }

                            var twistingArray = [];
                            var twisting = $scope.workTrendAnalysis.bending.TwistingTime;
                            for(var i =0; i < twisting.length; i++){
                                twistingArray.push(twisting[i].value);
                            }

                            var standingArray = [];
                            var standing = $scope.workTrendAnalysis["work-time"]["idle-time"].IdleTimeStanding;
                            for(var i =0; i < standing.length; i++){
                                standingArray.push(standing[i].value);
                            }

                            var otherArray = [];
                            var other = $scope.workTrendAnalysis["work-time"].others.HowLong;
                            for(var i =0; i < other.length; i++){
                                otherArray.push(other[i].value);
                            }*/


                            // var unit = $scope.workTrendAnalysisUnits["work-time"].walking.HowLong;



                            Highcharts.chart('trend-chart', {
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
                                    labels : {
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
                                    labels : {
                                        style: {
                                            color: '#ffffff'
                                        }
                                    },
                                    gridLineColor: 'transparent'
                                },
                                legend: {
                                    enabled: true,
                                    itemStyle:{
                                        color: '#fff'
                                    }

                                },
                                credits: {
                                    enabled: false
                                },
                                series: series

                            });

                            // Highcharts.chart('work-trend-chart', {
                            //     colors: ['#F99D1C', '#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee',
                            //         '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
                            //     chart: {
                            //         type: 'column',
                            //         backgroundColor: 'transparent'
                            //     },
                            //     title: {
                            //         text: ''
                            //     },
                            //
                            //     xAxis: {
                            //         categories: dataArray.labels,
                            //         style: {
                            //             color: '#ffffff'
                            //         },
                            //         labels : {
                            //             style: {
                            //                 color: '#ffffff'
                            //             }
                            //         }
                            //     },
                            //
                            //     yAxis: {
                            //         title: {
                            //             text: 'Duration (' + unit + ')' ,
                            //             style: {
                            //                 color: '#ffffff'
                            //             }
                            //         },
                            //         labels : {
                            //             style: {
                            //                 color: '#ffffff'
                            //             }
                            //         },
                            //         gridLineColor: 'transparent'
                            //     },
                            //     legend: {
                            //         enabled: true,
                            //         itemStyle:{
                            //             color: '#fff'
                            //         }
                            //
                            //     },
                            //     plotOptions: {
                            //         column: {
                            //             stacking: 'normal',
                            //             dataLabels: {
                            //                 enabled: false
                            //             }
                            //         }
                            //     },
                            //     credits: {
                            //         enabled: false
                            //     },
                            //     series: [
                            //         {
                            //             name: "Walking",
                            //             data: walkingArray
                            //         },
                            //         {
                            //             name: "Bending",
                            //             data: bendingDurationArray
                            //         },
                            //         {
                            //             name: "Twisting",
                            //             data: twistingArray
                            //
                            //         },
                            //         {
                            //             name: "Sitting",
                            //             data: sittingArray
                            //
                            //         },
                            //         {
                            //             name: "Standing",
                            //             data: standingArray
                            //
                            //         },
                            //         {
                            //             name: "Others",
                            //             data: otherArray
                            //
                            //         }
                            //
                            //     ]
                            //
                            // });


                            // $scope.showChart(STRINGS.TREND_WORK_INCIDENTS);
                        }, function(error) {
                            $ionicLoading.hide();
                        });


                };



            }]);
})();
