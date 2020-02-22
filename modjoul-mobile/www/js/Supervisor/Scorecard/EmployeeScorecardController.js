/* global angular */
/* global moment */

(function () {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('EmployeeScorecardController', ['$scope', '$localStorage',
            '$ionicSlideBoxDelegate', '$ionicLoading',  'STRINGS', 'ScorecardConfigService', '$ionicPopup',
            '$ionicModal', '$log', 'ScorecardUserService',
            function ($scope, $localStorage,  $ionicSlideBoxDelegate,
                      $ionicLoading,  STRINGS, ScorecardConfigService, $ionicPopup, $ionicModal,$log, ScorecardUserService) {

                $scope.strings = STRINGS;
                $scope.$on("$ionicView.beforeEnter", function (event, data) {
                    $scope.$emit('navbarHideEvent', false);
                });

                $scope.$on('empSelected', function (event, args) {
                    $scope.doRefresh();
                });

                $scope.$on('dateSelected', function (event, args) {
                    $scope.doRefresh();
                });


                $scope.doRefresh = function () {
                    var selectedDate = $localStorage.selectedDate || moment().subtract(1, "days").format("YYYY-MM-DD");
                    var selectedDates = {period: selectedDate};

                    var orgId = $localStorage.orgId;
                    var userId = $localStorage.selectedEmployee.userId;
                    $scope.userId = $localStorage.selectedEmployee.userId;

                    var responseCount = 0;

                    ScorecardConfigService.getScorecardConfigs(userId)
                        .then(function (result) {
                            if (result.status === 200) {
                                // $ionicLoading.hide();
                                $log.debug(result);

                                var configurationItems = [];
                                var configurationKeyItems = [];
                                var selected = {};
                                var configOptions = result.data;
                                $scope.configData = result.data;

                                var count = 0;

                                Object.keys(configOptions).forEach(function (parentKey) {
                                    var parentValue = configOptions[parentKey];
                                    configurationItems[count] = [];
                                    // selected[count] = [];
                                    selected[parentKey] = {};

                                    Object.keys(parentValue).forEach(function (key) {
                                        var value = parentValue[key];
                                        configurationItems[count].push(key);

                                        if (value) {
                                            selected[parentKey][key] = value;
                                        }

                                    });

                                    configurationKeyItems.push({title: parentKey, count: count});
                                    count++;
                                });

                                $scope.selected = selected;
                                $scope.configOptions = configurationItems;
                                $scope.configCategories = configurationKeyItems;

                                $log.debug($scope.selected);

                                $ionicLoading.show();

                                ScorecardUserService.getScorecardPeriodValues(selectedDates, orgId, userId).then(function (result) {
                                    $ionicLoading.hide();

                                    if (result.status === 200) {

                                        $scope.scorecardMetrics = result.data.activities;
                                        $scope.scorecardMetricsUnits = result.data.units;
                                        $scope.FallCount = result.data.activities['near-miss-events'] ? (parseInt(result.data.activities['near-miss-events'].fall.FallForwardsCount || 0, 10) +
                                        parseInt(result.data.activities['near-miss-events'].fall.FallBackwardsCount || 0, 10)) : 0;
                                    }
                                    $scope.$broadcast('scroll.refreshComplete');

                                }, function () {
                                    $ionicLoading.hide();
                                });

                            }
                        }, function (error) {
                            // $ionicLoading.hide();
                            $log.debug(error);
                        });
                };

                $scope.doRefresh();

                $scope.closeConfiguration = function(){
                    $scope.modal.hide();

                    ScorecardConfigService.saveScorecardConfigs($scope.selected, $scope.userId)
                        .then(function (result) {

                            $log.debug(result);

                        }, function (error) {

                            $log.debug(error);
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
