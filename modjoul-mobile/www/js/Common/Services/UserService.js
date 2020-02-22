/* global angular */
(function () {
    'use strict';
    angular.module('modjoul-mobile.services')
        .factory('UsersService', ['$location', '$log', 'RestClient', '$localStorage', 'apiHost',
            function ($location, $log, RestClient, $localStorage, apiHost) {

                var getProfile = function (params) {

                    return RestClient.get(apiHost + '/organizations/' + params.orgId + '/user/' + params.userId)
                        .then(function (response) {
                            return response;
                        }, function (err) {
                            return err;
                        });
                };

                var getUsers = function (params, orgId) {
                    if (!orgId) {
                        if (params.role) {
                            return RestClient.get(apiHost + '/users?role=' + params.role)
                                .then(function (response) {
                                    return response;
                                }, function (err) {
                                    throw err;
                                });
                        } else {
                            return RestClient.get(apiHost + '/users')
                                .then(function (response) {
                                    return response;
                                }, function (err) {
                                    throw err;
                                });
                        }

                    } else {
                        if (params.role) {
                            return RestClient.get(apiHost + '/organizations/' + orgId + '/users?role=' + params.role)
                                .then(function (response) {
                                    return response;
                                }, function (err) {
                                    throw err;
                                });
                        } else {
                            return RestClient.get(apiHost + '/organizations/' + orgId + '/users')
                                .then(function (response) {
                                    return response;
                                }, function (err) {
                                    throw err;
                                });
                        }
                    }

                };
                var deleteUser = function (userId, orgId) {
                    if (!orgId) {
                        return RestClient.delete(apiHost + '/users/' + userId)
                            .then(function (response) {
                                return response;
                            }, function (err) {
                                throw err;
                            });
                    }
                    else {
                        return RestClient.delete(apiHost + '/organizations/' + orgId + '/users/' + userId)
                            .then(function (response) {
                                return response;
                            }, function (err) {
                                throw err;
                            });
                    }
                };
                var updatePassword = function (params, orgId) {
                    if (params.role) {
                        return RestClient.post(apiHost + '/organizations/' + orgId + '/user/change-password?password-token=84538070-741c-11e6-bf1e-5d537a468f3b' + params.role)
                            .then(function (response) {
                                return response;
                            }, function (err) {
                                return err;
                            });
                    } else {
                        return RestClient.get(apiHost + '/organizations/' + orgId + '/users')
                            .then(function (response) {
                                return response;
                            }, function (err) {
                                return err;
                            });
                    }

                };

                var createUser = function (params) {

                    var requestData = {
                        firstName: params.firstName,
                        lastName: params.lastName,
                        email: params.email,
                        job: params.job,
                        role: params.role,
                        orgId: params.orgId ? params.orgId : null,
                        employeeId: params.employeeId ? params.employeeId : null,
                        orgName: params.orgName ? params.orgId : null,
                        supervisorId: params.supervisorId ? params.supervisorId : null,
                        supervisorName: params.supervisorName ? params.supervisorName : null
                    };

                    return RestClient.post(apiHost + '/organizations/' + params.orgId + '/users', requestData, false)
                        .then(function (response) {
                            return response;
                        }, function (err) {
                            throw err;
                        });
                };


                var getSurveyQuestions = function (orgId, userId) {
                    return RestClient.get(apiHost + '/organizations/' + orgId + '/users/' + userId + '/survey')
                        .then(function (response) {
                            return response;
                        }, function (err) {
                            return err;
                        });
                };


                var getLastActivityTime = function(orgId, userId) {
                  return RestClient.get(apiHost + '/organizations/' + orgId + '/users/' + userId + '/last-activity')
                    .then(function(response){
                      return response;
                    }, function(err){
                      throw err;
                    });
                };


                return {
                    createUser: function (params) {
                        return createUser(params);
                    },
                    deleteUser: function (userId, orgId) {
                        return deleteUser(userId, orgId);
                    },
                    getProfile: function (params) {
                        return getProfile(params);
                    },
                    getUsers: function (params, orgId) {
                        return getUsers(params, orgId);
                    },
                    updatePassword: function (params, orgId) {
                        return updatePassword(params, orgId);
                    },
                    getSurveyQuestions: function (orgId, userId) {
                        return getSurveyQuestions(orgId, userId);
                    },
                    getLastActivityTime: function (orgId, userId) {
                        return getLastActivityTime(orgId, userId);
                    }

                };

            }]);
})();
