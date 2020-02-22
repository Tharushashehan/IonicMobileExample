/* global angular */
/* global console */
/* global moment */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

(function () {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('SafetyTemperatureCtrl',
            function ($scope, $localStorage, $ionicLoading, TemperatureService) {

                $scope.$on('dateSelected', function () {
                    $scope.doRefresh();
                });

                $scope.doRefresh = function () {
                    var selectedDate = $localStorage.selectedDate || moment().format("YYYY-MM-DD");
                    var seriesParams = {period: selectedDate};
                    var orgId = $localStorage.orgId;
                    var userId = $localStorage.userId;

                    $ionicLoading.show();

                    TemperatureService.getTemperatureSeries(seriesParams, orgId, userId).then(function (result) {

                        if (result.status === 200) {
                            $scope.temperatureSeries = result.data.metrics;
                            $scope.temperatureUnit = result.data.units.temperature;
                        }

                        $scope.$broadcast('scroll.refreshComplete');
                        $ionicLoading.hide();
                    }, function () {
                        $scope.$broadcast('scroll.refreshComplete');
                        $ionicLoading.hide();
                    });

                };

                $scope.doRefresh();

            });
})();
