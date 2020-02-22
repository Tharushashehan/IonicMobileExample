(function() {
    'use strict';
    /* global angular
     */
    angular.module('modjoul-mobile.utilities')
        .filter('timeFormatFilter', ['moment', function(moment){
            var pad = function(num) {
                if(num.toString().length < 2) {
                    return "0" + num;
                } else {
                    return num;
                }
            };
            return function(input, units) {
                var duration = moment.duration(input, units);
                return duration.hours() + ":" + duration.minutes() + ":" + duration.seconds();
            };
        }]);
})();
