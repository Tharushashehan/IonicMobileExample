/* global angular */
/* global console */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
(function () {
    'use strict';

    angular.module('modjoul-mobile.services')
        .factory('WorkingHeightsService', ['$location', '$log', 'RestClient', '$localStorage', 'apiHost',
            function ($location, $log, RestClient, $localStorage, apiHost) {

                var workingHeightsSeries = function (params, orgId, userId) {

                    var serviceUrl = apiHost + '/organizations/' + orgId +
                        '/users/' + userId + '/working-from-heights/time-series?period=' + params.period;

                    return RestClient.get(serviceUrl)
                        .then(function (response) {
                                console.log(response);
                                return response;
                            },
                            function (err) {
                                throw err;
                            });
                };

                var workingHeightsSummary = function(params, orgId, userId) {

                    var serviceUrl = apiHost + '/organizations/' + orgId  +
                        '/users/' + userId + '/working-from-heights?period=' + params.period + '&type=' + params.type;

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
                    getWorkingHeightsSeries: function (params, orgId, userId) {
                        return workingHeightsSeries(params, orgId, userId);
                    },

                    getWorkingHeightsSummary: function (params, orgId, userId) {
                        return workingHeightsSummary(params, orgId, userId);
                    }
                };

            }
        ]);
})();
