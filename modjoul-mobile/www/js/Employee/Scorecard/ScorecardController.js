/* global angular */
/* global console */
/* global moment */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

(function () {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('ScorecardCtrl', ['$scope', '$rootScope', '$state', '$localStorage', '$ionicLoading', 'STRINGS', '$ionicPopup',
            'ScorecardConfigService', '$cordovaDialogs', '$ionicModal','ScorecardUserService',
            function ($scope, $rootScope, $state, $localStorage, $ionicLoading, STRINGS, $ionicPopup,
                      ScorecardConfigService, $cordovaDialogs, $ionicModal, ScorecardUserService) {

                $scope.strings = STRINGS;

                $scope.$on("$ionicView.beforeEnter", function () {
                    $scope.$emit('navbarHideEvent', false);
                });

                var orgId = $localStorage.orgId;
                var userId = $localStorage.userId;

                $scope.testVar = true;
                $scope.triggerValue = 1;

                $scope.$on('dateSelected', function () {
                    $scope.doRefresh();
                });


                $scope.doRefresh = function () {

                    $scope.triggerValue += 1;

                    var selectedDate = $localStorage.selectedDate || moment().format("YYYY-MM-DD");
                    var selectedDates = {period: selectedDate, type: "daily"};


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

                    ScorecardConfigService.getScorecardConfigs(userId)
                        .then(function (result) {
                            if (result.status === 200) {
                                console.log(result);

                                var configurationItems = [];
                                var configurationKeyItems = [];
                                var selected = {};
                                var configOptions = result.data;
                                $scope.configData = result.data;

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


                $scope.closeConfiguration = function(){
                    $scope.modal.hide();

                    console.log($scope.selected);
                    console.log($scope.selected);

                    ScorecardConfigService.saveScorecardConfigs($scope.selected, userId)
                        .then(function (result) {

                            $rootScope.userConfigData = $scope.selected;

                            console.log(result);

                        }, function (error) {

                            console.log(error);
                        });
                };

                $scope.doRefresh();



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
