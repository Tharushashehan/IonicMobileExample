/* global angular */
(function () {
    'use strict';

    angular.module('modjoul-mobile.services')
        .factory('WiFiHotspotService', ['$location', '$log', 'RestClient', 'UserCache', '$localStorage', 'apiHost',
            function ($location, $log, RestClient, UserCache, $localStorage, apiHost) {

                var getSSIDs = function () {

                    var serviceUrl = "http://192.168.1.1";

                    var payload = {
                        flag: 1
                    };

                    return RestClient.post(serviceUrl, payload)
                        .then(function (response) {
                                $log.debug(response);
                                return response;
                            },
                            function (err) {
                                throw err;
                            });
                };

                var postWifiDetails = function (ssid, password, securityType) {

                    var serviceUrl = "http://192.168.1.1";

                    var payload = {
                        flag: 2,
                        SSID: ssid,
                        password: password,
                        securityType: securityType

                    };

                    return RestClient.post(serviceUrl, payload)
                        .then(function (response) {
                                $log.debug(response);
                                return response;
                            },
                            function (err) {
                                throw err;
                            });
                };


                var factoryResetEmployee = function () {

                    var serviceUrl = "http://192.168.1.1";

                    var payload = {
                        flag: 3
                    };

                    return RestClient.post(serviceUrl, payload)
                        .then(function (response) {
                                $log.debug(response);
                                return response;
                            },
                            function (err) {
                                throw err;
                            });
                };



                var factoryResetSupervisor = function () {

                    var serviceUrl = "http://192.168.1.1";

                    var payload = {
                        flag: 4
                    };

                    return RestClient.post(serviceUrl, payload)
                        .then(function (response) {
                                $log.debug(response);
                                return response;
                            },
                            function (err) {
                                throw err;
                            });
                };


                return {
                    getSSIDs: function () {
                        return getSSIDs();
                    },
                    postWifiDetails: function (ssid, password, securityType) {
                        return postWifiDetails(ssid, password, securityType);
                    },
                    factoryResetEmployee: function () {
                        return factoryResetEmployee();
                    },
                    factoryResetSupervisor: function () {
                        return factoryResetSupervisor();
                    }
                };

            }
        ]);
})();
