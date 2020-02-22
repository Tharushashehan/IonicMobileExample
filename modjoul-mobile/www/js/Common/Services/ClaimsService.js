/* global angular */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
(function() {
    'use strict';
    angular.module('modjoul-mobile.services')
        .factory('ClaimsService', function($location, $log, apiHost, RestClient) {

            var getClaimsService = function(params, orgId) {
              var serviceUrl = apiHost + '/organizations/' + orgId +'/claims';

                return RestClient.get(serviceUrl)
                    .then(function(response){
                        return response;
                    }, function(err){
                        throw err;
                    });
            };

            var createClaim = function(params, orgId, userId) {

              var serviceUrl = apiHost + '/organizations/' + orgId + '/users/' + userId + '/claims';
              var data = {
                userId : params.supervisorId,
                supervisorName : params.supervisorName,
                userName : params.userName,
                lat: params.lat,
                long: params.long,
                locationId: params.locationId,
                incident: params.incident,
                reason: params.reason,
                description: params.description
              };

              return RestClient.post(serviceUrl, data)
                .then(function(response){
                  return response;
                }, function(err){
                  throw err;
                });
            };

            return {
                getClaims : function(params, orgId){
                    return getClaimsService(params, orgId);
                },
                createClaim : function(params, orgId, userId){
                    return createClaim(params, orgId, userId);
                }
            };
        });
})();
