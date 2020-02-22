/* global angular */
(function() {
    'use strict';
    angular.module('modjoul-mobile.services')
        .factory('LocationService',  ['$location', '$log', 'RestClient', '$localStorage', 'apiHost',
                                                function($location, $log, RestClient, $localStorage, apiHost) {


            var getLocationsWithMetrics = function() {
                var orgId = $localStorage.orgId;
                return RestClient.get(apiHost + '/organizations/' + orgId + '/locations?metrics=true')
                    .then(function(response) {
                        return response;
                    }, function(err) {
                        throw err;
                    });
            };


            var getLocationsWithoutMetrics = function() {
                var orgId = $localStorage.orgId;
                return RestClient.get(apiHost + '/organizations/' + orgId + '/locations')
                    .then(function(response) {
                        return response;
                    }, function(err) {
                        throw err;
                    });
            };

            return {
                getLocations : function() {
                    return getLocationsWithMetrics();
                },
                getLocations2 : function() {
                    return getLocationsWithoutMetrics();
                }
            };
        }]);
})();
