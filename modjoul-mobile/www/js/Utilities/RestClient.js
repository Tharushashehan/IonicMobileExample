/* global angular */
(function() {
    angular.module('modjoul-mobile.utilities', [])
        .factory('RestClient', ['$http', '$q', '$localStorage', function($http, $q, $localStorage) {

            // TODO externalize
            var endpointConfig;

            function setEndpointConfigs() {

              endpointConfig = {
                headers: {
                  'Content-Type': 'application/json'
                }
              };

              if ($localStorage.accessToken) {
                endpointConfig = {
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + $localStorage.accessToken
                  }
                };
              }
            }

            setEndpointConfigs();

            var getRequest = function(url) {
                var deferred = $q.defer();
                setEndpointConfigs();

                $http.get(url, endpointConfig).
                then(function(response) {
                    deferred.resolve(response);
                }, function(err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            };

            var putRequest = function(url, data) {
                var deferred = $q.defer();
                setEndpointConfigs();

                $http.put(url, data, endpointConfig).
                then(function(response) {
                    deferred.resolve(response);
                }, function(err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            };

            var patchRequest = function(url, data) {
                var deferred = $q.defer();
                setEndpointConfigs();

                $http.patch(url, data, endpointConfig).
                then(function(response) {
                    deferred.resolve(response);
                }, function(err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            };

            var postRequest = function(url, data) {
                var deferred = $q.defer();
                setEndpointConfigs();

                $http.post(url, data, endpointConfig).
                then(function(response) {
                    deferred.resolve(response);
                }, function(err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            };

          var postRequestWithTimeOut = function(url, data) {
            var deferred = $q.defer();
            var newConfig = angular.copy(endpointConfig);

            newConfig.timeout =30000;
            $http.post(url, data).
            then(function(response) {
              deferred.resolve(response);
            }, function(err) {
              deferred.reject(err);
            });
            return deferred.promise;
          };

            var deleteRequest = function(url) {
                var deferred = $q.defer();
                setEndpointConfigs();

                $http.delete(url, endpointConfig).
                then(function(response) {
                    deferred.resolve(response);
                }, function(err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            };

            return {
                get: getRequest,
                put: putRequest,
                post: postRequest,
                patch: patchRequest,
                delete: deleteRequest,
                postRequestWithTimeOut : postRequestWithTimeOut

            };

        }]);
})();
