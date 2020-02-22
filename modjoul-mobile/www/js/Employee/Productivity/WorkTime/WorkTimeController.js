/* global angular */
/* global console */
/* global moment */
/* global Highcharts */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
/* jshint shadow:true */
(function () {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('WorkTimeCtrl', ['$scope', '$rootScope', '$localStorage', 'WorkTimeSummaryService',
            'WorkTimeSeriesService','$ionicSlideBoxDelegate', '$ionicLoading', 'STRINGS', '$ionicPopup',
            'ScorecardConfigService', '$ionicModal', '$filter',
            function ($scope, $rootScope, $localStorage, WorkTimeSummaryService, WorkTimeSeriesService,
                      $ionicSlideBoxDelegate, $ionicLoading, STRINGS,
                      $ionicPopup, ScorecardConfigService, $ionicModal, $filter) {


                $scope.strings = STRINGS;
                var selectedType = STRINGS.TYPESEGMENTS[0];

                $scope.$on("$ionicView.beforeEnter", function () {
                    $scope.$emit('navbarHideEvent', false);
                });

                var orgId = $localStorage.orgId;
                var userId = $localStorage.userId;

                $scope.triggerValue = 1;

                $scope.$on('dateSelected', function () {
                    $scope.doRefresh();
                });

                $scope.segmentClicked = function ($index) {
                    selectedType = STRINGS.TYPESEGMENTS[$index];
                    $scope.workTimes = $scope.workTimeSegs[selectedType];
                    $scope.workUnits = $scope.workUnitSegs[selectedType];
                    $scope.$apply();
                    $scope.drawPieChart();
                };



                $scope.inArray = function (item, array) {
                    return (array.indexOf(item) !== -1);
                };

                $scope.drawPieChart = function () {
                    var dataArray = [];

                    var units = "";

                    if ($scope.configData.workTime.walking) {
                        //units = $scope.workUnits[STRINGS.ACTIVITIES_MAPPING.WALKING_PARENT] ? $scope.workUnits[STRINGS.ACTIVITIES_MAPPING.WALKING_PARENT][STRINGS.ACTIVITIES_MAPPING.HOW_LONG_WALKING] : "";
                        units = $scope.workUnits.walking ? $scope.workUnits.walking.TotalWalkingTime : "";
                        dataArray.push({
                            name: "Walking",
                            //y: $scope.workTimes[STRINGS.ACTIVITIES_MAPPING.WALKING_PARENT] ? $scope.workTimes[STRINGS.ACTIVITIES_MAPPING.WALKING_PARENT][STRINGS.ACTIVITIES_MAPPING.HOW_LONG_WALKING] : 0
                            y: $scope.workTimes.walking ? $scope.workTimes.walking.TotalWalkingTime : 0
                        });
                    }

                    if ($scope.configData.workTime.standing) {
                        //units = $scope.workUnits[STRINGS.ACTIVITIES_MAPPING.IDLE_TIME_PARENT] ? $scope.workUnits[STRINGS.ACTIVITIES_MAPPING.IDLE_TIME_PARENT][STRINGS.ACTIVITIES_MAPPING.IDLE_TIME_STANDING] : "";
                        units = $scope.workUnits.sitting_standing ? $scope.workUnits.sitting_standing.SittingStandingTime : "";
                        dataArray.push({
                            name: "Sitting/Standing",
                            //y: $scope.workTimes[STRINGS.ACTIVITIES_MAPPING.IDLE_TIME_PARENT] ? $scope.workTimes[STRINGS.ACTIVITIES_MAPPING.IDLE_TIME_PARENT][STRINGS.ACTIVITIES_MAPPING.IDLE_TIME_STANDING] : 0
                            y: $scope.workTimes.sitting_standing ? $scope.workTimes.sitting_standing.SittingStandingTime : 0
                        });
                    }

                    //Newly add Stationery
                    //START
                    if ($scope.configData.workTime.stationaryWork) {
                        units = $scope.workUnits.stationary_work ? $scope.workUnits.stationary_work.StationaryWorkTime : "";
                        dataArray.push({
                            name: "Stationery work",
                            y: $scope.workTimes.stationary_work ? $scope.workTimes.stationary_work.StationaryWorkTime : 0
                        });
                    }
                    //END

                    // if ($scope.configData.workTime.sitting) {
                    //     units = $scope.workUnits[STRINGS.ACTIVITIES_MAPPING.SITTING_PARENT] ? $scope.workUnits[STRINGS.ACTIVITIES_MAPPING.SITTING_PARENT][STRINGS.ACTIVITIES_MAPPING.IDLE_TIME_SITTING] : "";
                    //     dataArray.push({
                    //         name: "Reclined Sitting",
                    //         y: $scope.workTimes[STRINGS.ACTIVITIES_MAPPING.SITTING_PARENT] ? $scope.workTimes[STRINGS.ACTIVITIES_MAPPING.SITTING_PARENT][STRINGS.ACTIVITIES_MAPPING.IDLE_TIME_SITTING] : 0
                    //     });
                    // }

                    if ($scope.configData.workTime.driving) {
                        //units = $scope.workUnits[STRINGS.ACTIVITIES_MAPPING.DRIVING_PARENT] ? $scope.workUnits[STRINGS.ACTIVITIES_MAPPING.DRIVING_PARENT][STRINGS.ACTIVITIES_MAPPING.DRIVING_TIME] : "";
                        units = $scope.workUnits.driving ? $scope.workUnits.driving.DrivingTime : "";
                        dataArray.push({
                            name: "Driving",
                            //y: $scope.workTimes[STRINGS.ACTIVITIES_MAPPING.DRIVING_PARENT] ? $scope.workTimes[STRINGS.ACTIVITIES_MAPPING.DRIVING_PARENT][STRINGS.ACTIVITIES_MAPPING.DRIVING_TIME] : 0
                            y: $scope.workTimes.driving ? $scope.workTimes.driving.DrivingTime : 0
                        });
                    }

                    if ($scope.configData.workTime.bending) {
                        //units = $scope.workUnits[STRINGS.ACTIVITIES_MAPPING.BENDING_PARENT] ? $scope.workUnits[STRINGS.ACTIVITIES_MAPPING.BENDING_PARENT][STRINGS.ACTIVITIES_MAPPING.HOW_LONG] : "";
                        units = $scope.workUnits.bending ? $scope.workUnits.bending.TotalBendingTime : "";
                        dataArray.push({
                            name: "Bending",
                            //y: $scope.workTimes[STRINGS.ACTIVITIES_MAPPING.BENDING_PARENT] ? $scope.workTimes[STRINGS.ACTIVITIES_MAPPING.BENDING_PARENT][STRINGS.ACTIVITIES_MAPPING.HOW_LONG] : 0
                            y: $scope.workTimes.bending ? $scope.workTimes.bending.TotalBendingTime : 0
                        });
                    }

                    

                    if ($scope.configData.workTime.twisting) {
                        //units = $scope.workUnits[STRINGS.ACTIVITIES_MAPPING.TWISTING_PARENT] ? $scope.workUnits[STRINGS.ACTIVITIES_MAPPING.TWISTING_PARENT][STRINGS.ACTIVITIES_MAPPING.HOW_LONG] : "";
                        units = $scope.workUnits.twisting ? $scope.workUnits.twisting.TotalTwistingTime : "";
                        dataArray.push({
                            name: "Twisting",
                            //y: $scope.workTimes[STRINGS.ACTIVITIES_MAPPING.TWISTING_PARENT] ? $scope.workTimes[STRINGS.ACTIVITIES_MAPPING.TWISTING_PARENT][STRINGS.ACTIVITIES_MAPPING.HOW_LONG] : 0
                            y: $scope.workTimes.twisting ? $scope.workTimes.twisting.TotalTwistingTime : 0
                        });
                    }

                    if ($scope.configData.workTime.other) {
                        //units = $scope.workUnits[STRINGS.ACTIVITIES_MAPPING.INDOOR_DRIVING_PARENT] ? $scope.workUnits[STRINGS.ACTIVITIES_MAPPING.INDOOR_DRIVING_PARENT][STRINGS.ACTIVITIES_MAPPING.HOW_LONG] : "";
                        units = $scope.workUnits.indoor_driving ? $scope.workUnits.indoor_driving.IndoorDrivingTime : "";
                        dataArray.push({
                            name: "Indoor Driving",
                            //y: $scope.workTimes[STRINGS.ACTIVITIES_MAPPING.INDOOR_DRIVING_PARENT] ? $scope.workTimes[STRINGS.ACTIVITIES_MAPPING.INDOOR_DRIVING_PARENT][STRINGS.ACTIVITIES_MAPPING.HOW_LONG] : 0
                            y: $scope.workTimes.indoor_driving ? $scope.workTimes.indoor_driving.IndoorDrivingTime : 0
                        });
                    }
                    


                    console.log(dataArray);

                    Highcharts.chart('work-time-chart', {
                        chart: {
                            backgroundColor: "transparent",
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            type: 'pie'
                        },
                        colors: [STRINGS.COLORS.MODJOUL_ORANGE, STRINGS.COLORS.MODJOUL_GREEN, STRINGS.COLORS.MODJOUL_BLUE, STRINGS.COLORS.MODJOUL_GRAY,STRINGS.COLORS.MODJOUL_RED,STRINGS.COLORS.MODJOUL_PINK, STRINGS.COLORS.MODJOUL_BROWN, STRINGS.COLORS.MODJOUL_YELLOW],
                        title: {
                            text: '',
                            style: {
                                color: '#FFFFFF'
                            }
                        },
                        tooltip: {
                            pointFormatter: function () {
                                var duration = $filter('timeFormatFilter')(this.y, units).split(":");
                                var hourUnit = duration[0] == 1 ? "hr" : "hrs";
                                var minutesUnit = duration[1] == 1 ? "min" : "mins";
                                var secondsUnit = duration[2] == 1 ? "sec" : "secs";

                                var durationString = duration[0] == 0 ? duration[1] + minutesUnit + " " + duration[2] + secondsUnit : duration[0] + hourUnit + " " + duration[1] + minutesUnit;
                                return durationString;
                            }
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
                            name: '',
                            colorByPoint: true,
                            data: dataArray
                        }]
                    });
                };

                $scope.doRefresh = function () {

                    $scope.triggerValue += 1;

                    var selectedDate = $localStorage.selectedDate || moment().format("YYYY-MM-DD");
                    var seriesParams = {period: selectedDate};
                    var summaryParams = {period: selectedDate};

                    var responseCount = 0;

                    $scope.workTimeSegs = {};
                    $scope.workUnitSegs = {};

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

                        WorkTimeSummaryService.WorkTimeSummaryByPeriod(summaryParams, orgId, userId).then(function (result) {
                            if (result.status === 200) {
                                $scope.workTimeSegs[type] = result.data.activities;
                                $scope.workUnitSegs[type] = result.data.units;

                                $scope.workTimes = $scope.workTimeSegs[selectedType];
                                $scope.workUnits = $scope.workUnitSegs[selectedType];

                                if (type === STRINGS.TYPE_DAILY) {

                                    $scope.drawPieChart();
                                    WorkTimeSeriesService.WorkTimeSeriesByPeriod(seriesParams, orgId, userId).then(function (result) {
                                    
                                        checkAndHideProgressHUD();
                                        if (result.status === 200) {
                                            var data = result.data.activities.summary;
                                            console.log(data);
                                            $scope.workTimeChartData = result.data.activities;
                                            $scope.workSeriesUnits = result.data.units;
                                    
                                    
                                        }
                                    
                                    
                                    }, function () {
                                        checkAndHideProgressHUD();
                                    });
                                }
                                else {
                                    checkAndHideProgressHUD();
                                }
                            }
                            else {
                                checkAndHideProgressHUD();
                            }
                        }, function () {
                            checkAndHideProgressHUD();
                        });
                    };

                    function checkAndHideProgressHUD() {
                        responseCount++;
                        console.log(responseCount);
                        if (responseCount >= 2) {
                            $ionicLoading.hide();
                            $scope.$broadcast('scroll.refreshComplete');
                        }
                    }

                    $scope.showWorkTimeGraph = function (type) {

                        var chartTimestamps = [];
                        var chartValues = [];
                        var dataArray = [];

                        if (type === 'how many') {
                            // if (!$scope.abulatoryMotionSeries.HowManySteps ||  $scope.ambulatoryMotion.HowManySteps == 0)
                            // {
                            //   return;
                            // }

                            dataArray = Array.from(($scope.workTimeChartData.summary) ? $scope.workTimeChartData.summary.HowManySteps : []);
                            dataArray.reverse();
                            var unitLabel = $scope.workSeriesUnits.summary ? $scope.workSeriesUnits.summary.HowManySteps : "";
                            $scope.chartMetric = 'Duration (' + unitLabel + ')';
                            $scope.unit = unitLabel;
                            $scope.chartTitle = "How many steps";
                            $scope.prop = "popup2";
                        }
                        else if (type === 'how far') {
                            // if (!$scope.abulatoryMotionSeries.HowFar ||  $scope.ambulatoryMotion.HowFar == 0)
                            // {
                            //   return;
                            // }
                            dataArray = Array.from(($scope.workTimeChartData.summary) ? $scope.workTimeChartData.summary.HowFar : []);
                            dataArray.reverse();
                            var unitLabel = $scope.workSeriesUnits.summary ? $scope.workSeriesUnits.summary.HowFar : "";
                            $scope.chartMetric = 'Duration (' + unitLabel + ')';
                            $scope.unit = unitLabel;
                            $scope.chartTitle = "How far";
                            $scope.prop = "popup2";
                        }
                        else if (type === 'how long') {
                            // if (!$scope.abulatoryMotionSeries.HowLong ||  $scope.ambulatoryMotion.HowLong == 0)
                            // {
                            //   return;
                            // }
                            dataArray = Array.from(($scope.workTimeChartData.summary) ? $scope.workTimeChartData.summary.HowLong : []);
                            dataArray.reverse();
                            var unitLabel = $scope.workSeriesUnits.summary ? $scope.workSeriesUnits.summary.HowLong : "";
                            $scope.chartMetric = 'Duration (' + unitLabel + ')';
                            $scope.unit = unitLabel;
                            $scope.chartTitle = "How long";
                            $scope.prop = "popup2";
                        }
                        else if (type === 'how fast') {
                            // if (!$scope.abulatoryMotionSeries.HowFast ||  $scope.ambulatoryMotion.HowFast == 0)
                            // {
                            //   return;
                            // }
                            dataArray = Array.from(($scope.workTimeChartData.summary) ? $scope.workTimeChartData.summary.HowFast : []);
                            dataArray.reverse();
                            var unitLabel = $scope.workSeriesUnits.summary ? $scope.workSeriesUnits.summary.HowFast : "";
                            $scope.chartMetric = 'Duration (' + unitLabel + ')';
                            $scope.unit = unitLabel;
                            $scope.chartTitle = "Speed";
                            $scope.prop = "popup2";
                        }
                        else if (type === 'work time') {
                            // if (!$scope.abulatoryMotionSeries.HowFast ||  $scope.ambulatoryMotion.HowFast == 0)
                            // {
                            //   return;
                            // }
                            dataArray = Array.from(($scope.workTimeChartData.summary) ? $scope.workTimeChartData.summary.WorkTime : []);
                            dataArray.reverse();
                            var unitLabel = $scope.workSeriesUnits.summary ? $scope.workSeriesUnits.summary.WorkTime : "";
                            $scope.chartMetric = 'Duration (' + unitLabel + ')';
                            $scope.unit = unitLabel;
                            $scope.chartTitle = "Work Time";
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
                            $scope: $scope,
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


                    $ionicLoading.show();

                    ScorecardConfigService.getScorecardConfigs(userId)
                        .then(function (result) {
                            if (result.status === 200) {
                                console.log(result);

                                var configurationItems = [];
                                var configurationKeyItems = [];
                                var selected = {};
                                var configOptions = result.data;
                                $scope.configData = result.data;

                                getDailyData();
                                getWeeklyData();
                                getMonthlyData();

                                $rootScope.userConfigData = $scope.configData;

                                var count = 0;

                                console.log(configOptions);

                                Object.keys(configOptions).forEach(function (parentKey) {
                                    var parentValue = configOptions[parentKey];
                                    configurationItems[count] = [];
                                    // selected[count] = [];
                                    selected[parentKey] = {};


                                    Object.keys(parentValue).forEach(function (key) {
                                        var value = parentValue[key];
                                        configurationItems[count].push(key);

                                        // if (value) {
                                        //     selected[parentKey][key] = value;
                                        // }
                                        selected[parentKey][key] = value;

                                    });

                                    configurationKeyItems.push({title: parentKey, count: count});
                                    count++;
                                });

                                $scope.selected = selected;
                                $scope.configOptions = configurationItems;
                                $scope.configCategories = configurationKeyItems;

                                console.log($scope.selected);

                            }
                        }, function (error) {
                            console.log(error);
                        });



                };

                $scope.doRefresh();

                $scope.closeConfiguration = function(){
                    $scope.modal.hide();

                    ScorecardConfigService.saveScorecardConfigs($scope.selected, userId)
                        .then(function (result) {

                            $scope.configData = $scope.selected;
                            $rootScope.userConfigData = $scope.selected;

                            $scope.drawPieChart();
                            console.log(result);

                        }, function (error) {

                            console.log(error);
                        });
                };

                $scope.configureScorecard = function () {

                    $ionicModal.fromTemplateUrl('js/Employee/Scorecard/configuration.html', {
                        scope: $scope,
                        animation: 'slide-in-up'
                    }).then(function (modal) {
                        $scope.modal = modal;
                        $scope.modal.show();
                    });

                };


            }
        ]);
})();
