/* global angular */
/* global console */
/* global moment */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
/* jshint sub:true */
/* jshint shadow:true */

(function () {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('SafetyTwistingCtrl', ['$scope', '$localStorage', 'TwistingService', '$ionicLoading',
            '$ionicPopup', '$timeout', 'STRINGS',
            function ($scope, $localStorage, TwistingService, $ionicLoading, $ionicPopup, $timeout, STRINGS) {

                $scope.strings = STRINGS;
                $scope.triggerValue = 1;

                $scope.$on('dateSelected', function () {
                    $scope.doRefresh();
                });

                var selectedType = STRINGS.TYPESEGMENTS[0];

                $scope.segmentClicked = function ($index) {
                    selectedType = STRINGS.TYPESEGMENTS[$index];
                    $scope.twisting = $scope.twistingSegs[selectedType];
                    $scope.twistingUnits = $scope.twistingUnitsSegs[selectedType];

                    $scope.$apply();
                };

                $scope.doRefresh = function () {

                    $scope.triggerValue += 1;

                    var selectedDate = $localStorage.selectedDate || moment().format("YYYY-MM-DD");
                    var summaryParams = {period: selectedDate};
                    var orgId = $localStorage.orgId;
                    var userId = $localStorage.userId;
                    var responseCount = 0;

                    $scope.twistingSegs = {};
                    $scope.twistingUnitsSegs = {};

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
                        console.log(type);
                        TwistingService.getTwistingSummary(summaryParams, orgId, userId).then(function (result) {
                            console.log(result);
                            checkAndHideProgressHUD();
                            if (result.status === 200) {

                                $scope.twistingSegs[type] = result.data.activities; //.summary && result.data.activities.twisting_degrees;
                                $scope.twisting = $scope.twistingSegs[selectedType];

                                $scope.twistingUnitsSegs[type] = result.data.units;
                                $scope.twistingUnits = $scope.twistingUnitsSegs[selectedType];

                            }

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

                };

                $scope.doRefresh();

            }]);
})();
