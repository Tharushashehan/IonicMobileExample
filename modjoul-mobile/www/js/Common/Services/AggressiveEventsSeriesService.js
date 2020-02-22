/* global angular */
/* global console */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
(function() {
    'use strict';

    angular.module('modjoul-mobile.services')
        .factory('AggressiveEventsSeriesService', ['$location', '$log', 'RestClient', '$localStorage', 'apiHost2',
            function($location, $log, RestClient, $localStorage, apiHost2) {

                var aggressiveEventsSeriesService = function(params,orgId, userId) {

                  var serviceUrl = apiHost2 + '/organizations/' + orgId +
                    '/users/' + userId + '/near-miss-events/time-series?start=' + params.period;

                    return RestClient.get(serviceUrl)
                        .then(function(response) {
                                console.log(response);
                                return response;
                            },
                            function(err) {
                                throw err;
                            });
                };

                return {
                  AggressiveEventsSeriesService: function(params, orgId, userId) {
                        return aggressiveEventsSeriesService(params, orgId, userId);
                    }
                };

            }
        ]);
})();
