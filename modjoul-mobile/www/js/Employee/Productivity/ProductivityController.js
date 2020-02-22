/* global angular */
(function() {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('ProductivityCtrl', ['$scope', '$state', function($scope, $state) {

            $scope.navIdleTime = function() {
                $state.go("employee.productivity-idletime");

            };

            $scope.navWorkTime = function() {
                $state.go("employee.productivity-worktime");

            };

            $scope.navDriveTime = function() {
                $state.go("employee.productivity-drivetime");

            };

            $scope.navWorkEnergy = function() {
              $state.go("employee.productivity-workenergy");

            };

            $scope.navExitVehicle = function() {
              $state.go("employee.productivity-exitvehicle");

            };

            $scope.navStairs = function(){
              $state.go("employee.productivity-stairs");
            };
        }]);
})();
