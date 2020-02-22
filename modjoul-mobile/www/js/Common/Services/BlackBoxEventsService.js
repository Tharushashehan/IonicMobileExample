/* global angular */
/* global console */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
(function() {
    'use strict';

    angular.module('modjoul-mobile.services')
        .factory('BlackBoxEventsService', ['$location', '$log', 'RestClient', '$localStorage', 'apiHost',
            function($location, $log, RestClient, $localStorage, apiHost) {

                var blackBoxEventsServicePeriod = function(params,orgId, userId) {

                  var serviceUrl = apiHost + '/organizations/' + orgId +
                    '/user/' + userId + '/activities/black-box-events/time-series?start=' + params.start +
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
                  BlackBoxEventsServicePeriod: function(params) {
                        return blackBoxEventsServicePeriod(params);
                    }
                };

            }
        ]);
})();
