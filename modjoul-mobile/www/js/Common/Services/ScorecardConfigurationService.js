/* global angular */
(function() {
    'use strict';
    angular.module('modjoul-mobile.services')
        .factory('ScorecardConfigService',  ['$log', 'RestClient', '$localStorage', 'apiHost',
                                                function($log, RestClient, $localStorage, apiHost) {


            var getScorecardConfigs = function(userId) {
                var orgId = $localStorage.orgId;
                return RestClient.get(apiHost + '/organizations/' + orgId + '/users/' + userId + '/configuration/')
                    .then(function(response) {
                        return response;
                    }, function(err) {
                        throw err;
                    });
            };


            var saveScorecardConfigs = function(params,userId) {

                var orgId = $localStorage.orgId;
                return RestClient.put(apiHost + '/organizations/' + orgId + '/users/' + userId + '/configuration/', params)
                    .then(function(response) {
                        return response;
                    }, function(err) {
                        throw err;
                    });
            };

            return {
                getScorecardConfigs : function(userId) {
                    return getScorecardConfigs(userId);
                },
                saveScorecardConfigs : function(params,userId) {
                    return saveScorecardConfigs(params,userId);
                }
            };
        }]);
})();
