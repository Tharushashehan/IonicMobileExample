/* global angular */
/* global console */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
(function() {
    'use strict';
    angular.module('modjoul-mobile.services')
        .factory('RiskManagerMetricsService',  ['$log', 'RestClient', '$localStorage', 'apiHost',
        function($log, RestClient, $localStorage, apiHost)
        {
          var getWorkMetrics = function(params, orgId, locationId) {
            var serviceUrl = apiHost + '/organizations/' + orgId + '/locations/' + locationId + '/work?' + 'period=' + params.period;
                if (params.type)
                {
                  serviceUrl = serviceUrl +  '&type=' + params.type;
                }

                return RestClient.get(serviceUrl)
                    .then(function(response) {
                        return response;
                    }, function(err) {
                        throw err;
                    });
            };

            var getWorkMetricsTimeSeries = function(params, orgId, locationId) {
                return RestClient.get(apiHost + '/organizations/' + orgId + '/locations/' + locationId + '/work/time-series?start=' + params.start + '&end=' + params.end )
                    .then(function(response) {
                        return response;
                    }, function(err) {
                        throw err;
                    });
            };

            var getDriveMetrics = function(params, orgId, locationId) {
                var serviceUrl = apiHost + '/organizations/' + orgId + '/locations/' + locationId + '/drive?' + 'period=' + params.period;
                if (params.type)
                {
                  serviceUrl = serviceUrl +  '&type=' + params.type;
                }
                return RestClient.get(serviceUrl)
                    .then(function(response) {
                        return response;
                    }, function(err) {
                        throw err;
                    });
            };

            var getDriveMetricsTimeSeries = function(params, orgId, locationId) {
                return RestClient.get(apiHost + '/organizations/' + orgId + '/locations/' + locationId + '/drive/time-series?start=' + params.start + '&end=' + params.end )
                    .then(function(response) {
                        console.log(response);
                        return response;
                    }, function(err) {
                        throw err;
                    });
            };

            var getWorkTrendAnalysis = function(params, orgId, locationId) {
                return RestClient.get(apiHost + '/organizations/' + orgId + '/locations/'
                    + locationId + '/work-trend?start=' + params.start + '&end=' + params.end + '&type=' + params.type)
                    .then(function (response) {
                        return response;
                    }, function (err) {
                        throw err;
                    });
            };
            var getDriveTrendAnalysis = function(params, orgId, locationId) {
                return RestClient.get(apiHost + '/organizations/' + orgId + '/locations/'
                    + locationId + '/drive-trend?start=' + params.start + '&end=' + params.end + '&type=' + params.type)
                    .then(function (response) {
                        return response;
                    }, function (err) {
                        throw err;
                    });
            };

            var getWorkJobFunctionMetrics = function (params, orgId, jobFunction) {
                return RestClient.get(apiHost + '/organizations/' + orgId + '/job-functions/' + jobFunction + '/work?start=' + params.startDate+ "&end=" + params.endDate)
                    .then(function (response) {
                        return response;
                    }, function (err) {
                        throw err;
                    });
            };

            return {
                getWorkMetrics : function(params,orgId, locationId) {
                    return getWorkMetrics(params,orgId, locationId);
                },
                getWorkMetricsTimeSeries : function(params,orgId, locationId) {
                    return getWorkMetricsTimeSeries(params,orgId, locationId);
                },
                getDriveMetrics : function(params, orgId, locationId) {
                    return getDriveMetrics(params, orgId, locationId);
                },
                getDriveMetricsTimeSeries : function(params, orgId, locationId) {
                    return getDriveMetricsTimeSeries(params, orgId, locationId);
                },
                getWorkTrendAnalysis: function(params, orgId, locationId) {
                    return getWorkTrendAnalysis(params, orgId, locationId);
                },
                getDriveTrendAnalysis: function(params, orgId, locationId) {
                    return getDriveTrendAnalysis(params, orgId, locationId);
                },
                getWorkJobFunctionMetrics: function(params, orgId, jobFunction) {
                    return getWorkJobFunctionMetrics(params, orgId, jobFunction);
                }

            };
        }]);
})();
