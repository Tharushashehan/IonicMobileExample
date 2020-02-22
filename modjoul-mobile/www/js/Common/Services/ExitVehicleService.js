/* global angular */
/* global console */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

(function() {
    'use strict';

    angular.module('modjoul-mobile.services')
        .factory('ExitVehicleService', ['$location', '$log', 'RestClient', '$localStorage','apiHost',
            function($location, $log, RestClient, $localStorage, apiHost) {

                var exitVehicleSeries = function(params, orgId, userId) {

                  var serviceUrl = apiHost + '/organizations/' + orgId +
                    '/users/' + userId + '/time-to-exit-vehicle/time-series?period=' + params.period;
                    return RestClient.get(serviceUrl)
                        .then(function(response) {
                                console.log(response);
                                return response;
                            },
                            function(err) {
                                throw err;
                            });
                };

                var exitVehicleSummary = function(params, orgId, userId) {

                  var serviceUrl = apiHost + '/organizations/' + orgId +
                    '/users/' + userId + '/time-to-exit-vehicle?period=' + params.period ;

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
                  getTimeToExitVehicleSeries: function(params, orgId, userId) {
                        return exitVehicleSeries(params, orgId, userId);
                    },

                  getTimeToExitVehicleSummary: function(params, orgId, userId) {
                    return exitVehicleSummary(params, orgId, userId);
                  }
                };

              }
        ]);
})();
