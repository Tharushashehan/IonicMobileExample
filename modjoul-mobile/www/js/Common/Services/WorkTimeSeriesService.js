/* global angular */
/* global console */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

(function() {
    'use strict';

    angular.module('modjoul-mobile.services')
        .factory('WorkTimeSeriesService', ['$location', '$log', 'RestClient', '$localStorage','apiHost',
          'WorkTimeSummaryService',
            function($location, $log, RestClient, $localStorage, apiHost, WorkTimeSummaryService) {

                var workTimeServiceSeries = function(params, orgId, userId) {

                  var serviceUrl = apiHost + '/organizations/' + orgId +
                    '/users/' + userId + '/work-time/time-series?' + 'period=' + params.period;


                    return RestClient.get(serviceUrl)
                        .then(function(response) {
                                console.log(response);
                                return response;
                            },
                            function(err) {
                                throw err;
                            });
                };

                var driveTimeServiceSeries = function(params, orgId, userId) {

                  var serviceUrl = apiHost + '/organizations/' + orgId +
                    '/users/' + userId + '/drive-time/time-series?' + 'period=' + params.period;


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
                    WorkTimeSeriesByPeriod: function(params, orgId, userId) {
                        return workTimeServiceSeries(params, orgId, userId);
                    },
                    DriveTimeSeriesByPeriod: function(params, orgId, userId) {
                      return driveTimeServiceSeries(params, orgId, userId);
                    },
                    /* For wrapping to make compatible with supervisor controllers */

                    getWorkTimeTimeSeries : function(params, orgId, userId){
                      return workTimeServiceSeries(params, orgId, userId);
                    },
                    getWorkTime : function(params, orgId, userId){
                        return WorkTimeSummaryService.WorkTimeSummaryByPeriod(params, orgId, userId);
                    },
                    getDriveTimeTimeSeries : function(params, orgId, userId){
                      //return workDriveServicePeriod(params, orgId, userId);
                      return driveTimeServiceSeries(params, orgId, userId);
                    },
                    getDriveTime : function(params, orgId, userId){
                      return WorkTimeSummaryService.DriveTimeSummaryByPeriod(params, orgId, userId);
                    },
                    getEffectivePay: function(params, orgId, userId) {
                      return WorkTimeSummaryService.EffectivePay(params, orgId, userId);
                    }

                };

            }
        ]);
})();
