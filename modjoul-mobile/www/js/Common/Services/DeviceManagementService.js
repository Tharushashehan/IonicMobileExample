/* global angular */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
(function () {
    'use strict';
    angular.module('modjoul-mobile.services')
        .factory('DeviceManagementService', ['$location', '$log', 'RestClient', '$localStorage', 'apiHost',
            function ($location, $log, RestClient, $localStorage, apiHost) {

                var createDeviceType = function (params, orgId) {

                    var requestData = {deviceType: params.deviceType, metadata: params.metadata};

                    var serviceUrl = apiHost + "/organizations/" + orgId + "/devices/types";
                    return RestClient.post(serviceUrl, requestData)
                        .then(function (response) {
                            return response;
                        }, function (err) {
                            throw err;
                        });
                };

                var getDeviceTypes = function (orgId) {

                    var serviceUrl = apiHost + '/organizations/' + orgId + '/devices/types';

                    return RestClient.get(serviceUrl)
                        .then(function (response) {
                            return response;
                        }, function (err) {
                            throw err;
                        });
                };

                var createDevice = function (params, orgId) {

                    var requestData = {
                        deviceType: params.deviceType,
                        deviceId: params.deviceId,
                        metadata: params.metadata
                    };
                    var serviceUrl = apiHost + "/organizations/" + orgId + "/devices";
                    return RestClient.post(serviceUrl, requestData, false)
                        .then(function (response) {
                            return response;
                        }, function (err) {
                            throw err;
                        });
                };

                var getDevices = function (orgId) {

                    var serviceUrl = apiHost + '/organizations/' + orgId + '/devices';

                    return RestClient.get(serviceUrl)
                        .then(function (response) {
                            return response;
                        }, function (err) {
                            throw err;
                        });
                };

                var rebootDevice = function(deviceId) {

                    var serviceUrl = apiHost + '/devices/'+deviceId + '/reboot';

                    return RestClient.put(serviceUrl)
                        .then(function(response) {
                            return response;
                        }, function(err) {
                            throw err;
                        });
                };

                var getDevicesByType = function (orgId, deviceType) {

                    var serviceUrl = apiHost + '/organizations/' + orgId + '/devices';

                    if (deviceType) {
                        serviceUrl += '?deviceType=' + deviceType;
                    }
                    return RestClient.get(serviceUrl)
                        .then(function (response) {
                            return response;
                        }, function (err) {
                            throw err;
                        });
                };

                var deleteDevice = function (params, orgId) {
                    return RestClient.delete(apiHost + '/organizations/' + orgId + '/devices/type/' + params.deviceTye + 'id/' + params.deviceId)
                        .then(function (response) {
                            return response;
                        }, function (err) {
                            throw err;
                        });
                };


                var suspendAllDevicesForOrganization = function (orgId, activate, deviceType) {
                    return RestClient.get(apiHost + '/organizations/' + orgId + '/devices/types/' + deviceType + '/subscription?suspend=' + activate)
                        .then(function (response) {
                            return response;
                        }, function (err) {
                            throw err;
                        });
                };

                var subscription = function (orgId, deviceId, activate) {
                    var params = "?";
                    if(orgId){
                        params += "orgId=" + orgId;
                    }
                    else if(deviceId){
                        params += "deviceId=" + deviceId;
                    }
                    return RestClient.put(apiHost + '/devices/subscription' + params,{
                        status: activate
                    })
                        .then(function (response) {
                            return response;
                        }, function (err) {
                            throw err;
                        });
                };
                var deviceDetails = function (deviceId) {
                    return RestClient.get(apiHost + '/devices/' + deviceId)
                        .then(function (response) {
                            return response;
                        }, function (err) {
                            throw err;
                        });
                };
                var generateSmartDeviceId = function (orgId, deviceType) {
                    return RestClient.get(apiHost + '/organizations/' + orgId + '/devices/types/' + deviceType +'/id')
                        .then(function (response) {
                            return response;
                        }, function (err) {
                            throw err;
                        });
                };

//                var getOrgDeviceStatistics = function (orgId,allOrgs) {
//                    return RestClient.get(apiHost + '/organizations/' + orgId + '/devices/statistics')
//                        .then(function (response) {
//                            return response;
//                        }, function (err) {
//                            throw err;
//                        });
//                };
                var getOrgDeviceStatistics = function (orgId,allOrgs) {
                  var url = allOrgs ? apiHost + '/devices/statistics'
                    : apiHost + '/organizations/' + orgId + '/devices/statistics';
                  return RestClient.get(url)
                    .then(function (response) {
                        return response;
                    }, function (err) {
                        throw err;
                    });
                  };

                var getAllOrgDeviceStatistics = function() {
                  var url = apiHost + '/devices/statistics';

                  return RestClient.get(url)
                    .then(function(response) {
                      return response;
                    }, function(err) {
                      throw err;
                    });
                };


                var getAllDevicesForOrganization = function(params, orgId, state) {
                    var limit = params.limit ? params.limit : 50;
                    var page = params.page ? params.page : 1;
                    var queryString = '?limit=' + limit + '&page=' + page;
                    if(state){
                        queryString += '&state=' + state;
                    }
                    return RestClient.get(apiHost + '/organizations/' + orgId + '/devices' + queryString)
                        .then(function(response) {
                            return response;
                        }, function(err) {
                            throw err;
                        });
                };


                return {
                    createDeviceType: function (params, orgId) {
                        return createDeviceType(params, orgId);
                    },
                    getDeviceTypes: function (orgId) {
                        return getDeviceTypes(orgId);
                    },
                    createDevice: function (params, orgId) {
                        return createDevice(params, orgId);
                    },
                    getDevices: function (orgId) {
                        return getDevices(orgId);
                    },
                    rebootDevice : function(deviceId) {
                        return rebootDevice(deviceId);
                    },
                    getDeviceDetails: function (deviceId) {
                        return deviceDetails(deviceId);
                    },
                    getDevicesByType: function (orgId, deviceType) {
                        return getDevicesByType(orgId, deviceType);
                    },
                    deleteDevice: function (params, orgId) {
                        return deleteDevice(params, orgId);
                    },
                    suspendAllDevicesForOrganization: function (orgId, activate, deviceType) {
                        return suspendAllDevicesForOrganization(orgId, activate, deviceType);
                    },
                    subscription: function (orgId, activate, deviceId, deviceType) {
                        return subscription(orgId, activate, deviceId, deviceType);
                    },
                    generateSmartDeviceId: function (orgId, deviceType) {
                        return generateSmartDeviceId(orgId, deviceType);
                    },
                    getOrgDeviceStatistics : function(orgId,allOrgs) {
                        return getOrgDeviceStatistics(orgId,allOrgs);
                    },
                    getAllOrgDeviceStatistics : function(){
                        return getAllOrgDeviceStatistics();
                    },
                    getAllDevicesForOrganization : function(params, orgId, state) {
                        return getAllDevicesForOrganization(params, orgId, state);
                    }
                };

            }]);
})();
