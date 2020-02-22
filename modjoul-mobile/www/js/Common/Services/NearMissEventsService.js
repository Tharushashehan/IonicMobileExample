/* global angular */
/* global console */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

(function() {
    'use strict';

    angular.module('modjoul-mobile.services')
        .factory('NearMissEventsService', ['$location', '$log', 'RestClient', '$localStorage', 'apiHost',
            function($location, $log, RestClient, $localStorage, apiHost) {

                var nearMissEventsServicePeriod = function(params,orgId,userId) {

                  var serviceUrl = apiHost + '/organizations/' + orgId +
                    '/users/' + userId + '/near-miss-events?' +
                    'period=' + params.period + '&type=' + params.type;

                    return RestClient.get(serviceUrl)
                        .then(function(response) {
                                console.log(response);
                                return response;
                            },
                            function(err) {
                                throw err;
                            });
                };

              var nearMissEventsSeries = function(params,orgId,userId) {

                var serviceUrl = apiHost + '/organizations/' + orgId +
                  '/users/' + userId + '/near-miss-events/time-series?' +
                  'period=' + params.period;

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
                  getNearMissEventsByPeriod: function(params,orgId,userId) {
                        return nearMissEventsServicePeriod(params,orgId,userId);
                    },
                  getNearMissEvents :function (params,orgId,userId) {
                        return nearMissEventsServicePeriod(params,orgId,userId);
                  },
                  getNearMissEventsTimeSeries : function(params,orgId,userId){
                        return nearMissEventsSeries(params,orgId,userId);
                  }

                };

            }
        ]);
})();
