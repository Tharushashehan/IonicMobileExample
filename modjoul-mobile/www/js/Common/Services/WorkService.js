/* global angular */
(function() {
    'use strict';

    angular.module('modjoul-mobile.services')
        .factory('IdleTimeSummaryService', ['$location', '$log', 'RestClient', '$localStorage', 'apiHost',
            function($location, $log, RestClient, $localStorage, apiHost) {

                var idleTimeServicePeriod = function(params, orgId, userId) {

                    var serviceUrl = apiHost + '/organizations/' + orgId +
                        '/user/' + userId + '/activities/idle-time?period=d' + params.period;

                    return RestClient.get(serviceUrl)
                        .then(function(response) {
                                $log.info(response);
                                return response;
                            },
                            function(err) {
                                throw err;
                            });
                };

                return {
                    IdleTimeSummaryByPeriod: function(params, orgId, userId) {
                        return idleTimeServicePeriod(params, orgId, userId);
                    }
                };
            }
        ]);

})();
