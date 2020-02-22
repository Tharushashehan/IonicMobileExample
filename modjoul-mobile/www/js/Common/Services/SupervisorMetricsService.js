/* global angular */
(function() {
    'use strict';

    angular.module('modjoul-mobile.services')
        .factory('SupervisorMetricsService', ['$log', 'RestClient', 'apiHost',
            function($log, RestClient, apiHost) {


            var getAggressiveEventsWorkMetrics = function(params, orgId, userId) {
                return RestClient.get(apiHost + '/organizations/' + orgId + '/supervisors/' + userId + '/near-miss-events?' +
                        'period=' + params.period)
                    .then(function(response){
                        return response;
                    }, function(err){
                        throw err;
                    });
            };

            var getAggressiveEventsWorkTimeSeries = function(params, orgId, userId) {
                return RestClient.get(apiHost + '/organizations/' + orgId + '/supervisors/' + userId + '/near-miss-events/time-series?' +
                        'start=' + params.start + '&end=' + params.end)
                    .then(function(response){
                        return response;
                    }, function(err){
                        throw err;
                    });
            };

              var getAggressiveEventsDriveMetrics = function(params, orgId, userId) {
                return RestClient.get(apiHost + '/organizations/' + orgId + '/supervisors/' + userId + '/aggressive-events?' +
                  'period=' + params.period)
                  .then(function(response){
                    return response;
                  }, function(err){
                    throw err;
                  });
              };

              var getAggressiveEventsDriveTimeSeries = function(params, orgId, userId) {
                return RestClient.get(apiHost + '/organizations/' + orgId + '/supervisors/' + userId + '/aggressive-events/time-series?' +
                  'start=' + params.start + '&end=' + params.end)
                  .then(function(response){
                    return response;
                  }, function(err){
                    throw err;
                  });
              };

            var getIdleTime = function(params, orgId, userId) {
                return RestClient.get(apiHost + '/organizations/' + orgId + '/supervisors/' + userId + '/idle-time?' +
                        'period=' + params.period)
                    .then(function(response){
                        return response;
                    }, function(err){
                        throw err;
                    });
            };
            var getIdleTimeTimeSeries = function(params, orgId, userId) {
                return RestClient.get(apiHost + '/organizations/' + orgId + '/supervisors/' + userId + '/idle-time/time-series?' +
                        'start=' + params.start + '&end=' + params.end)
                    .then(function(response){
                        return response;
                    }, function(err){
                        throw err;
                    });
            };
            var getWorkTime = function(params, orgId, userId) {
                return RestClient.get(apiHost + '/organizations/' + orgId + '/supervisors/' + userId + '/work-time?' +
                        'period=' + params.period )
                    .then(function(response){
                        return response;
                    }, function(err){
                        throw err;
                    });
            };
            var getWorkTimeTimeSeries = function(params, orgId, userId) {
                return RestClient.get(apiHost + '/organizations/' + orgId + '/supervisors/' + userId + '/work-time/time-series?' +
                        'start=' + params.start + '&end=' + params.end)
                    .then(function(response){
                        return response;
                    }, function(err){
                        throw err;
                    });
            };
            var getDriveTime = function(params, orgId, userId) {
              return RestClient.get(apiHost + '/organizations/' + orgId + '/supervisors/' + userId + '/drive-time?' +
                'period=' + params.period )
                .then(function(response){
                  return response;
                }, function(err){
                  throw err;
                });
            };
            var getDriveTimeTimeSeries = function(params, orgId, userId) {
              return RestClient.get(apiHost + '/organizations/' + orgId + '/supervisors/' + userId + '/drive-time/time-series?' +
                'start=' + params.start + '&end=' + params.end)
                .then(function(response){
                  return response;
                }, function(err){
                  throw err;
                });
            };

            var getEffectivePay = function(params, orgId, userId) {
                return RestClient.get(apiHost + '/organizations/' + orgId + '/supervisors/' + userId + '/effective-pay?' +
                        'period=' + params.period + '&type=' + params.type)
                    .then(function(response){
                        return response;
                    }, function(err){
                        throw err;
                    });
            };

            var getNearMissEvents = function(params, orgId, userId) {
              var serviceURL = apiHost + '/organizations/' + orgId + '/supervisors/' + userId + '/near-miss-events?' +
                'period=' + params.period;
                return RestClient.get(serviceURL)
                    .then(function(response){
                        return response;
                    }, function(err){
                        throw err;
                    });
            };

            var getNearMissEventsTimeSeries = function(params, orgId, userId) {
              var serviceURL = apiHost + '/organizations/' + orgId + '/supervisors/' + userId + '/near-miss-events/time-series?' +
                'start=' + params.start + '&end=' + params.end;

                return RestClient.get(serviceURL)
                    .then(function(response){
                        return response;
                    }, function(err){
                        throw err;
                    });
            };

                var getScorecardPeriodValues = function(params, orgId, supervisorId) {

                    var serviceURL = apiHost + '/organizations/' + orgId + '/supervisors/' + supervisorId + '/scorecard?' +
                        'period=' + params.period + "&type=" + params.type;

                    return RestClient.get(serviceURL)
                        .then(function(response){
                            return response;
                        }, function(err){
                            throw err;
                        });
                };

            return {
                getAggressiveEventsWorkMetrics : function(params, orgId, userId){
                    return getAggressiveEventsWorkMetrics(params, orgId, userId);
                },
                getAggressiveEventsWorkTimeSeries : function(params, orgId, userId){
                    return getAggressiveEventsWorkTimeSeries(params, orgId, userId);
                },
                getAggressiveEventsDriveMetrics : function(params, orgId, userId){
                  return getAggressiveEventsDriveMetrics(params, orgId, userId);
                },
                getAggressiveEventsDriveTimeSeries : function(params, orgId, userId){
                  return getAggressiveEventsDriveTimeSeries(params, orgId, userId);
                },
                getIdleTime : function(params, orgId, userId){
                    return getIdleTime(params, orgId, userId);
                },
                getIdleTimeTimeSeries : function(params, orgId, userId){
                    return getIdleTimeTimeSeries(params, orgId, userId);
                },
                getWorkTime : function(params, orgId, userId){
                    return getWorkTime(params, orgId, userId);
                },
                getWorkTimeTimeSeries : function(params, orgId, userId){
                    return getWorkTimeTimeSeries(params, orgId, userId);
                },
                getDriveTime : function(params, orgId, userId){
                  return getDriveTime(params, orgId, userId);
                },
                getDriveTimeTimeSeries : function(params, orgId, userId){
                  return getDriveTimeTimeSeries(params, orgId, userId);
                },
                getEffectivePay : function(params, orgId, userId){
                    return getEffectivePay(params, orgId, userId);
                },
                getNearMissEvents : function(params, orgId, userId){
                    return getNearMissEvents(params, orgId, userId);
                },
                getNearMissEventsTimeSeries : function(params, orgId, userId){
                    return getNearMissEventsTimeSeries(params, orgId, userId);
                },
                getScorecardPeriodValues : function(params, orgId, supervisorId) {
                    return getScorecardPeriodValues(params, orgId, supervisorId);
                }
            };

            }
        ]);
})();
