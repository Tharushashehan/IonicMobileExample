/* global angular */
/* global console */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
(function () {
    'use strict';

    angular.module('modjoul-mobile.services')
        .factory('SupervisorEmployeeService', ['$location', '$log', 'RestClient', 'UserCache', '$localStorage', 'apiHost',
            function ($location, $log, RestClient, UserCache, $localStorage, apiHost) {

                var getEmployeesForSupervisor = function (orgId, userId) {

                    var serviceUrl = apiHost + '/organizations/' + orgId +
                        '/supervisors/' + userId + '/users';

                    return RestClient.get(serviceUrl)
                        .then(function (response) {
                                console.log(response);
                                return response;
                            },
                            function (err) {
                                throw err;
                            });
                };

                var getEmployeeBeltStatus = function (orgId, userId) {

                    var serviceUrl = apiHost + '/organizations/' + orgId +
                        '/supervisors/' + userId + '/employee-belt-status';

                    return RestClient.get(serviceUrl)
                        .then(function (response) {
                                console.log(response);
                                return response;
                            },
                            function (err) {
                                throw err;
                            });
                };

                var getNow = function (orgId, userId) {
                    return RestClient.get(apiHost + '/organizations/' + orgId + '/supervisors/' + userId + '/now')
                        .then(function (response) {
                            return response;
                        }, function (err) {
                            throw err;
                        });
                };

                var setUserShift = function (orgId, userId, params) {

                    var requestData = {
                        startTime: params.startTime,
                        endTime: params.endTime
                    };

                    var serviceUrl = apiHost + '/organizations/' + orgId + '/users/' + userId + '/shift';
                    return RestClient.put(serviceUrl, requestData, false)
                        .then(function (response) {
                            return response;
                        }, function (err) {
                            throw err;
                        });
                };

                var vibrateBelt = function(orgId, supervisorId, userId) {
                    return RestClient.put(apiHost + '/organizations/' + orgId + '/users/' + userId + '/vibration?' +
                        'supervisor-id=' + supervisorId)
                        .then(function(response) {
                            return response;
                        }, function(err) {
                            throw err;
                        });
                };

                return {
                    GetEmployeesForSupervisor: function (orgId, userId) {
                        return getEmployeesForSupervisor(orgId, userId);
                    },
                    getEmployeeBeltStatus: function (orgId, userId) {
                        return getEmployeeBeltStatus(orgId, userId);
                    },
                    getNow: function (orgId, userId) {
                        return getNow(orgId, userId);
                    },
                    setUserShift: function (orgId, userId, params) {
                        return setUserShift(orgId, userId, params);
                    },
                    vibrateBelt: function (orgId, supervisorId, userId) {
                        return vibrateBelt(orgId, supervisorId, userId);
                    }
                };

            }
        ]);
})();
