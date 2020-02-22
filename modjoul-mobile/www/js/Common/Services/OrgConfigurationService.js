/* global angular */
(function() {
    'use strict';
    angular.module('modjoul-mobile.services')
        .factory('OrgConfigService',  ['$log', 'RestClient', '$localStorage', 'apiHost',
                                                function($log, RestClient, $localStorage, apiHost) {


            var getOrgConfiguration = function(orgId) {
              return RestClient.get(apiHost + '/organizations/' + orgId + '/configuration')
                  .then(function(response){
                      return response;
                  }, function(err){
                      throw err;
                  });
            };

            var setOrgConfiguration = function(params, orgId) {
              return RestClient.put(apiHost + '/organizations/' + orgId + '/configuration',
                  params)
                  .then(function(response){
                      return response;
                  }, function(err){
                      throw err;
                  });
            };

            return {
              getOrgConfiguration : function(orgId){
                return getOrgConfiguration(orgId);
              },
              saveOrgConfiguration : function(params, orgId){
                return setOrgConfiguration(params, orgId);
              }
            };
        }]);
})();
