/* global angular */
/* global console */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
(function () {
    'use strict';

    angular.module('modjoul-mobile.services')
        .factory('ProfileService', ['$location', '$log', 'RestClient', 'UserCache', '$localStorage', 'apiHost',
            function ($location, $log, RestClient, UserCache, $localStorage, apiHost) {

                var profileService = function (params, orgId, userId) {

                    var serviceUrl = apiHost + '/organizations/' + orgId +
                        '/users/' + userId;

                    return RestClient.get(serviceUrl)
                        .then(function (response) {
                                console.log(response);
                                return response;
                            },
                            function (err) {
                                throw err;
                            });
                };

                var updateProfile = function (params, orgId) {
                    return RestClient.put(apiHost + '/organizations/' + orgId + '/users/' + params.userId, params)
                        .then(function (response) {
                            return response;
                        }, function (err) {
                            return err;
                        });
                };

                return {
                    ProfileByUserID: function (params, orgId, userId) {
                        return profileService(params, orgId, userId);
                    },
                    updateProfile: function (params, orgId) {
                        return updateProfile(params, orgId);
                    }
                };

            }
        ]);
})();
