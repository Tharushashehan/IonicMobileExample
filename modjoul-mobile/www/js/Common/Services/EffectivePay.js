/* global angular */
/* global console */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
/* jshint shadow:true */

(function() {
    'use strict';

    angular.module('modjoul-mobile.services')
        .factory('EffectivePayService', ['$location', '$log', 'RestClient', '$localStorage', 'apiHost',
            function($location, $log, RestClient, $localStorage, apiHost) {

                var effectivePayServicePeriod = function(params, orgId, userId) {

                  var serviceUrl = apiHost + '/organizations/' + orgId +
                    '/user/' + userId + '/activities/effective-pay/time-series?start=' + params.start +
                    '&end=' + params.end;

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
                  EffectivePayServicePeriod: function(params, orgId, userId) {
                        return effectivePayServicePeriod(params, orgId, userId);
                    }
                };

            }
        ]);
})();
