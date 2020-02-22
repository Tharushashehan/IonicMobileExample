/* global angular */
/* global console */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

(function () {
    'use strict';
    angular.module('modjoul-mobile.services', []);

    angular.module('modjoul-mobile.services')
        .factory('LoginService', ['$location', '$log', 'RestClient', 'UserCache', 'apiHost',
            function ($location, $log, RestClient, UserCache, apiHost) {
                var login = function (params) {
                    var requestData = {
                        email: params.username,
                        password: params.password
                    };
                    return RestClient.post(apiHost + '/login', requestData).then(function (response) {
                        console.log(response);

                        UserCache.put('auth', response);

                        // TODO populate this in the login response
                        UserCache.put('profile', {
                            'fullName': 'Brandon March',
                            'employeeId': '1',
                            'organization': 'Operations',
                            'group': 'Warehouse Associate',
                            'avatar': '/img/avatar.png',
                            'points': '43'
                        });

                        return response;
                    }, function (err) {
                        throw err;
                    });
                };

                var logout = function (orgId, userId, refreshToken) {
                    var serviceUrl = apiHost + '/logout';

                    return RestClient.post(serviceUrl, {})
                        .then(function (response) {
                                console.log(response);
                                return response;
                            },
                            function (err) {
                                throw err;
                            });
                };

                var registerForPushNotification = function (orgId, userId, pushToken, deviceType) {
                    var serviceUrl = apiHost + '/organizations/' + orgId + '/users/' + userId + '/push-token';
                    var requestData = {
                        'pushDeviceType': deviceType,
                        'token': pushToken
                    };

                    return RestClient.post(serviceUrl, requestData)
                        .then(function (response) {
                                console.log(response);
                                return response;
                            },
                            function (err) {
                                throw err;
                            });
                };

                var unRegisterFromPushNotification = function (orgId, userId, deviceType, pushToken) {
                    var serviceUrl = apiHost + '/organizations/' + orgId + '/users/' + userId + '/push-token/' + pushToken;

                    return RestClient.delete(serviceUrl)
                        .then(function (response) {
                                console.log(response);
                                return response;
                            },
                            function (err) {
                                throw err;
                            });
                };

                var forgotPassword = function (email) {
                    return RestClient.put(apiHost + '/user/forgot-password?email=' + email).then(function (response) {
                        return response;
                    }, function (err) {
                        throw err;
                    });
                };

                return {
                    login: function (params) {
                        return login(params);
                    },

                    registerForPushNotification: function (orgId, userId, pushToken, deviceType) {
                        return registerForPushNotification(orgId, userId, pushToken, deviceType);
                    },

                    forgotPassword: function (email) {
                        return forgotPassword(email);
                    },

                    unRegisterFromPushNotification: function (orgId, userId, deviceType, pushToken) {
                        return unRegisterFromPushNotification(orgId, userId, deviceType, pushToken);
                    },

                    logout: function (orgId, userId, refreshToken) {
                        return logout(orgId, userId, refreshToken);
                    }
                };
            }
        ]);
})();
