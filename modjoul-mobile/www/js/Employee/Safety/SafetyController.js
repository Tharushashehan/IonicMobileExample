/* global angular */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
(function() {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('SafetyCtrl', ['$scope', '$state', 'STRINGS', function($scope, $state, STRINGS) {

            $scope.strings = STRINGS;

            $scope.navSafetyWork = function() {
                $state.go("employee.safety-work");
            };

            $scope.navSafetyDriving = function() {
                $state.go("employee.safety-driving");
            };

            $scope.navWorkingOnHeights = function(){
                $state.go("employee.safety-workingHeights");
            };

            $scope.navSafetyBends = function(){
              $state.go("employee.safety-bends");
            };

            $scope.navSafetyTwist = function(){
              $state.go("employee.safety-twisting");
            };

            $scope.navIndoorDriving = function(){
                $state.go("employee.safety-indoor-driving");
            };

            $scope.navSafetyTemperature = function(){
              $state.go("employee.safety-temperature");
            };

        }]);
})();
