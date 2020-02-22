/* global angular */
(function() {
    'use strict';
    angular.module('modjoul-mobile.services')
        .factory('SupervisorOutOfBoundsService', ['$location', '$log', 'RestClient', '$localStorage', 'apiHost',
               function($location, $log, RestClient, $localStorage, apiHost) {

            var getOutOfBounds = function(params, orgId, userId) {
                return RestClient.get(apiHost + '/organizations/' + orgId + '/users/' + userId + '/heat-map?' +
                        'period=' + params.period)
                    .then(function(response){
                        return response;
                    }, function(err){
                        throw err;
                    });
            };

            return {
                getOutOfBounds : function(params, orgId, userId){
                    return getOutOfBounds(params, orgId, userId);
                }
            };
        }]);
})();
