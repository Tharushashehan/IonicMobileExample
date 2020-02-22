/* global angular */
(function() {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('SettingsCtrl', ['$scope', function($scope) {

            $scope.$on("$ionicView.beforeEnter", function() {
                // handle event

                $scope.$emit('navbarHideEvent', true);
            });


        }]);
})();
