/* global angular */
/* global console */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
(function() {
    'use strict';

    angular.module('modjoul-mobile.services')
        .factory('IdleTimeSeriesService', ['$location', '$log', 'RestClient', '$localStorage', 'apiHost', 'IdleTimeSummaryService',
            function($location, $log, RestClient, $localStorage, apiHost, IdleTimeSummaryService) {

                var idleTimeSeriesByPeriod = function(params, orgId, userId) {
                    var serviceUrl = apiHost + '/organizations/' + orgId +
                        '/users/' + userId + '/idle-time/time-series?' + 'period=' + params.period;


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
                    IdleTimeSeriesByPeriod: function(params, orgId, userId) {
                        return idleTimeSeriesByPeriod(params, orgId, userId);
                    },

                    /* For wrapping to make compatible with supervisor controllers */

                    getIdleTimeTimeSeries : function(params, orgId, userId){
                      return idleTimeSeriesByPeriod(params, orgId, userId);
                    },
                    getIdleTime : function (params, orgId, userId) {
                      return IdleTimeSummaryService.IdleTimeSummaryByPeriod(params, orgId, userId);
                    }
                };

            }
        ]);
})();
