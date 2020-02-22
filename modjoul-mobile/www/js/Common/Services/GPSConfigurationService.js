(function() {
    'use strict';
    /* global angular
    */
    angular.module('modjoul-mobile.services')
        .factory('GPSConfigurationService', ['$location', '$log', 'apiHost', 'RestClient',
        function($location, $log, apiHost, RestClient) {

            var setOrgGPS = function(params, orgId) {
                return RestClient.put(apiHost + '/devices/gps?orgId=' + orgId, params)
                    .then(function(response){
                        return response;
                    }, function(err){
                        throw err;
                    });
            };
            var setDeviceGPS = function(params, deviceId) {

                var serviceUrl = apiHost + '/devices/gps?deviceId=' + deviceId;

                return RestClient.put(serviceUrl,params)
                  .then(function(response) {
                      return response;
                    },
                    function(err) {
                      throw err;
                    });
            };

            return {
                setOrgGPS : function(params, orgId){
                    return setOrgGPS(params, orgId);
                },
                setDeviceGPS : function(params, deviceId) {
                    return setDeviceGPS(params, deviceId);
                }
            };
        }]);
})();
