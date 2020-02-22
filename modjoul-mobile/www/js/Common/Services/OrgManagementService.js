/* global angular */
(function () {
    'use strict';
    angular.module('modjoul-mobile.services')
        .factory('OrgManagementService', ['$location', '$log', 'RestClient', '$localStorage', 'apiHost',
            function ($location, $log, RestClient, $localStorage, apiHost) {

                var createOrganization = function (params) {

                    var requestData = {
                        name: params.name,
                        address: params.address,
                        contact: params.contact,
                        orgLogo: params.orgLogo,
                        logoMimeType: params.logoMimeType,
                        orgJobFunctions: params.orgJobFunctions
                    };

                    return RestClient.post(apiHost + '/organizations', requestData, false)
                        .then(function (response) {
                            return response;
                        }, function (err) {
                            throw err;
                        });
                };
                var createLocation = function (params) {

                    var requestData = {
                        orgId: params.orgId,
                        locationName: params.locationName,
                        locationCode: params.locationCode,
                        streetName: params.streetName,
                        city: params.city,
                        state: params.state,
                        postalCode: params.postalCode,
                        contact: params.contact
                    };

                    return RestClient.post(apiHost + '/organizations/' + params.orgId + '/locations', requestData, false)
                        .then(function (response) {
                            return response;
                        }, function (err) {
                            throw err;
                        });
                };
                var getLocations = function (orgId, needMetrics) {
                    var serviceUrl = apiHost + '/organizations/' + orgId + '/locations';
                    if (needMetrics) {
                        serviceUrl += '?metrics=true';
                    }
                    return RestClient.get(serviceUrl)
                        .then(function (response) {
                            return response;
                        }, function (err) {
                            throw err;
                        });
                };
                var getLocationCount = function (orgId) {
                    var serviceUrl = apiHost + '/organizations/' + orgId + '/locations/users/count';
                    return RestClient.get(serviceUrl)
                        .then(function (response) {
                            return response;
                        }, function (err) {
                            throw err;
                        });
                };

                var getJobFunctionCount = function (orgId) {
                    var serviceUrl = apiHost + '/organizations/' + orgId + '/job-functions/users/count';
                    return RestClient.get(serviceUrl)
                        .then(function (response) {
                            return response;
                        }, function (err) {
                            throw err;
                        });
                };
                var deleteLocation = function (locationId, orgId) {
                    return RestClient.delete(apiHost + '/organizations/' + orgId + '/locations/' + locationId)
                        .then(function (response) {
                            return response;
                        }, function (err) {
                            throw err;
                        });
                };
                var getOrganizations = function (isLimitedFields) {
                    var params = "";
                    if(isLimitedFields){
                        params += "?fields=orgId,name,orgName";
                    }
                    return RestClient.get(apiHost + '/organizations' + params)
                        .then(function (response) {
                            return response;
                        }, function (err) {
                            throw err;
                        });
                };
                var getSupervisorsForOrganization = function (orgId, page, limit) {
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

                    return RestClient.get(apiHost + '/organizations/' + orgId + '/users?role=supervisor&page=' + page + '&limit=' +limit)
                        .then(function (response) {
                            return response;
                        }, function (err) {
                            throw err;
                        });
                };

                var getOrgAdminsForOrganization = function (orgId) {
                    return RestClient.get(apiHost + '/organizations/' + orgId + '/users?role=org_admin')
                        .then(function (response) {
                            return response;
                        }, function (err) {
                            throw err;
                        });
                };

                var activateDevice = function(orgId, deviceType, params){

                  var requestData = {
                    deviceId: params.deviceId
                  };

                  return RestClient.put(apiHost + '/organizations/' + orgId + '/devices/types/' + deviceType, requestData)
                    .then(function (response) {
                      return response;
                    }, function (err) {
                      throw err;
                    });
                };

                var getOrgConfiguration = function (orgId) {
                  return RestClient.get(apiHost + '/organizations/' + orgId + '/configuration')
                    .then(function (response) {
                      return response;
                    }, function (err) {
                      throw err;
                    });
                };

                var deleteUser = function (employeeId, orgId) {
                  return RestClient.delete(apiHost + '/organizations/' + orgId + '/users/' + employeeId)
                    .then(function (response) {
                      return response;
                    }, function (err) {
                      throw err;
                    });
                };

                var deleteDevice = function (deviceId, deviceType, orgId) {
                  return RestClient.delete(apiHost + '/organizations/' + orgId +'/devices/types/' + deviceType + '/id/' + deviceId)
                    .then(function (response) {
                      return response;
                    }, function (err) {
                      throw err;
                    });
                };

                var getOrganizationVisibility = function(orgId) {
                  return RestClient.get(apiHost + '/organizations/'+ orgId + '/data/access')
                    .then(function(response) {
                      return response;
                    }, function(err) {
                        throw err;
                    });
                };

                var postOrganizationVisibility = function(params,orgId) {
                  return RestClient.post(apiHost + '/organizations/'+ orgId + '/data/access',params)
                      .then(function(response) {
                          return response;
                      }, function(err) {
                          throw err;
                      });
                };

                var deleteOrganizationVisibility = function(consumerId, accessId) {
                    return RestClient.delete(apiHost + '/organizations/'+ consumerId + '/data/access/' + accessId)
                        .then(function(response) {
                            return response;
                        }, function(err) {
                            throw err;
                        });
                };

                var promoteEmployee = function(orgid, employeeeId) {
                    return RestClient.put(apiHost + '/organizations/'+ orgid + '/users/' + employeeeId + '/promote')
                        .then(function(response) {
                            return response;
                        }, function(err) {
                            throw err;
                        });
                };


                var demoteSupervisor = function(orgid, params, supervisorId, updater) {
                    return RestClient.put(apiHost + '/organizations/'+ orgid + '/users/' + supervisorId + '/demote',{
                        supervisorId: params.userId,
                        supervisorName: params.name,
                        updaterId: updater.userId,
                        updaterName: updater.firstName + " " + updater.lastName
                    })
                        .then(function(response) {
                            return response;
                        }, function(err) {
                            throw err;
                        });
                };

                var getExistingOrgDetails = function(orgId) {
                  return RestClient.get(apiHost + '/organizations/'+ orgId)
                    .then(function(response) {
                      return response;
                    }, function(err) {
                        throw err;
                    });
                };

                var updateOrgDetails = function(orgId, params) {
                    return RestClient.put(apiHost + '/organizations/'+ orgId,{
                        address : params.address,
                        contact :  params.contact,
                        orgLogo : params.logo,
                        orgLogoUrl: params.logoUrl,
                        orgJobFunctions: params.orgJobFunctions,
                        logoMimeType: params.logoMimeType
                    }).then(function(response) {
                          return response;
                      }, function(err) {
                          throw err;
                      });
                };

                return {
                    createOrganization: function (params) {
                        return createOrganization(params);
                    },
                    getOrganizations: function (isLimitedFields) {
                        return getOrganizations(isLimitedFields);
                    },
                    getSupervisorsForOrganization: function (orgId, page, limit) {
                        return getSupervisorsForOrganization(orgId, page, limit);
                    },
                    getOrgAdminsForOrganization: function (orgId) {
                        return getOrgAdminsForOrganization(orgId);
                    },
                    createLocation: function (params) {
                        return createLocation(params);
                    },
                    getLocations: function (orgId, needMetrics) {
                        return getLocations(orgId, needMetrics);
                    },
                    getLocationCount: function (orgId) {
                        return getLocationCount(orgId);
                    },
                    getJobFunctionCount: function (orgId) {
                        return getJobFunctionCount(orgId);
                    },
                    deleteLocation: function (locationId, orgId) {
                        return deleteLocation(locationId, orgId);
                    },
                    activateDevice : function (orgId, deviceType, params) {
                        return activateDevice(orgId, deviceType, params);
                    },
                    getOrgConfiguration : function (orgId){
                        return getOrgConfiguration(orgId);
                    },
                    deleteUser : function (employeeId, orgId) {
                        return deleteUser(employeeId, orgId);
                    },
                    deleteDevice : function (deviceId, deviceType, orgId) {
                      return deleteDevice(deviceId, deviceType, orgId);
                    },
                    getOrganizationVisibility : function(orgId){
                      return getOrganizationVisibility(orgId);
                    },
                    postOrganizationVisibility : function (params, orgId){
                      return postOrganizationVisibility(params, orgId);
                    },
                    deleteOrganizationVisibility : function(consumerId, accessId){
                      return deleteOrganizationVisibility(consumerId, accessId);
                    },
                    promoteEmployee : function(orgid, employeeeId){
                        return promoteEmployee(orgid, employeeeId);
                    },
                    demoteSupervisor : function(orgid,params, supervisorId,updater){
                        return demoteSupervisor(orgid, params, supervisorId, updater);
                    },
                    getExistingOrgDetails : function(orgId){
                        return getExistingOrgDetails(orgId);
                    },
                    updateOrgDetails : function(orgId, params){
                        return updateOrgDetails(orgId, params);
                    }
                };

            }]);
})();
