/* global angular */
(function() {
    'use strict';
    angular.module('modjoul-mobile.services')
        .factory('AmbulatoryMotionService', function($location, $log, apiHost, RestClient) {
            var getAbulatoryMotionByPeriod = function(params, orgId, userId) {
                return RestClient.get(apiHost + '/organizations/' + orgId + '/users/' + userId + '/activities/ambulatory-motion?' +
                    'period=' + params.period)
                    .then(function(response){
                        return response;
                    }, function(err){
                        throw err;
                    });
            };

            var getAbulatoryMotionSeries = function(params, orgId, userId) {
                return RestClient.get(apiHost + '/organizations/' + orgId + '/users/' + userId + '/activities/ambulatory-motion/time-series?' +
                     'period=' + params.period )
                    .then(function(response){
                        return response;
                    }, function(err){
                        throw err;
                    });
            };

            return {
                getAbulatoryMotionByPeriod : function(params, orgId, userId){
                    return getAbulatoryMotionByPeriod(params, orgId, userId);
                },
                getAbulatoryMotionSeries : function(params, orgId, userId){
                    return getAbulatoryMotionSeries(params, orgId, userId);
                }
            };
        });
})();
