/* global angular */
(function () {
    'use strict';
    angular.module('modjoul-mobile.services')
        .factory('EmployeeManagementService', ['$location', '$log', 'RestClient', '$localStorage', 'apiHost',
            function ($location, $log, RestClient, $localStorage, apiHost) {

                var createEmployee = function (params) {

                    var requestData = {
                        firstName: params.firstName,
                        lastName: params.lastName,
                        email: params.email,
                        role: params.role,
                        orgId: params.orgId,
                        employeeId: params.employeeId,
                        orgName: params.orgName,
                        supervisorId: params.supervisorId,
                        supervisorName: params.supervisorName,
                        deviceId: params.deviceId,
                        locationId: params.locationId,
                        workType: params.workType
                    };

                    if(params.jobFunction){
                        requestData.jobFunction = params.jobFunction;
                    }

                    return RestClient.post(apiHost + '/organizations/' + params.orgId + '/users', requestData, false)
                        .then(function (response) {
                            return response;
                        }, function (err) {
                            throw err;
                        });
                };

                var getEmployees = function (orgId, page, limit) {
                    if (!orgId)
                    {
                      orgId = $localStorage.orgId;
                    }
                    if (!page)
                    {
                      page = 1;
                    }
                    if (!limit)
                    {
                      limit = 50;
                    }

                    return RestClient.get(apiHost + '/organizations/' + orgId + '/users?role=employee&page=' + page + '&limit=' +limit)
                        .then(function (response) {
                            return response;
                        }, function (err) {
                            throw err;
                        });
                };

                var getEmployeesBySupervisor = function (orgId, supervisorId) {
                    return RestClient.get(apiHost + '/organizations/' + orgId + '/supervisors/' + supervisorId + '/users')
                        .then(function (response) {
                            return response;
                        }, function (err) {
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

                var assignSupervisor = function (orgId, employeeId, supervisorId, updaterId, updaterName) {

                    return RestClient.put(apiHost  + '/organizations/' + orgId + '/users/' + employeeId + '/supervisor', {
                        supervisorId: supervisorId,
                        updaterId: updaterId,
                        updaterName: updaterName
                    })
                        .then(function (response) {
                            return response;
                        }, function (err) {
                            throw err;
                        });
                };

                return {
                    createEmployee: function (params) {
                        return createEmployee(params);
                    },
                    getEmployees: function (orgId, page, limit) {
                        return getEmployees(orgId, page, limit);
                    },
                    getEmployeesBySupervisor: function (orgId, supervisorId) {
                        return getEmployeesBySupervisor(orgId, supervisorId);
                    },
                    getNow: function (orgId, userId) {
                        return getNow(orgId, userId);
                    },
                    assignSupervisor : function(orgId, employeeId, supervisorId, updaterId, updaterName) {
                        return assignSupervisor(orgId, employeeId, supervisorId, updaterId, updaterName);
                    }


                };


            }]);
})();
