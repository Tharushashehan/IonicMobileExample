/* global angular */
(function() {
    'use strict';

    angular.module('modjoul-mobile.services')
        .factory('DriveTimeService', ['$location', '$log', 'RestClient', '$localStorage', 'apiHost2',
            function($location, $log, RestClient, $localStorage, apiHost2) {


                  var driveTimeServicePeriod = function(params, orgId, userId) {

                      var serviceUrl = apiHost2 + '/organizations/' + orgId +
                        '/users/' + userId + '/drive-time?' + 'period=' + params.period + '&type=' + params.type;


                      return RestClient.get(serviceUrl)
                        .then(function(response) {
                          $log.debug(response);
                            return response;
                          },
                          function(err) {
                            throw err;
                          });
                  };

                var indoorDriveTimeServicePeriod = function(params, orgId, userId) {

                    var serviceUrl = apiHost2 + '/organizations/' + orgId +
                        '/users/' + userId + '/indoor-driving?' + 'period=' + params.period + '&type=' + params.type;


                    return RestClient.get(serviceUrl)
                        .then(function(response) {
                                $log.debug(response);
                                return response;
                            },
                            function(err) {
                                throw err;
                            });
                };

                  var driveTimeServiceSeries = function(params, orgId, userId) {

                      var serviceUrl = apiHost2 + '/organizations/' + orgId +
                        '/users/' + userId + '/drive-time/time-series?' + 'period=' + params.period;


                      return RestClient.get(serviceUrl)
                        .then(function(response) {
                            $log.debug(response);
                            return response;
                          },
                          function(err) {
                            throw err;
                          });
                  };

//                var idleTimeServicePeriod = function(params, orgId, userId) {
//
//                    var serviceUrl = apiHost + '/organizations/' + orgId +
//                        '/user/' + userId + '/activities/idle-time?period=' + params.period;
//
//                    return RestClient.get(serviceUrl)
//                        .then(function(response) {
//                                $log.debug(response)
//                                return response;
//                            },
//                            function(err) {
//                                throw err;
//                            });
//                };

                return {
                    DriveTimeSummaryByPeriod: function(params,orgId, userId) {
                        return driveTimeServicePeriod(params,orgId, userId);
                    },
                    IndoorDriveTimeServicePeriod: function(params,orgId, userId) {
                        return indoorDriveTimeServicePeriod(params,orgId, userId);
                    },
                    DriveTimeServiceSeries: function(params,orgId, userId) {
                        return driveTimeServiceSeries(params,orgId, userId);
                    },
                    getDriveTime : function(params, orgId, userId){
                      return driveTimeServicePeriod(params, orgId, userId);
                    },
                    getDriveTimeTimeSeries : function(params, orgId, userId){
                      return driveTimeServiceSeries(params, orgId, userId);
                    }
                };
            }
        ]);

})();
