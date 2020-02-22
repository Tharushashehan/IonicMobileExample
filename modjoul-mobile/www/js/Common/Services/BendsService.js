/* global angular */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
(function() {
    'use strict';

    angular.module('modjoul-mobile.services')
        .factory('BendsService', ['$location', '$log', 'RestClient', '$localStorage','apiHost2',
            function($location, $log, RestClient, $localStorage, apiHost2) {

                var bendsSeries = function(params, orgId, userId) {

                  var serviceUrl = apiHost2 + '/organizations/' + orgId +
                    '/users/' + userId + '/bend/time-series?period=' + params.period;

                    return RestClient.get(serviceUrl)
                        .then(function(response) {
                                $log.debug(response);
                                return response;
                            },
                            function(err) {
                                throw err;
                            });
                };

                var bendsSummary = function(params, orgId, userId) {

                  var serviceUrl = apiHost2 + '/organizations/' + orgId +
                    '/users/' + userId + '/bend?period=' + params.period + '&type=' + params.type;

                  return RestClient.get(serviceUrl)
                    .then(function(response) {
                        $log.debug(response);
                        return response;
                      },
                      function(err) {
                        throw err;
                      });
                };

                return {
                  getBendsSeries: function(params, orgId, userId) {
                        return bendsSeries(params, orgId, userId);
                    },

                  getBendsSummary: function(params, orgId, userId) {
                    return bendsSummary(params, orgId, userId);
                  }
                };

              }
        ]);
})();
