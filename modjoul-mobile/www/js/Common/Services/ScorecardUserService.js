/* global angular */
(function () {
    'use strict';
    angular.module('modjoul-mobile.services')
        .factory('ScorecardUserService', ['$log', 'RestClient', '$localStorage', 'apiHost2',
            function ($log, RestClient, $localStorage, apiHost2) {

                var getScorecardPeriodValues = function(params, orgId, userId) {

                    return RestClient.get(apiHost2 + '/organizations/' + orgId + '/users/' + userId + '/scorecard?' +
                        'period=' + params.period + "&type=" + params.type)
                        .then(function(response){
                            return response;
                        }, function(err){
                            throw err;
                        });
                };


                return {
                    getScorecardPeriodValues : function(params, orgId, userId) {
                        return getScorecardPeriodValues(params, orgId, userId);
                    }
                };
            }]);
})();
