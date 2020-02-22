/* global angular */
/* global moment */
(function () {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('SafetyBendsCtrl',
            function ($scope, $localStorage, $ionicLoading, BendsService, $ionicPopup, STRINGS, $log) {

                $scope.strings = STRINGS;
                $scope.triggerValue = 1;

                var angleRangeTitles = ["21 - 30", "31 - 40", "41 - 50", "51 - 60", "61 - 70", "Above 70"];

                $scope.employeeName = $localStorage.profile.firstName;

                $scope.isSeriesGraphShowing = true;

                $scope.$on("dateSelected", function () {
                    $scope.doRefresh();
                });

                var selectedType = STRINGS.TYPESEGMENTS[0];
                $scope.selectedTypeForBendsSeries = selectedType; //Added by Tharusha for make the front seriesgraph invicible on weekly and monthly segments

                $scope.segmentClicked = function ($index) {
                    selectedType = STRINGS.TYPESEGMENTS[$index];
                    $scope.bendsSummary = $scope.bendsSummarySegs[selectedType];
                    $scope.bendsSummaryUnits = $scope.bendsUnitSegs[selectedType];
                    $scope.fillBendingAngleRangesGraph();
                    $scope.selectedTypeForBendsSeries = selectedType; //Added by Tharusha for make the front seriesgraph invicible on weekly and monthly segments

                    // $scope.isSeriesGraphShowing = $index === 0;
                    $scope.$apply();
                };

                function getSum(arr) {
                    var sum = 0;
                    for(var i =0; i < arr.length; i++) {
                        sum += arr[i];
                    }
                    return sum;
                }

                $scope.doRefresh = function () {

                    $scope.triggerValue += 1;

                    var selectedDate = $localStorage.selectedDate || moment().format("YYYY-MM-DD");
                    var seriesParams = {period: selectedDate};
                    var summaryParams = {period: selectedDate};

                    var orgId = $localStorage.orgId;
                    var userId = $localStorage.userId;
                    var duration = "hour";
                    var responseCount = 0;

                    $scope.bendsSummarySegs = {};
                    $scope.bendsUnitSegs = {};

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
                        BendsService.getBendsSummary(summaryParams, orgId, userId).then(function (result) {
                            $log.debug(result);
                            if (result.status === 200) {
                                $scope.bendsSummarySegs[type] = result.data.activities;
                                $scope.bendsUnitSegs[type] = result.data.units;
                                $scope.bendsSummary = $scope.bendsSummarySegs[selectedType];
                                $scope.bendsSummaryUnits = $scope.bendsUnitSegs[selectedType];
                                $scope.fillBendingAngleRangesGraph();
                            }
                            checkAndHideProgressHUD();

                        }, function (error) {
                            $log.debug(error);
                            checkAndHideProgressHUD();
                        });
                    };


                    var getBendingSeriesData = function () {
                        BendsService.getBendsSeries(seriesParams, orgId, userId, duration).then(function (result) {
                            if (result.status === 200) {
                                $scope.bendingSeries = result.data.activities;
                                $scope.bendingSeriesUnits = result.data.units;
                                $scope.fillGraph();
                            }
                            checkAndHideProgressHUD();

                        }, function () {
                            checkAndHideProgressHUD();
                        });
                    };


                    function checkAndHideProgressHUD() {
                        responseCount++;
                        if (responseCount >= 2) {
                            $ionicLoading.hide();
                            $scope.$broadcast("scroll.refreshComplete");
                        }
                    }


                    $ionicLoading.show();

                    getDailyData();
                    getWeeklyData();
                    getMonthlyData();
                    getBendingSeriesData();

                };

                $scope.doRefresh();

                $scope.fillGraph = function () {
                    var chartTimestamps = [];
                    var chartValues = [];
                    var dataArray = [];
                    var unitLabel;

                    //dataArray = Array.from(($scope.bendingSeries[STRINGS.ACTIVITIES_MAPPING.BENDING_PARENT2]) ? $scope.bendingSeries[STRINGS.ACTIVITIES_MAPPING.BENDING_PARENT2][STRINGS.ACTIVITIES_MAPPING.BENDING_COUNT] : []);
                    dataArray = Array.from(($scope.bendingSeries.bending) ? $scope.bendingSeries.bending.TotalBendingCount : []);

                    unitLabel = $scope.bendingSeriesUnits && $scope.bendingSeriesUnits.bending ? $scope.bendingSeriesUnits.bending.TotalBendingCount : "";
                    $scope.chartMetric = "Count";
                    $scope.unit = unitLabel;
                    $scope.prop = "dark";


                    for (var i = 0; i < dataArray.length; i++) {
                        var time = moment(dataArray[i].timestamp).format("HH:mm");
                        var timeAddedOneHour = moment(dataArray[i].timestamp).add(1,'hours').format("HH:mm");
                        chartTimestamps.push(time + "-" + timeAddedOneHour);
                        chartValues.push(dataArray[i].value);
                    }

                    $scope.chartTimestamps = chartTimestamps;
                    $scope.chartValues = chartValues;

                    $scope.graphOptions = {
                        "color": "#0085c3", metric: $scope.chartMetric, property: $scope.prop, units: $scope.unit, title: "Bend Count"
                    };

                    $scope.chartData = {values: $scope.chartValues, data: $scope.chartTimestamps, property: "dark"};


                };

                $scope.fillBendingAngleRangesGraph = function () {

                    var unitLabel;

                    var angleRangesDuration = [];
                    var angleRangesCounts = [];
                    var angleCountNoAccel = [];
                    var angleCountAccel = [];
                    var angleCountTwists = [];
                    var angleCountTwistsAccell = [];

                   if($scope.bendsSummary && $scope.bendsSummary.bending_times && $scope.bendsSummary.bending_times.BendTime21To30){
                        angleRangesDuration.push(parseFloat($scope.bendsSummary.bending_times.BendTime21To30.toFixed(2)));
                    }
                    else {
                        angleRangesDuration.push(0);
                    }

                    if($scope.bendsSummary && $scope.bendsSummary.bending_times && $scope.bendsSummary.bending_times.BendTime31To40){
                        angleRangesDuration.push(parseFloat($scope.bendsSummary.bending_times.BendTime31To40.toFixed(2)));
                    }
                    else {
                        angleRangesDuration.push(0);
                    }

                    if($scope.bendsSummary && $scope.bendsSummary.bending_times && $scope.bendsSummary.bending_times.BendTime41To50){
                        angleRangesDuration.push(parseFloat($scope.bendsSummary.bending_times.BendTime41To50.toFixed(2)));
                    }
                    else {
                        angleRangesDuration.push(0);
                    }

                    if($scope.bendsSummary && $scope.bendsSummary.bending_times && $scope.bendsSummary.bending_times.BendTime51To60){
                        angleRangesDuration.push(parseFloat($scope.bendsSummary.bending_times.BendTime51To60.toFixed(2)));
                    }
                    else {
                        angleRangesDuration.push(0);
                    }

                    if($scope.bendsSummary && $scope.bendsSummary.bending_times && $scope.bendsSummary.bending_times.BendTime61To70){
                        angleRangesDuration.push(parseFloat($scope.bendsSummary.bending_times.BendTime61To70.toFixed(2)));
                    }
                    else {
                        angleRangesDuration.push(0);
                    }


                    if($scope.bendsSummary && $scope.bendsSummary.bending_times && $scope.bendsSummary.bending_times.BendTime70){
                        angleRangesDuration.push(parseFloat($scope.bendsSummary.bending_times.BendTime70.toFixed(2)));
                    }
                    else {
                        angleRangesDuration.push(0);
                    }

                    //Counts
                    if($scope.bendsSummary && $scope.bendsSummary.bending_counts && $scope.bendsSummary.bending_counts.BendTime21To30){
                        angleRangesCounts.push(parseFloat($scope.bendsSummary.bending_counts.BendTime21To30.toFixed(2)));
                    }
                    else {
                        angleRangesCounts.push(0);
                    }

                    if($scope.bendsSummary && $scope.bendsSummary.bending_counts && $scope.bendsSummary.bending_counts.BendTime31To40){
                        angleRangesCounts.push(parseFloat($scope.bendsSummary.bending_counts.BendTime31To40.toFixed(2)));
                    }
                    else {
                        angleRangesCounts.push(0);
                    }

                    if($scope.bendsSummary && $scope.bendsSummary.bending_counts && $scope.bendsSummary.bending_counts.BendTime41To50){
                        angleRangesCounts.push(parseFloat($scope.bendsSummary.bending_counts.BendTime41To50.toFixed(2)));
                    }
                    else {
                        angleRangesCounts.push(0);
                    }

                    if($scope.bendsSummary && $scope.bendsSummary.bending_counts && $scope.bendsSummary.bending_counts.BendTime51To60){
                        angleRangesCounts.push(parseFloat($scope.bendsSummary.bending_counts.BendTime51To60.toFixed(2)));
                    }
                    else {
                        angleRangesCounts.push(0);
                    }

                    if($scope.bendsSummary && $scope.bendsSummary.bending_counts && $scope.bendsSummary.bending_counts.BendTime61To70){
                        angleRangesCounts.push(parseFloat($scope.bendsSummary.bending_counts.BendTime61To70.toFixed(2)));
                    }
                    else {
                        angleRangesCounts.push(0);
                    }


                    if($scope.bendsSummary && $scope.bendsSummary.bending_counts && $scope.bendsSummary.bending_counts.BendTime70){
                        angleRangesCounts.push(parseFloat($scope.bendsSummary.bending_counts.BendTime70.toFixed(2)));
                    }
                    else {
                        angleRangesCounts.push(0);
                    }


                    //Bending No Accel Counts
                    if ($scope.bendsSummary && $scope.bendsSummary.bending_counts && $scope.bendsSummary.bending_counts.BendCount21_30NoAccel) {
                        angleCountNoAccel.push(parseFloat($scope.bendsSummary.bending_counts.BendCount21_30NoAccel.toFixed(2)));
                    }
                    else {
                        angleCountNoAccel.push(0);
                    }

                    if ($scope.bendsSummary && $scope.bendsSummary.bending_counts && $scope.bendsSummary.bending_counts.BendCount31_40NoAccel) {
                        angleCountNoAccel.push(parseFloat($scope.bendsSummary.bending_counts.BendCount31_40NoAccel.toFixed(2)));
                    }
                    else {
                        angleCountNoAccel.push(0);
                    }

                    if ($scope.bendsSummary && $scope.bendsSummary.bending_counts && $scope.bendsSummary.bending_counts.BendCount41_50NoAccel) {
                        angleCountNoAccel.push(parseFloat($scope.bendsSummary.bending_counts.BendCount41_50NoAccel.toFixed(2)));
                    }
                    else {
                        angleCountNoAccel.push(0);
                    }

                    if ($scope.bendsSummary && $scope.bendsSummary.bending_counts && $scope.bendsSummary.bending_counts.BendCount51_60NoAccel) {
                        angleCountNoAccel.push(parseFloat($scope.bendsSummary.bending_counts.BendCount51_60NoAccel.toFixed(2)));
                    }
                    else {
                        angleCountNoAccel.push(0);
                    }

                    if ($scope.bendsSummary && $scope.bendsSummary.BendingCounts && $scope.bendsSummary.bending_counts.BendCount61_70NoAccel) {
                        angleCountNoAccel.push(parseFloat($scope.bendsSummary.bending_counts.BendCount61_70NoAccel.toFixed(2)));
                    }
                    else {
                        angleCountNoAccel.push(0);
                    }

                    if ($scope.bendsSummary && $scope.bendsSummary.BendingCounts && $scope.bendsSummary.BendingCounts.BendCount70NoAccel) {
                        angleCountNoAccel.push(parseFloat($scope.bendsSummary.bending_counts.BendCount70NoAccel.toFixed(2)));
                    }
                    else {
                        angleCountNoAccel.push(0);
                    }


                    //Bends with accell
                    if ($scope.bendsSummary && $scope.bendsSummary.bending_counts && $scope.bendsSummary.bending_counts.BendCount21_30Accel) {
                        angleCountAccel.push(parseFloat($scope.bendsSummary.bending_counts.BendCount21_30Accel.toFixed(2)));
                    }
                    else {
                        angleCountAccel.push(0);
                    }

                    if ($scope.bendsSummary && $scope.bendsSummary.bending_counts && $scope.bendsSummary.bending_counts.BendCount31_40Accel) {
                        angleCountAccel.push(parseFloat($scope.bendsSummary.bending_counts.BendCount31_40Accel.toFixed(2)));
                    }
                    else {
                        angleCountAccel.push(0);
                    }

                    if ($scope.bendsSummary && $scope.bendsSummary.bending_counts && $scope.bendsSummary.bending_counts.BendCount41_50Accel) {
                        angleCountAccel.push(parseFloat($scope.bendsSummary.bending_counts.BendCount41_50Accel.toFixed(2)));
                    }
                    else {
                        angleCountAccel.push(0);
                    }

                    if ($scope.bendsSummary && $scope.bendsSummary.bending_counts && $scope.bendsSummary.bending_counts.BendCount51_60Accel) {
                        angleCountAccel.push(parseFloat($scope.bendsSummary.bending_counts.BendCount51_60Accel.toFixed(2)));
                    }
                    else {
                        angleCountAccel.push(0);
                    }

                    if ($scope.bendsSummary && $scope.bendsSummary.bending_counts && $scope.bendsSummary.bending_counts.BendCount61_70Accel) {
                        angleCountAccel.push(parseFloat($scope.bendsSummary.bending_counts.BendCount61_70Accel.toFixed(2)));
                    }
                    else {
                        angleCountAccel.push(0);
                    }

                    if ($scope.bendsSummary && $scope.bendsSummary.bending_counts && $scope.bendsSummary.bending_counts.BendCount70Accel) {
                        angleCountAccel.push(parseFloat($scope.bendsSummary.bending_counts.BendCount70Accel.toFixed(2)));
                    }
                    else {
                        angleCountAccel.push(0);
                    }

                    //Bends with Twists
                    if ($scope.bendsSummary && $scope.bendsSummary.bending_counts && $scope.bendsSummary.bending_counts.BendCount21_30Twist) {
                        angleCountTwists.push(parseFloat($scope.bendsSummary.bending_counts.BendCount21_30Twist.toFixed(2)));
                    }
                    else {
                        angleCountTwists.push(0);
                    }

                    if ($scope.bendsSummary && $scope.bendsSummary.bending_counts && $scope.bendsSummary.bending_counts.BendCount31_40Twist) {
                        angleCountTwists.push(parseFloat($scope.bendsSummary.bending_counts.BendCount31_40Twist.toFixed(2)));
                    }
                    else {
                        angleCountTwists.push(0);
                    }

                    if ($scope.bendsSummary && $scope.bendsSummary.bending_counts && $scope.bendsSummary.bending_counts.BendCount41_50Twist) {
                        angleCountTwists.push(parseFloat($scope.bendsSummary.bending_counts.BendCount41_50Twist.toFixed(2)));
                    }
                    else {
                        angleCountTwists.push(0);
                    }

                    if ($scope.bendsSummary && $scope.bendsSummary.bending_counts && $scope.bendsSummary.bending_counts.BendCount51_60Twist) {
                        angleCountTwists.push(parseFloat($scope.bendsSummary.bending_counts.BendCount51_60Twist.toFixed(2)));
                    }
                    else {
                        angleCountTwists.push(0);
                    }

                    if ($scope.bendsSummary && $scope.bendsSummary.bending_counts && $scope.bendsSummary.bending_counts.BendCount61_70Twist) {
                        angleCountTwists.push(parseFloat($scope.bendsSummary.bending_counts.BendCount61_70Twist.toFixed(2)));
                    }
                    else {
                        angleCountTwists.push(0);
                    }

                    if ($scope.bendsSummary && $scope.bendsSummary.bending_counts && $scope.bendsSummary.bending_counts.BendCount70Twist) {
                        angleCountTwists.push(parseFloat($scope.bendsSummary.bending_counts.BendCount70Twist.toFixed(2)));
                    }
                    else {
                        angleCountTwists.push(0);
                    }


                    //Bends with Twists and Accel
                    if ($scope.bendsSummary && $scope.bendsSummary.bending_counts && $scope.bendsSummary.bending_counts.BendCount21_30TwistAccel) {
                        angleCountTwistsAccell.push(parseFloat($scope.bendsSummary.bending_counts.BendCount21_30TwistAccel.toFixed(2)));
                    }
                    else {
                        angleCountTwistsAccell.push(0);
                    }

                    if ($scope.bendsSummary && $scope.bendsSummary.bending_counts && $scope.bendsSummary.bending_counts.BendCount31_40TwistAccel) {
                        angleCountTwistsAccell.push(parseFloat($scope.bendsSummary.bending_counts.BendCount31_40TwistAccel.toFixed(2)));
                    }
                    else {
                        angleCountTwistsAccell.push(0);
                    }

                    if ($scope.bendsSummary && $scope.bendsSummary.bending_counts && $scope.bendsSummary.bending_counts.BendCount41_50TwistAccel) {
                        angleCountTwistsAccell.push(parseFloat($scope.bendsSummary.bending_counts.BendCount41_50TwistAccel.toFixed(2)));
                    }
                    else {
                        angleCountTwistsAccell.push(0);
                    }

                    if ($scope.bendsSummary && $scope.bendsSummary.bending_counts && $scope.bendsSummary.bending_counts.BendCount51_60TwistAccel) {
                        angleCountTwistsAccell.push(parseFloat($scope.bendsSummary.bending_counts.BendCount51_60TwistAccel.toFixed(2)));
                    }
                    else {
                        angleCountTwistsAccell.push(0);
                    }

                    if ($scope.bendsSummary && $scope.bendsSummary.bending_counts && $scope.bendsSummary.bending_counts.BendCount61_70TwistAccel) {
                        angleCountTwistsAccell.push(parseFloat($scope.bendsSummary.bending_counts.BendCount61_70TwistAccel.toFixed(2)));
                    }
                    else {
                        angleCountTwistsAccell.push(0);
                    }

                    if ($scope.bendsSummary && $scope.bendsSummary.bending_counts && $scope.bendsSummary.bending_counts.BendCount70TwistAccel) {
                        angleCountTwistsAccell.push(parseFloat($scope.bendsSummary.bending_counts.BendCount70TwistAccel.toFixed(2)));
                    }
                    else {
                        angleCountTwistsAccell.push(0);
                    }

                    $scope.bendsOnly = getSum(angleCountNoAccel);
                    $scope.bendsAccell = getSum(angleCountAccel);
                    $scope.bendsTwists = getSum(angleCountTwists);
                    $scope.bendsTwistsAccell = getSum(angleCountTwistsAccell);

                    unitLabel = $scope.bendsSummaryUnits && $scope.bendsSummaryUnits.bending_times ? $scope.bendsSummaryUnits.bending_times.BendTime70 : "";
                    var chartMetric = unitLabel ? STRINGS.DURATION + " (" + unitLabel + ")" : STRINGS.DURATION;
                    var unit = unitLabel;
                    $scope.prop = "dark";


                    $scope.angleRangesGraphOptions = {
                        "color": "#0085c3", metric: chartMetric, property: $scope.prop, units: unit, title: "Bending Angles Duration"
                    };

                    $scope.angleRangesCountGraphOptions = {
                        "color": "#0085c3", metric: STRINGS.COUNT, property: $scope.prop, units: '', title: "Bending Angles Count"
                    };


                    $scope.angleRangesChartData = {values: angleRangesDuration, data: angleRangeTitles, property: "dark"};

                    $scope.angleRangesCountChartData = {values: angleRangesCounts, data: angleRangeTitles, property: "dark"};


                    Highcharts.chart('bending-mix-counts', {
                        colors: [
                            STRINGS.BENDING_MIX_COLORS.BENDS,
                            STRINGS.BENDING_MIX_COLORS.BENDS_WITH_ACCEL,
                            STRINGS.BENDING_MIX_COLORS.BENDS_WITH_TWISTS,
                            STRINGS.BENDING_MIX_COLORS.BENDS_WITH__TWIST_ACCEL
                        ],
                        chart: {
                            type: 'column',
                            backgroundColor : 'transparent'
                        },
                        title: {
                            text: 'Bending Types',
                            style: {
                                color: '#ffffff'
                            }
                        },
                        xAxis: {
                            categories: angleRangeTitles,
                            crosshair: true,
                            title: {
                                text: "Range Of Angles Of Bends (Degrees)",
                                style: {
                                    color: '#ffffff'
                                }
                            },
                            labels : {
                                style: {
                                    color: '#ffffff'
                                }
                            }
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: STRINGS.COUNT,
                                style: {
                                    color: '#ffffff'
                                }
                            },
                            gridLineColor: 'transparent',
                            labels : {
                                style: {
                                    color: '#ffffff'
                                }
                            },
                            stackLabels: {
                                enabled: true,
                                style: {
                                    fontWeight: 'bold',
                                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'white'
                                }
                            }
                        },
                        legend: {
                            // y: 25,
                            itemStyle: {
                                color: '#ffffff'
                            },
                            // backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                            // borderColor: '#CCC',
                            borderWidth: 1,
                            shadow: false
                        },
                        credits: {
                            enabled: false
                        },
                        tooltip: {
                            pointFormatter: function () {
                                return this.y;
                            }
                        },
                        plotOptions: {
                            area: {
                                fillOpacity: 0.5
                            },
                            column : {
                                maxPointWidth : 50
                            }
                        },
                        series: [
                            {
                                name: "Bends",
                                stacking: 'normal',
                                data: angleCountNoAccel
                            },
                            {
                                name: "Bends with Acceleration",
                                stacking: 'normal',
                                data: angleCountAccel
                            },
                            {
                                name: "Bends with Twists",
                                stacking: 'normal',
                                data: angleCountTwists
                            },
                            {
                                name: "Bends with Twists & Acceleration",
                                stacking: 'normal',
                                data: angleCountTwistsAccell
                            }
                        ]
                    });

                };


            });
})();
