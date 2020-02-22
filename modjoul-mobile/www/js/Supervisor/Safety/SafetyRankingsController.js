/* global angular */
/* global console */
/* global moment */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
(function () {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('SafetyRankingsController', ['$scope', '$localStorage', '$ionicPopup', 'LeaderboardService', 'SupervisorEmployeeService',
            '$ionicSlideBoxDelegate', '$ionicLoading', 'STRINGS', 'SupervisorMetricsService', 'NearMissEventsService', 'AggressiveEventsService',
            function ($scope, $localStorage, $ionicPopup, LeaderboardService, SupervisorEmployeeService, $ionicSlideBoxDelegate, $ionicLoading,
                      STRINGS, SupervisorMetricsService, NearMissEventsService, AggressiveEventsService) {

                var selectedPeriodType = STRINGS.TYPESEGMENTS[0];
                var responseCount = 0;
                $scope.selectedRankType = STRINGS.SAFETYRANKSEGMENTS[0];

                $scope.shownAccordion = 'card1';


                $scope.$on('dateSelected', function () {
                    $scope.doRefresh();
                });

                $scope.$on('empSelected', function () {
                    $scope.doRefresh();
                });

                $scope.toggleGroup = function (group) {
                    console.log(group);
                    console.log($scope.isAccordionShown(group));
                    if ($scope.isAccordionShown(group)) {
                        $scope.shownAccordion = null;
                    } else {
                        $scope.shownAccordion = group;
                    }
                };

                $scope.isAccordionShown = function (group) {
                    return $scope.shownAccordion === group;
                };


                $scope.doRefresh = function () {
                    var selectedDate = $localStorage.selectedDate || moment().subtract(1, "days").format("YYYY-MM-DD");
                    var startDate = moment(selectedDate, "YYYY-MM-DD").subtract(STRINGS.DATES.DAYS, "days").format("YYYY-MM-DD");

                    var orgId = $localStorage.orgId;

                    //Used for metrics supervisor vs individual emoployee
                    var userId = $localStorage.userId;

                    //Used for supervisor Leaderboard
                    var supervisorUserId = $localStorage.userId;

                    var selectedEmployeeId = $localStorage.selectedEmployee.userId;
                    $scope.selectedEmployee = $localStorage.selectedEmployee.userId;

                    responseCount = 0;


                    $scope.getLeaderboard = function () {

                        SupervisorEmployeeService.GetEmployeesForSupervisor(orgId, supervisorUserId)
                            .then(function (result) {


                                var employees = {};
                                for (var i = 0; i < result.data.length; i++) {
                                    employees[result.data[i].userId] = {};
                                    employees[result.data[i].userId].name = result.data[i].firstName + " " + result.data[i].lastName;
                                    employees[result.data[i].userId].profilePhoto = result.data[i].profilePhoto;
                                    employees[result.data[i].userId].profileMimeType = result.data[i].profileMimeType;
                                }
                                $scope.employees = employees;


                                LeaderboardService.getLeaderBoardAggressiveEvents(orgId, supervisorUserId)
                                    .then(function (result) {

                                        checkAndHideProgressHUD();

                                        var leaderBoard = result.data.leaderboard || [];
                                        leaderBoard.reverse();
                                        var leaderboardAggressiveEvents = [];

                                        for (var i = 0; i < leaderBoard.length; i++) {
                                            var employee = $scope.employees[leaderBoard[i].userId];

                                            leaderboardAggressiveEvents.push({
                                                name: employee.name,
                                                profileMimeType: employee.profileMimeType,
                                                profilePhoto: employee.profilePhoto,
                                                value: leaderBoard[i].value,
                                                rank: i + 1

                                            });
                                        }

                                        $scope.leaderboardAggressiveEvents = leaderboardAggressiveEvents;


                                    }, function () {
                                        checkAndHideProgressHUD();

                                    });

                                LeaderboardService.getLeaderBoardNearMissEvents(orgId, supervisorUserId)
                                    .then(function (result) {

                                        checkAndHideProgressHUD();

                                        var leaderBoard = result.data.leaderboard || [];
                                        leaderBoard.reverse();
                                        var leaderboardNearMissEvents = [];

                                        for (var i = 0; i < leaderBoard.length; i++) {
                                            var employee = $scope.employees[leaderBoard[i].userId];


                                            leaderboardNearMissEvents.push({
                                                name: employee.name,
                                                profileMimeType: employee.profileMimeType,
                                                profilePhoto: employee.profilePhoto,
                                                value: leaderBoard[i].value,
                                                rank: i + 1

                                            });
                                        }

                                        $scope.leaderboardNearMissEvents = leaderboardNearMissEvents;


                                    }, function () {
                                        checkAndHideProgressHUD();

                                    });

                            }, function (error) {
                                console.log(error);
                                $ionicLoading.hide();
                            });

                    };

                    $scope.getLeaderboard();


                    $scope.employeeRankings = {
                        Near_Misses: 0,
                        Aggressive_Events_Drive: 0,
                        Aggressive_Events_Work: 0
                    };

                    var nearMissFactory = null;
                    var aggressiveEventsFactory = null;

                    var seriesParams = null;
                    var summaryParams = null;


                    $scope.safetyEmployeeRankingNearMissEventSegs = {};
                    $scope.safetyEmployeeRankingNearMissEventUnitSegs = {};
                    $scope.safetyEmployeeRankingAggressiveEventDriveSegs = {};
                    $scope.safetyEmployeeRankingAggressiveEventDriveUnitSegs = {};


                    if (selectedEmployeeId == 'all' || !selectedEmployeeId) {
                        nearMissFactory = SupervisorMetricsService;
                        aggressiveEventsFactory = SupervisorMetricsService;
                        userId = $localStorage.userId;
                        seriesParams = {start: startDate , end: selectedDate};
                        summaryParams = {period: selectedDate};

                    }
                    else {
                        nearMissFactory = NearMissEventsService;
                        aggressiveEventsFactory = AggressiveEventsService;
                        userId = selectedEmployeeId;
                        seriesParams = {period: selectedDate};
                        summaryParams = {period: selectedDate};
                    }

                    $scope.getNearMissEventsByPeriod = function (type) {
                        console.log("called");

                        nearMissFactory.getNearMissEvents(summaryParams, orgId, userId).then(function (result) {
                            $scope.safetyEmployeeRankingNearMissEventSegs[type] = result.data.activities.summary;
                            $scope.safetyEmployeeRankingNearMissEventUnitSegs[type] = result.data.units.summary;
                            checkAndHideProgressHUD();

                        }, function (error) {
                            checkAndHideProgressHUD();
                            console.log(error);
                        });

                    };

                    $scope.getAggressiveEventsByPeriod = function (type) {

                        aggressiveEventsFactory.getAggressiveEventsDriveMetrics(summaryParams, orgId, userId).then(function (result) {
                            $scope.safetyEmployeeRankingAggressiveEventDriveSegs[type] = result.data.activities.summary;
                            $scope.safetyEmployeeRankingAggressiveEventDriveUnitSegs[type] = result.data.units;
                            console.log(result);
                            checkAndHideProgressHUD();

                        }, function (error) {
                            checkAndHideProgressHUD();
                            console.error(error);
                        });

                    };

                    $scope.getAggressiveEventsDriveTimeSeries = function () {
                        aggressiveEventsFactory.getAggressiveEventsDriveTimeSeries(seriesParams, orgId, userId)
                            .then(function (result) {

                                checkAndHideProgressHUD();
                                $scope.safetyEmployeeRankingAggressiveDriveSeries = result.data.activities.summary;
                                console.log(result);

                                var data = result.data.activities.summary ? result.data.activities.summary.AggressiveEventsCount : [];

                                var aggressiveDriveTimestamps = [];
                                var aggressiveDriveValues = [];

                                if (data) {
                                    data.reverse();
                                    for (var i = 0; i < data.length; i++) {
                                        aggressiveDriveValues.push(data[i].value);
                                        aggressiveDriveTimestamps.push(moment(data[i].date).format("YYYY-MM-DD"));
                                    }
                                }

                                if (data.AggressiveEventsCount) {
                                    for (var i = 0; i < data.AggressiveEventsCount.length; i++) {
                                        var Count = 0;
                                        for (var j = 0; j < data.AggressiveEventsCount[i].value; j++) {
                                            Count++;
                                            aggressiveDriveTimestamps.push([moment(data.AggressiveEventsCount[i].date).unix(), Count]);
                                        }
                                    }
                                }


                                $scope.aggressiveDriveTimestamps = aggressiveDriveTimestamps;
                                $scope.aggressiveDriveValues = aggressiveDriveValues;

                            }, function (error) {
                                checkAndHideProgressHUD();
                                console.log(error);

                            });
                    };

                    $scope.getNearMissEventsTimeSeries = function () {
                        nearMissFactory.getNearMissEventsTimeSeries(seriesParams, orgId, userId)
                            .then(function (result) {
                                checkAndHideProgressHUD();
                                console.log(result);
                                var data = result.data.activities.summary? result.data.activities.summary.NearMissWork : [] ;
                                var nearMissTimestamps = [];
                                var nearMissValues = [];

                                if (data) {
                                    data.reverse();
                                    for (var i = 0; i < data.length; i++) {
                                        nearMissValues.push(data[i].value);
                                        nearMissTimestamps.push(moment(data[i].date).format("YYYY-MM-DD"));
                                    }
                                }

                                $scope.nearMissTimestamps = nearMissTimestamps;
                                $scope.nearMissValues = nearMissValues;

                            }, function (error) {
                                checkAndHideProgressHUD();
                                console.log(error);

                            });
                    };

                    $scope.getAggressiveEventsWorkTimeSeries = function () {
                        aggressiveEventsFactory.getAggressiveEventsWorkTimeSeries(seriesParams, orgId, userId)
                            .then(function (result) {

                                checkAndHideProgressHUD();
                                $scope.safetyEmployeeRankingAggressiveWorkSeries = result.data.activities.summary;
                                console.log(result);

                                var data = result.data.activities.summary;
                                var aggressiveWorkTimestamps = [];

                                if (data.FallBackwardsCount) {
                                    for (var i = 0; i < data.FallBackwardsCount.length; i++) {
                                        var Count = 0;
                                        for (var j = 0; j < data.FallBackwardsCount[i].value; j++) {
                                            Count++;
                                            aggressiveWorkTimestamps.push([moment(data.FallBackwardsCount[i].date).unix(), Count]);
                                        }
                                    }
                                }

                                $scope.aggressiveWorkTimestamps = aggressiveWorkTimestamps;

                            }, function (error) {
                                checkAndHideProgressHUD();
                                console.log(error);

                            });
                    };


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

                    var getData = function(type){
                        $scope.getNearMissEventsByPeriod(type);
                        $scope.getAggressiveEventsByPeriod(type);
                    };

                    var getSeriesData = function(){
                        $scope.getNearMissEventsTimeSeries();
                        $scope.getAggressiveEventsDriveTimeSeries();
                    };


                    $ionicLoading.show();

                    getDailyData();
                    getWeeklyData();
                    getMonthlyData();
                    getSeriesData();

                };

                $scope.doRefresh();


                function updateVeriables() {
                    $scope.safetyEmployeeRankingNearMissEvents = $scope.safetyEmployeeRankingNearMissEventSegs[selectedPeriodType];
                    $scope.safetyEmployeeRankingNearMissEventsUnits = $scope.safetyEmployeeRankingNearMissEventUnitSegs[selectedPeriodType];
                    $scope.safetyEmployeeRankingAggressiveEventsDrive = $scope.safetyEmployeeRankingAggressiveEventDriveSegs[selectedPeriodType];
                    $scope.safetyEmployeeRankingAggressiveEventsDriveUnits = $scope.safetyEmployeeRankingAggressiveEventDriveUnitSegs[selectedPeriodType];

                }

                $scope.segmentClicked = function ($index) {
                    selectedPeriodType = STRINGS.TYPESEGMENTS[$index];
                    updateVeriables();
                    $scope.$apply();
                };

                $scope.rankingSegmentClicked = function ($index) {
                  $scope.selectedRankType = STRINGS.SAFETYRANKSEGMENTS[$index];
                  $scope.$apply();
                };

                function checkAndHideProgressHUD() {
                    responseCount++;
                    if (responseCount >= 10) {
                        $ionicLoading.hide();
                        $scope.$broadcast('scroll.refreshComplete');
                        updateVeriables();
                    }
                }


                $scope.showAggressiveDriveTimeGraph = function () {
                    $scope.chartMetric = 'Event';
                    $scope.chartTitle= "Aggressive Driving Events";

                    $scope.graphOptions = {"format": "<b>"+$scope.chartTitle+"</b><br/>",
                        "color": STRINGS.COLORS.MODJOUL_PINK, metric:$scope.chartMetric, property: $scope.prop
                    };

                    $scope.graph = {data: {timestamps: $scope.aggressiveDriveTimestamps,values:$scope.aggressiveDriveValues},
                        options: $scope.graphOptions};

                    $ionicPopup.show({
                        templateUrl: "templates/graphs/line-chart.html",
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

                $scope.showNearMissEventsGraph = function () {
                    $scope.chartMetric = 'Count';
                    $scope.chartTitle= "Near Miss Events";

                    $scope.graphOptions = {"format": "<b>"+$scope.chartTitle+"</b><br/>",
                        "color": STRINGS.COLORS.MODJOUL_PINK, metric:$scope.chartMetric, property: $scope.prop
                    };

                    $scope.graph = {data: {timestamps: $scope.nearMissTimestamps,values:$scope.nearMissValues},
                        options: $scope.graphOptions};

                    $ionicPopup.show({
                        templateUrl: "templates/graphs/line-chart.html",
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

                $scope.showAggressiveWorkTimeGraph = function () {
                    $scope.graphOptions = {
                        "tooltipHeader": "<b>Aggressive Work Time</b><br/>",
                        "color": "#0085c3"
                    };

                    $scope.graph = {data: $scope.aggressiveWorkTimestamps, options: $scope.graphOptions};
                    $ionicPopup.show({
                        templateUrl: "templates/graphs/scatter-graph.html",
                        scope: $scope,
                        cssClass: 'popup-graph',
                        title: "Aggressive Work Time",
                        buttons: [
                            {
                                text: '<b>Close</b>',
                                type: 'btn btn-info'
                            }
                        ]
                    });
                };


            }]);
})();
