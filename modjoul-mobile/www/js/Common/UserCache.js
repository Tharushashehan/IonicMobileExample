/* global angular */
(function() {
    'use strict';

    angular.module('modjoul-mobile.services')
        .service('UserCache', [function() {

            var cache = {};

            this.get = function(key) {
                return cache[key] || null;
            };

            this.put = function(key, value) {
                cache[key] = value;
            };

            this.remove = function(key) {
                delete cache[key];
            };

        }]);

})();
