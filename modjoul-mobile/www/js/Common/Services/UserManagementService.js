/* global angular */
(function() {
    'use strict';
    angular.module('modjoul-mobile.services')
        .factory('UserManagementService', ['$location', '$log', 'RestClient', '$localStorage', 'apiHost',
                                                      function($location, $log, RestClient, $localStorage, apiHost) {

            var createUser = function(params) {


                var requestData = {
                    firstName : params.firstName,
                    lastName : params.lastName,
                    email : params.email,
                    job : params.job,
                    role: params.role,
                    orgId: params.orgId,
                    employeeId: params.employeeId,
                    orgName: params.orgName,
                    supervisorId: params.supervisorId,
                    supervisorName: params.supervisorName,
                    deviceId: params.deviceId,
                    locationId : params.locationId,
                    workType: params.workType
                };

                $log.debug(requestData);

                return RestClient.post(apiHost + '/organizations/' + params.orgId + '/users', requestData, false)
                    .then(function(response){
                        return response;
                    }, function(err){
                        throw err;
                    });
            };
            var getUser = function() {
                var orgId = $localStorage.orgId;
                return RestClient.get(apiHost + '/organizations/' + orgId + '/users')
                    .then(function(response) {
                        return response;
                    }, function(err) {
                        throw err;
                    });
            };

            var getUserBySupervisor = function(orgId, supervisorId) {
                return RestClient.get(apiHost + '/organizations/' + orgId + '/supervisors/' + supervisorId + '/users')
                    .then(function(response) {
                        return response;
                    }, function(err) {
                        throw err;
                    });
            };
            var deleteUser = function(orgId, userId) {
                return RestClient.delete(apiHost + '/organizations/' + orgId + '/users/' + userId)
                    .then(function(response) {
                        return response;
                    }, function(err) {
                        throw err;
                    });
            };

            return {
                createUser : function(params){
                    return createUser(params);
                },
                getUser : function() {
                    return getUser();
                },
                getUserBySupervisor : function(orgId, supervisorId) {
                    return getUserBySupervisor(orgId, supervisorId);
                },
                deleteUser : function(orgId,userId) {
                  return deleteUser(orgId, userId);
                }


            };
        }]);
})();
