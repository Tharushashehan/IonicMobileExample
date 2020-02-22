/* global angular */
/* global console */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

(function() {
    'use strict';

    angular.module('modjoul-mobile.services')
        .factory('TemperatureService', ['$location', '$log', 'RestClient', '$localStorage','apiHost',
            function($location, $log, RestClient, $localStorage, apiHost) {

                var temperatureSeries = function(params, orgId, userId) {

                  var serviceUrl = apiHost + '/organizations/' + orgId +
                    '/users/' + userId + '/environment/temperature/time-series?period=' + params.period;

                    return RestClient.get(serviceUrl)
                        .then(function(response) {
                                console.log(response);
                                return response;
                            },
                            function(err) {
                                throw err;
                            });
                };

              var temperatureSummary = function(params, orgId, userId) {

                var serviceUrl = apiHost + '/organizations/' + orgId +
                  '/users/' + userId + '/environment/temperature?period=' + params.period;

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
                  getTemperatureSeries: function(params, orgId, userId) {
                        return temperatureSeries(params, orgId, userId);
                    },
                  getTemperatureSummary: function(params, orgId, userId) {
                    return temperatureSummary(params, orgId, userId);
                  }
                };

              }
        ]);
})();
