/* global angular */
/* global console */
/* global moment */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
(function () {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('ProductivityRankingsController', ['$scope', '$localStorage', '$ionicPopup', 'LeaderboardService', 'SupervisorEmployeeService',
            '$ionicSlideBoxDelegate', '$ionicLoading', 'STRINGS', 'SupervisorMetricsService', 'IdleTimeSeriesService', 'WorkTimeSeriesService',
            'DriveTimeService', 'ScorecardUserService','$state', 'OrgConfigService', 'UsersService',
            function ($scope, $localStorage, $ionicPopup, LeaderboardService, SupervisorEmployeeService, $ionicSlideBoxDelegate, $ionicLoading,
                      STRINGS, SupervisorMetricsService, IdleTimeSeriesService, WorkTimeSeriesService, DriveTimeService,
                      ScorecardUserService, $state, OrgConfigService, UsersService) {


                $scope.strings = STRINGS;
                var selectedPeriodType = STRINGS.TYPESEGMENTS[0];
                $scope.selectedRankType = STRINGS.RANKSEGMENTS[0];
                $scope.shownAccordion = 'card1';
                var responseCount = 0;

                $scope.$on("$ionicView.beforeEnter", function () {
                    $scope.$emit('navbarHideEvent', false);
                });

                $scope.scorecardSegs = {};
                $scope.scorecardSegs[STRINGS.TYPE_DAILY] = {};
                $scope.scorecardSegs[STRINGS.TYPE_WEEKLY] = {};
                $scope.scorecardSegs[STRINGS.TYPE_MONTHLY] = {};

                $scope.scorecardUnitsSegs = {};
                $scope.scorecardUnitsSegs[STRINGS.TYPE_DAILY] = {};
                $scope.scorecardUnitsSegs[STRINGS.TYPE_WEEKLY] = {};
                $scope.scorecardUnitsSegs[STRINGS.TYPE_MONTHLY] = {};

                $scope.fallCountSegs = {};
                $scope.fallCountSegs[STRINGS.TYPE_DAILY] = {};
                $scope.fallCountSegs[STRINGS.TYPE_WEEKLY] = {};
                $scope.fallCountSegs[STRINGS.TYPE_MONTHLY] = {};

                //Used for supervisor Leaderboard
                var supervisorUserId = $localStorage.userId;
                var orgId = $localStorage.orgId;

                $scope.selectedItem = "work-time";

                $scope.$on('dateSelected', function () {
                    $scope.getScorecard();
                    $scope.getLeaderboard();
                });

                $scope.$on('empSelected', function () {
                    $scope.getScorecard();
                    $scope.getLastActivityTime();
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

                OrgConfigService.getOrgConfiguration(orgId)
                    .then(function (result) {
                        if (result.status === 200) {

                            $localStorage.orgConfigData = result.data;

                        }
                    }, function (error) {
                        console.log(error);
                    });

                $scope.getScorecard = function() {
                    var selectedDate = $localStorage.selectedDate || moment().format("YYYY-MM-DD");
                    $scope.selectedDate = selectedDate;
                    var startDate = moment(selectedDate, "YYYY-MM-DD").subtract(STRINGS.DATES.DAYS, "days").format("YYYY-MM-DD");

                    var orgId = $localStorage.orgId;

                    //Used for metrics supervisor vs individual emoployee
                    var userId = $localStorage.userId;

                    //Used for supervisor Leaderboard
                    var supervisorUserId = $localStorage.userId;

                    $scope.selectedEmployeeProfile = $localStorage.selectedEmployee;

                    $scope.selectedEmployeeName = $localStorage.selectedEmployee.firstName.charAt(0) + ". " + $localStorage.selectedEmployee.lastName;

                    $scope.selectedEmployee = $localStorage.selectedEmployee.userId;

                    responseCount = 0;

                    $scope.getLastActivityTime();

                    var dailyParams = {period: selectedDate, type:STRINGS.TYPE_DAILY};

                    var week = moment(selectedDate).format("YYYY-[W]ww");
                    var weeklyParams = {period: week, type:STRINGS.TYPE_WEEKLY};

                    var month = moment(selectedDate).format("YYYY-MM");
                    var monthlyParams = {period: month, type:STRINGS.TYPE_MONTHLY};

                    $ionicLoading.show();

                    if($scope.selectedEmployee === STRINGS.ALL){

                        SupervisorMetricsService.getScorecardPeriodValues(dailyParams, orgId, supervisorUserId)
                            .then(function (result) {
                                checkAndHideProgressHUD();

                                if (result.status === 200) {

                                    $scope.scorecardSegs[STRINGS.TYPE_DAILY] = result.data.activities;
                                    $scope.scorecardUnitsSegs[STRINGS.TYPE_DAILY] = result.data.units;
                                    $scope.fallCountSegs[STRINGS.TYPE_DAILY] = result.data.activities['near-miss-events'] ? (parseInt(result.data.activities['near-miss-events'].fall.FallForwardsCount || 0, 10) +
                                        parseInt(result.data.activities['near-miss-events'].fall.FallBackwardsCount || 0, 10)) : 0;

                                }
                                // $scope.$broadcast('scroll.refreshComplete');

                            }, function () {
                                checkAndHideProgressHUD();
                            });

                        SupervisorMetricsService.getScorecardPeriodValues(weeklyParams, orgId, supervisorUserId)
                            .then(function (result) {
                                checkAndHideProgressHUD();

                                console.log(result);

                                if (result.status === 200) {

                                    $scope.scorecardSegs[STRINGS.TYPE_WEEKLY] = result.data.activities;
                                    $scope.scorecardUnitsSegs[STRINGS.TYPE_WEEKLY] = result.data.units;
                                    $scope.fallCountSegs[STRINGS.TYPE_WEEKLY] = result.data.activities['near-miss-events'] ? (parseInt(result.data.activities['near-miss-events'].fall.FallForwardsCount || 0, 10) +
                                        parseInt(result.data.activities['near-miss-events'].fall.FallBackwardsCount || 0, 10)) : 0;

                                }
                                // $scope.$broadcast('scroll.refreshComplete');

                            }, function () {
                                checkAndHideProgressHUD();
                            });

                        SupervisorMetricsService.getScorecardPeriodValues(monthlyParams, orgId, supervisorUserId)
                            .then(function (result) {
                                checkAndHideProgressHUD();

                                console.log(result);

                                if (result.status === 200) {

                                    $scope.scorecardSegs[STRINGS.TYPE_MONTHLY] = result.data.activities;
                                    $scope.scorecardUnitsSegs[STRINGS.TYPE_MONTHLY] = result.data.units;
                                    $scope.fallCountSegs[STRINGS.TYPE_MONTHLY] = result.data.activities['near-miss-events'] ? (parseInt(result.data.activities['near-miss-events'].fall.FallForwardsCount || 0, 10) +
                                        parseInt(result.data.activities['near-miss-events'].fall.FallBackwardsCount || 0, 10)) : 0;

                                }
                                // $scope.$broadcast('scroll.refreshComplete');

                            }, function () {
                                checkAndHideProgressHUD();
                            });


                    }
                    else {
                        ScorecardUserService.getScorecardPeriodValues(dailyParams, orgId, $scope.selectedEmployee).then(function (result) {
                            checkAndHideProgressHUD();
                            if (result.status === 200) {

                                $scope.scorecardSegs[STRINGS.TYPE_DAILY] = result.data.activities;
                                $scope.scorecardUnitsSegs[STRINGS.TYPE_DAILY] = result.data.units;
                                $scope.fallCountSegs[STRINGS.TYPE_DAILY] = result.data.activities[STRINGS.ACTIVITIES_MAPPING.NEAR_MISS_WORK_PARENT] ? (parseInt(result.data.activities[STRINGS.ACTIVITIES_MAPPING.NEAR_MISS_WORK_PARENT][STRINGS.ACTIVITIES_MAPPING.FALL_PARENT][STRINGS.ACTIVITIES_MAPPING.FALL_FORWARDS] || 0, 10) +
                                    parseInt(result.data.activities[STRINGS.ACTIVITIES_MAPPING.NEAR_MISS_WORK_PARENT][STRINGS.ACTIVITIES_MAPPING.FALL_PARENT][STRINGS.ACTIVITIES_MAPPING.FALL_BACKWARDS] || 0, 10)) : 0;
                                updateVariables();
                            }
                            // $scope.$broadcast('scroll.refreshComplete');

                        }, function () {checkAndHideProgressHUD();
                        });


                        ScorecardUserService.getScorecardPeriodValues(weeklyParams, orgId, $scope.selectedEmployee).then(function (result) {
                            $ionicLoading.hide();

                            checkAndHideProgressHUD();
                            if (result.status === 200) {

                                $scope.scorecardSegs[STRINGS.TYPE_WEEKLY] = result.data.activities;
                                $scope.scorecardUnitsSegs[STRINGS.TYPE_WEEKLY] = result.data.units;
                                $scope.fallCountSegs[STRINGS.TYPE_WEEKLY] = result.data.activities[STRINGS.ACTIVITIES_MAPPING.NEAR_MISS_WORK_PARENT] ? (parseInt(result.data.activities[STRINGS.ACTIVITIES_MAPPING.NEAR_MISS_WORK_PARENT][STRINGS.ACTIVITIES_MAPPING.FALL_PARENT][STRINGS.ACTIVITIES_MAPPING.FALL_FORWARDS] || 0, 10) +
                                    parseInt(result.data.activities[STRINGS.ACTIVITIES_MAPPING.NEAR_MISS_WORK_PARENT][STRINGS.ACTIVITIES_MAPPING.FALL_PARENT][STRINGS.ACTIVITIES_MAPPING.FALL_BACKWARDS] || 0, 10)) : 0;
                                updateVariables();
                            }
                            // $scope.$broadcast('scroll.refreshComplete');

                        }, function () {
                            checkAndHideProgressHUD();
                        });




                        ScorecardUserService.getScorecardPeriodValues(monthlyParams, orgId, $scope.selectedEmployee).then(function (result) {
                            $ionicLoading.hide();
                            checkAndHideProgressHUD();
                            if (result.status === 200) {

                                $scope.scorecardSegs[STRINGS.TYPE_MONTHLY] = result.data.activities;
                                $scope.scorecardUnitsSegs[STRINGS.TYPE_MONTHLY] = result.data.units;
                                $scope.fallCountSegs[STRINGS.TYPE_MONTHLY] = result.data.activities[STRINGS.ACTIVITIES_MAPPING.NEAR_MISS_WORK_PARENT] ? (parseInt(result.data.activities[STRINGS.ACTIVITIES_MAPPING.NEAR_MISS_WORK_PARENT][STRINGS.ACTIVITIES_MAPPING.FALL_PARENT][STRINGS.ACTIVITIES_MAPPING.FALL_FORWARDS] || 0, 10) +
                                    parseInt(result.data.activities[STRINGS.ACTIVITIES_MAPPING.NEAR_MISS_WORK_PARENT][STRINGS.ACTIVITIES_MAPPING.FALL_PARENT][STRINGS.ACTIVITIES_MAPPING.FALL_BACKWARDS] || 0, 10)) : 0;
                                updateVariables();
                            }
                            // $scope.$broadcast('scroll.refreshComplete');

                        }, function () {
                            checkAndHideProgressHUD();
                        });
                    }


                };

                $scope.getLeaderboard = function () {

                    $scope.leaderboardAll = {};
                    LeaderboardService.getProductivityLeaderboardByItem(orgId, supervisorUserId, $scope.selectedItem,$scope.selectedDate)
                        .then(function (result) {

                            checkAndHideProgressHUD();

                            var leaderBoard = result.data.leaderboard || [];

                            var leaderboardWorkTimeList = [];

                            for (var i = 0; i < leaderBoard.length; i++) {
                                var employee = $scope.employees[leaderBoard[i].userId];

                                console.log(employee);

                                leaderboardWorkTimeList.push({
                                    name: employee.name,
                                    initials: employee.initials,
                                    profileMimeType: employee.profileMimeType,
                                    profilePhoto: employee.profilePhoto,
                                    value: leaderBoard[i].value,
                                    rank: i + 1

                                });
                            }

                            $scope.leaderboardWorkTimeList = leaderboardWorkTimeList;
                            $scope.leaderboardAll["Work Time"] = leaderboardWorkTimeList;

                        }, function () {
                            checkAndHideProgressHUD();

                        });
                };


                $scope.getLastActivityTime = function () {
                    console.log("getLastActivityTime");
                    var orgId = $localStorage.orgId;
                    var userId = "";
                    if ($localStorage.profile.role == "supervisor") {
                        userId = $localStorage.selectedEmployee ? $localStorage.selectedEmployee.userId : null;
                    }
                    else {
                        userId = $localStorage.userId;
                    }

                    if (userId) {
                        UsersService.getLastActivityTime(orgId, userId)
                            .then(function (result) {
                                if (result.data) {
                                    $scope.lastActivityTime = result.data.timestamp;
                                }
                                else {
                                    $scope.lastActivityTime = null;
                                }
                            }, function () {

                            });
                    }
                    else {
                        $scope.lastActivityTime = null;
                    }

                };

                $scope.getEmployeesForSupervisor = function(){
                    SupervisorEmployeeService.GetEmployeesForSupervisor(orgId, supervisorUserId)
                        .then(function (result) {

                            $scope.leaderboardAll = {};
                            var employees = {};

                            for (var i = 0; i < result.data.length; i++) {
                                employees[result.data[i].userId] = {};
                                employees[result.data[i].userId].name = result.data[i].firstName + " " + result.data[i].lastName;
                                employees[result.data[i].userId].initials = result.data[i].firstName.charAt(0).toUpperCase() + " " + result.data[i].lastName.charAt(0).toUpperCase();
                                employees[result.data[i].userId].profilePhoto = result.data[i].profilePhoto;
                                employees[result.data[i].userId].profileMimeType = result.data[i].profileMimeType;
                            }
                            $scope.employees = employees;

                            $scope.getLeaderboard();

                        }, function (error) {
                            console.log(error);

                        });
                };


                $scope.doRefresh = function () {
                    var selectedDate = $localStorage.selectedDate || moment().format("YYYY-MM-DD");
                    $scope.selectedDate = selectedDate;
                    var startDate = moment(selectedDate, "YYYY-MM-DD").subtract(STRINGS.DATES.DAYS, "days").format("YYYY-MM-DD");

                    var orgId = $localStorage.orgId;

                    //Used for metrics supervisor vs individual emoployee
                    var userId = $localStorage.userId;

                    //Used for supervisor Leaderboard
                    var supervisorUserId = $localStorage.userId;

                    $scope.selectedEmployeeProfile = $localStorage.selectedEmployee;

                    $scope.selectedEmployeeName = $localStorage.selectedEmployee.firstName.charAt(0) + ". " + $localStorage.selectedEmployee.lastName;

                    $scope.selectedEmployee = $localStorage.selectedEmployee.userId;

                    responseCount = 0;


                    $scope.getEmployeesForSupervisor();
                    $scope.getLastActivityTime();

                    var dailyParams = {period: selectedDate, type:STRINGS.TYPE_DAILY};

                    var week = moment(selectedDate).format("YYYY-[W]ww");
                    var weeklyParams = {period: week, type:STRINGS.TYPE_WEEKLY};

                    var month = moment(selectedDate).format("YYYY-MM");
                    var monthlyParams = {period: month, type:STRINGS.TYPE_MONTHLY};

                    $ionicLoading.show();

                    if($scope.selectedEmployee === STRINGS.ALL){

                        SupervisorMetricsService.getScorecardPeriodValues(dailyParams, orgId, supervisorUserId)
                            .then(function (result) {
                                checkAndHideProgressHUD();

                            if (result.status === 200) {

                                $scope.scorecardSegs[STRINGS.TYPE_DAILY] = result.data.activities;
                                $scope.scorecardUnitsSegs[STRINGS.TYPE_DAILY] = result.data.units;
                                $scope.fallCountSegs[STRINGS.TYPE_DAILY] = result.data.activities['near-miss-events'] ? (parseInt(result.data.activities['near-miss-events'].fall.FallForwardsCount || 0, 10) +
                                    parseInt(result.data.activities['near-miss-events'].fall.FallBackwardsCount || 0, 10)) : 0;

                            }
                            // $scope.$broadcast('scroll.refreshComplete');

                        }, function () {
                                checkAndHideProgressHUD();
                        });

                        SupervisorMetricsService.getScorecardPeriodValues(weeklyParams, orgId, supervisorUserId)
                            .then(function (result) {
                                checkAndHideProgressHUD();

                                console.log(result);

                                if (result.status === 200) {

                                    $scope.scorecardSegs[STRINGS.TYPE_WEEKLY] = result.data.activities;
                                    $scope.scorecardUnitsSegs[STRINGS.TYPE_WEEKLY] = result.data.units;
                                    $scope.fallCountSegs[STRINGS.TYPE_WEEKLY] = result.data.activities['near-miss-events'] ? (parseInt(result.data.activities['near-miss-events'].fall.FallForwardsCount || 0, 10) +
                                        parseInt(result.data.activities['near-miss-events'].fall.FallBackwardsCount || 0, 10)) : 0;

                                }
                                // $scope.$broadcast('scroll.refreshComplete');

                            }, function () {
                                checkAndHideProgressHUD();
                            });

                        SupervisorMetricsService.getScorecardPeriodValues(monthlyParams, orgId, supervisorUserId)
                            .then(function (result) {
                                checkAndHideProgressHUD();

                                console.log(result);

                                if (result.status === 200) {

                                    $scope.scorecardSegs[STRINGS.TYPE_MONTHLY] = result.data.activities;
                                    $scope.scorecardUnitsSegs[STRINGS.TYPE_MONTHLY] = result.data.units;
                                    $scope.fallCountSegs[STRINGS.TYPE_MONTHLY] = result.data.activities['near-miss-events'] ? (parseInt(result.data.activities['near-miss-events'].fall.FallForwardsCount || 0, 10) +
                                        parseInt(result.data.activities['near-miss-events'].fall.FallBackwardsCount || 0, 10)) : 0;

                                }
                                // $scope.$broadcast('scroll.refreshComplete');

                            }, function () {
                                checkAndHideProgressHUD();
                            });


                    }
                    else {
                        ScorecardUserService.getScorecardPeriodValues(dailyParams, orgId, $scope.selectedEmployee).then(function (result) {
                            checkAndHideProgressHUD();
                            if (result.status === 200) {

                                $scope.scorecardSegs[STRINGS.TYPE_DAILY] = result.data.activities;
                                $scope.scorecardUnitsSegs[STRINGS.TYPE_DAILY] = result.data.units;
                                $scope.fallCountSegs[STRINGS.TYPE_DAILY] = result.data.activities[STRINGS.ACTIVITIES_MAPPING.NEAR_MISS_WORK_PARENT] ? (parseInt(result.data.activities[STRINGS.ACTIVITIES_MAPPING.NEAR_MISS_WORK_PARENT][STRINGS.ACTIVITIES_MAPPING.FALL_PARENT][STRINGS.ACTIVITIES_MAPPING.FALL_FORWARDS] || 0, 10) +
                                    parseInt(result.data.activities[STRINGS.ACTIVITIES_MAPPING.NEAR_MISS_WORK_PARENT][STRINGS.ACTIVITIES_MAPPING.FALL_PARENT][STRINGS.ACTIVITIES_MAPPING.FALL_BACKWARDS] || 0, 10)) : 0;
                                updateVariables();
                            }
                            // $scope.$broadcast('scroll.refreshComplete');

                        }, function () {checkAndHideProgressHUD();
                        });


                        ScorecardUserService.getScorecardPeriodValues(weeklyParams, orgId, $scope.selectedEmployee).then(function (result) {
                            $ionicLoading.hide();

                            checkAndHideProgressHUD();
                            if (result.status === 200) {

                                $scope.scorecardSegs[STRINGS.TYPE_WEEKLY] = result.data.activities;
                                $scope.scorecardUnitsSegs[STRINGS.TYPE_WEEKLY] = result.data.units;
                                $scope.fallCountSegs[STRINGS.TYPE_WEEKLY] = result.data.activities[STRINGS.ACTIVITIES_MAPPING.NEAR_MISS_WORK_PARENT] ? (parseInt(result.data.activities[STRINGS.ACTIVITIES_MAPPING.NEAR_MISS_WORK_PARENT][STRINGS.ACTIVITIES_MAPPING.FALL_PARENT][STRINGS.ACTIVITIES_MAPPING.FALL_FORWARDS] || 0, 10) +
                                    parseInt(result.data.activities[STRINGS.ACTIVITIES_MAPPING.NEAR_MISS_WORK_PARENT][STRINGS.ACTIVITIES_MAPPING.FALL_PARENT][STRINGS.ACTIVITIES_MAPPING.FALL_BACKWARDS] || 0, 10)) : 0;
                                updateVariables();
                            }
                            // $scope.$broadcast('scroll.refreshComplete');

                        }, function () {
                            checkAndHideProgressHUD();
                        });




                        ScorecardUserService.getScorecardPeriodValues(monthlyParams, orgId, $scope.selectedEmployee).then(function (result) {
                            $ionicLoading.hide();
                            checkAndHideProgressHUD();
                            if (result.status === 200) {

                                $scope.scorecardSegs[STRINGS.TYPE_MONTHLY] = result.data.activities;
                                $scope.scorecardUnitsSegs[STRINGS.TYPE_MONTHLY] = result.data.units;
                                $scope.fallCountSegs[STRINGS.TYPE_MONTHLY] = result.data.activities[STRINGS.ACTIVITIES_MAPPING.NEAR_MISS_WORK_PARENT] ? (parseInt(result.data.activities[STRINGS.ACTIVITIES_MAPPING.NEAR_MISS_WORK_PARENT][STRINGS.ACTIVITIES_MAPPING.FALL_PARENT][STRINGS.ACTIVITIES_MAPPING.FALL_FORWARDS] || 0, 10) +
                                    parseInt(result.data.activities[STRINGS.ACTIVITIES_MAPPING.NEAR_MISS_WORK_PARENT][STRINGS.ACTIVITIES_MAPPING.FALL_PARENT][STRINGS.ACTIVITIES_MAPPING.FALL_BACKWARDS] || 0, 10)) : 0;
                                updateVariables();
                            }
                            // $scope.$broadcast('scroll.refreshComplete');

                        }, function () {
                            checkAndHideProgressHUD();
                        });
                    }


                };

                if($localStorage.selectedEmployee){
                    $scope.doRefresh();
                }


                $scope.loadBreadcrumb = function(){
                    $state.go('supervisor.breadcrumb');
                };

                $scope.loadEmployeeDetails = function(){
                    $state.go('supervisor.work');
                };

                function updateVariables() {
                    console.log(selectedPeriodType);
                    $scope.scorecardValues = $scope.scorecardSegs[selectedPeriodType];
                    $scope.scorecardUnits = $scope.scorecardUnitsSegs[selectedPeriodType];
                    $scope.fallCounts = $scope.fallCountSegs[selectedPeriodType];
                }

                $scope.segmentClicked = function ($index) {
                    selectedPeriodType = STRINGS.TYPESEGMENTS[$index];
                    updateVariables();
                    $scope.$apply();
                };

                $scope.rankingSegmentClicked = function ($index) {
                    $scope.selectedRankType = STRINGS.RANKSEGMENTS[$index];
                    $scope.$apply();
                };

                function checkAndHideProgressHUD() {
                    responseCount++;
                    if (responseCount >= 4) {
                        $ionicLoading.hide();
                        $scope.$broadcast('scroll.refreshComplete');
                        updateVariables();
                    }
                }

                $scope.productivityTimeGraph = function (type) {

                    var chartTimestamps = [];
                    var chartValues = [];
                    var dataArray = [];

                    if (type === 'idle time') {
                        dataArray = Array.from(($scope.workTimeSeries) ? $scope.workTimeSeries["idle-time"].TotalIdleTime : []);
                        dataArray.reverse();
                        $scope.chartMetric = 'Duration (minutes)';
                        $scope.unit = '(minutes)';
                        $scope.chartTitle = "Belt Lying On Table";
                        $scope.prop = "popup2";
                    }
                    else if (type === 'work time') {
                        dataArray = Array.from(($scope.workTimeSeries) ? $scope.workTimeSeries["idle-time"].WorkTime : []);
                        dataArray.reverse();
                        $scope.chartMetric = 'Duration (minutes)';
                        $scope.unit = '(minutes)';
                        $scope.chartTitle = "Work Time";
                        $scope.prop = "popup2";
                    }
                    else if (type === 'drive time') {
                        dataArray = Array.from(($scope.workTimeSeries) ? $scope.workTimeSeries.driving.DrivingTime : []);
                        dataArray.reverse();
                        $scope.chartMetric = 'Duration (minutes)';
                        $scope.unit = '(minutes)';
                        $scope.chartTitle = "Drive Time";
                        $scope.prop = "popup2";
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


                $scope.fetchLeadership = function(item){

                    $ionicLoading.show();

                    $scope.selectedItem = item;
                    LeaderboardService.getProductivityLeaderboardByItem(orgId, supervisorUserId, item, $scope.selectedDate).then(function (result) {

                        $ionicLoading.hide();
                        if (result.status === 200) {
                            console.log(result);

                            var leaderBoard = result.data.leaderboard || [];

                            var leaderboardWorkTimeList = [];

                            for (var i = 0; i < leaderBoard.length; i++) {
                                var employee = $scope.employees[leaderBoard[i].userId];

                                leaderboardWorkTimeList.push({
                                    name: employee.name,
                                    profileMimeType: employee.profileMimeType,
                                    profilePhoto: employee.profilePhoto,
                                    value: leaderBoard[i].value,
                                    rank: i + 1

                                });
                            }

                            $scope.leaderboardWorkTimeList = leaderboardWorkTimeList;
                            $scope.leaderboardAll["Work Time"] = leaderboardWorkTimeList;

                        }
                        // checkAndHideProgressHUD();
                    }, function (error) {
                        // checkAndHideProgressHUD();
                        $ionicLoading.hide();
                        console.log(error);
                    });
                };


            }]);
})();
