/* global angular */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
(function() {
    'use strict';

    angular.module('modjoul-mobile.services')
        .factory('AggressiveEventsService', ['$location', '$log', 'RestClient', '$localStorage', 'apiHost2',
          function($location, $log, RestClient, $localStorage, apiHost2) {

            var getWorkAggressiveEventsByPeriod = function(params, orgId, userId) {
                return RestClient.get(apiHost2 + '/organizations/' + orgId + '/users/' + userId + '/near-miss-events?' +
                    'period=' + params.period + '&type=' + params.type)
                    .then(function(response){
                        return response;
                    }, function(err){
                        throw err;
                    });
            };


            var getDriveAggressiveEventsByPeriod = function(params, orgId, userId) {
                            return RestClient.get(apiHost2 + '/organizations/' + orgId + '/users/' + userId + '/driving?' +
                                'period=' + params.period + '&type=' + params.type)
                                .then(function(response){
                                    return response;
                                }, function(err){
                                    throw err;
                                });
                        };

            var getWorkAggressiveEventsSeries = function(params, orgId, userId) {

                return RestClient.get(apiHost2 + '/organizations/' + orgId + '/users/' + userId + '/near-miss-events/time-series?' +
                    'period=' + params.period)
                    .then(function(response){
                        return response;
                    }, function(err){
                        throw err;
                    });
            };


            var getDriveAggressiveEventsSeries = function(params, orgId, userId) {

                return RestClient.get(apiHost2 + '/organizations/' + orgId + '/users/' + userId + '/driving/time-series?' +
                    'period=' + params.period)
                    .then(function(response){
                        return response;
                    }, function(err){
                        throw err;
                    });
            };

            return {
                getWorkAggressiveEventsByPeriod : function(params, orgId, userId){
                    return getWorkAggressiveEventsByPeriod(params, orgId, userId);
                },
                getDriveAggressiveEventsByPeriod : function(params, orgId, userId){
                    return getDriveAggressiveEventsByPeriod(params, orgId, userId);
                 },
                getWorkAggressiveEventsSeries : function(params, orgId, userId) {
                    return getWorkAggressiveEventsSeries(params, orgId, userId);
                },
                getDriveAggressiveEventsSeries : function(params, orgId, userId) {
                    return getDriveAggressiveEventsSeries(params, orgId, userId);
                 },
                getAggressiveEventsWorkMetrics : function(params, orgId, userId){
                  return getWorkAggressiveEventsByPeriod(params, orgId, userId);
                },
                getAggressiveEventsDriveMetrics : function(params, orgId, userId){
                  return getDriveAggressiveEventsByPeriod(params, orgId, userId);
                },
                getAggressiveEventsWorkTimeSeries : function(params, orgId, userId){
                  return getWorkAggressiveEventsSeries(params, orgId, userId);
                },
                getAggressiveEventsDriveTimeSeries : function(params, orgId, userId){
                  return getDriveAggressiveEventsSeries(params, orgId, userId);
                }

              };
        }]);

})();
