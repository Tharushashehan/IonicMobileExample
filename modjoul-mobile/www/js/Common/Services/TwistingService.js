/* global angular */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
(function() {
    'use strict';

    angular.module('modjoul-mobile.services')
        .factory('TwistingService', ['$location', '$log', 'RestClient', '$localStorage','apiHost2',
            function($location, $log, RestClient, $localStorage, apiHost2) {

                var twistingSeries = function(params, orgId, userId) {

                  var serviceUrl = apiHost2 + '/organizations/' + orgId +
                    '/users/' + userId + '/twisting/time-series?period=' + params.period;

                    return RestClient.get(serviceUrl)
                        .then(function(response) {
                                $log.debug(response);
                                return response;
                            },
                            function(err) {
                                throw err;
                            });
                };

                var twistingSummary = function(params, orgId, userId) {

                  var serviceUrl = apiHost2 + '/organizations/' + orgId +
                    '/users/' + userId + '/twisting?period=' + params.period + '&type=' + params.type;

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
                  getTwistingSeries: function(params, orgId, userId) {
                        return twistingSeries(params, orgId, userId);
                    },

                  getTwistingSummary: function(params, orgId, userId) {
                    return twistingSummary(params, orgId, userId);
                  }
                };

              }
        ]);
})();
