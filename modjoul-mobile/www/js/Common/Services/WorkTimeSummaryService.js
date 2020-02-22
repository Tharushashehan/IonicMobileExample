/* global angular */
/* global console */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
(function() {
    'use strict';

    angular.module('modjoul-mobile.services')
        .factory('WorkTimeSummaryService', ['$location', '$log', 'RestClient', '$localStorage', 'apiHost2',
            function($location, $log, RestClient, $localStorage, apiHost2) {

                var workTimeServicePeriod = function(params, orgId, userId) {

                    var serviceUrl = apiHost2 + '/organizations/' + orgId +
                        '/users/' + userId + '/work-time?' + 'period=' + params.period + '&type=' + params.type;


                    return RestClient.get(serviceUrl)
                        .then(function(response) {
                                console.log(response);
                                return response;
                            },
                            function(err) {
                                throw err;
                            });
                };

              var driveTimeServicePeriod = function(params, orgId, userId) {

                var serviceUrl = apiHost2 + '/organizations/' + orgId +
                  '/users/' + userId + '/drive-time?' + 'period=' + params.period + '&type=' + params.type;


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
                    WorkTimeSummaryByPeriod: function(params, orgId, userId) {
                        return workTimeServicePeriod(params, orgId, userId);
                    },
                    DriveTimeSummaryByPeriod: function(params, orgId, userId) {
                      return driveTimeServicePeriod(params, orgId, userId);
                    }

                };

            }
        ]);
})();
