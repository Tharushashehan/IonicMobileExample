/* global angular */
(function() {
    'use strict';
    angular.module('modjoul-mobile.services')
        .factory('FeedService', function($location, $log, apiHost, RestClient) {

            var getFeed = function(params, orgId, userId) {
                return RestClient.get(apiHost + '/organizations/' + orgId + '/supervisors/' + userId + '/feed?' +
                    'period=' + params.period)
                    .then(function(response){
                        return response;
                    }, function(err){
                        throw err;
                    });
            };





            return {
                getFeed : function(params, orgId, userId){
                    return getFeed(params, orgId, userId);
                }
            };
        });
})();
