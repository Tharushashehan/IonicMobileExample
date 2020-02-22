/* global angular */
/* global console */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

(function () {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('LocationSelectionController', ['$scope', '$state', '$localStorage', '$rootScope', 'LocationService',
            function ($scope, $state, $localStorage, $rootScope, LocationService) {


                var orgId = $localStorage.orgId;

                LocationService.getLocations2(orgId)
                    .then(function (result) {
                        console.log(result);
                        $scope.locations = result.data;


                        $scope.selectedLocation = $localStorage.selectedLocation || $scope.locations[0];
                        $localStorage.selectedLocation = $scope.selectedLocation;

                    }, function (error) {
                        console.log(error);
                        $scope.locations = [];
                    });


                $scope.selectLocation = function (location) {
                    $localStorage.selectedLocation = location;
                    $scope.selectedLocation = location;
                    console.log('Location tapped');
                    $rootScope.$broadcast('locationSelected', true);
                };


                //var searchText = element(by.model('searchText'));

                $scope.employeeSearch = function (item) {
                    if (!$scope.searchText || (item.locationName.toLowerCase().indexOf($scope.searchText) !== -1) ||
                        (item.address.city.toLowerCase().indexOf($scope.searchText.toLowerCase()) !== -1)) {
                        return true;
                    }
                    return false;
                };


            }]);
})();
