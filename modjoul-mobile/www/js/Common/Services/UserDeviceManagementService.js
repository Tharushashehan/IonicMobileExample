/* global angular */
(function () {
    'use strict';
    angular.module('modjoul-mobile.services')
        .factory('UserDeviceManagementService', ['$location', '$log', 'RestClient', '$localStorage', 'apiHost',
            function ($location, $log, RestClient, $localStorage, apiHost) {

                var associateDevice = function (params, orgId, userId, deviceType) {
                    var requestData = {
                        deviceId: params.deviceId,
                        deviceType: deviceType,
                        assign: true
                    };
                    return RestClient.put(apiHost + '/organizations/' + orgId + '/users/' + userId + '/devices/association',requestData)
                        .then(function (response) {
                            return response;
                        }, function (err) {
                            throw err;
                        });
                };

                var unassignDevice = function (params, orgId, userId, deviceType) {
                    var requestData = {
                        deviceId: params.deviceId,
                        deviceType: deviceType,
                        assign: false
                    };
                    return RestClient.put(apiHost + '/organizations/' + orgId + '/users/' + userId + '/devices/association',requestData)
                        .then(function (response) {
                            return response;
                        }, function (err) {
                            throw err;
                        });
                };

                var assignDevice = function(params, orgId, userId, deviceType) {
                  var requestData = {
                      deviceId: params.deviceId,
                      deviceType: deviceType,
                      assign: true
                  };
                  return RestClient.put(apiHost + '/organizations/' + orgId + '/users/' + userId + '/devices/association', requestData)
                      .then(function(response){
                          return response;
                      }, function(err){
                          throw err;
                      });
                };
//

                var getAssignedDevice = function (orgId, userId) {

                    return RestClient.get(apiHost + '/organizations/' + orgId + '/users/' + userId + '/devices/association')
                        .then(function (response) {
                            return response;
                        }, function (err) {
                            throw err;
                        });
                };

                var getDeviceDetails = function(deviceId) {
                  return RestClient.get(apiHost + '/devices/'+deviceId)
                    .then(function(response) {
                      return response;
                    }, function(err) {
                      throw err;
                    });
                };

                return {
                    associateDevice : function(params, orgId, userId, deviceType){
                        return associateDevice(params, orgId, userId, deviceType);
                    },
                    unassignDevice : function(params, orgId, userId, deviceType){
                        return unassignDevice(params, orgId, userId, deviceType);
                    },
                    assignDevice : function(params, orgId, userId, deviceType){
                        return assignDevice(params, orgId, userId, deviceType);
                    },
                    getAssignedDevice : function(orgId, userId){
                        return getAssignedDevice(orgId, userId);
                    },
                    getDeviceDetails : function (deviceId){
                      return getDeviceDetails(deviceId);
                    }

                };
            }]);
})();
