/* global angular */
/* global console */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
(function () {
    'use strict';
    angular.module('modjoul-mobile.services')
        .factory('BreadcrumbService', ['$location', '$log', 'RestClient', '$localStorage', 'apiHost',
            function ($location, $log, RestClient, $localStorage, apiHost) {

                var getBreadcrumbTrail = function (params, orgId, userId) {
                    return RestClient.get(apiHost + '/organizations/' + orgId + '/users/' + userId + '/black-box-events?' +
                        'period=' + params.period)
                        .then(function (response) {
                            return response;
                        }, function (err) {
                            throw err;
                        });
                };

                var getBreadcrumbTrailEventDetails = function (orgId, userId, eventId) {

                    var serviceUrl = apiHost + '/organizations/' + orgId +
                        '/users/' + userId + '/black-box-events/' + eventId;

                    return RestClient.get(serviceUrl)
                        .then(function (response) {
                                console.log(response);
                                return response;
                            },
                            function (err) {
                                throw err;
                            });
                };


                return {
                    getBreadcrumbTrail: function (params, orgId, userId) {
                        return getBreadcrumbTrail(params, orgId, userId);
                    },
                    getBreadcrumbTrailEventDetails: function (orgId, userId, eventId) {
                        return getBreadcrumbTrailEventDetails(orgId, userId, eventId);
                    }
                };
            }]);
})();
