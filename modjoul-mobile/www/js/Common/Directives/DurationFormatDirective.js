(function() {
    'use strict';
    /* global angular */
    angular.module('modjoul-mobile.directives');

    angular.module('modjoul-mobile.directives')
        .directive('durationFormat', [
                    function() {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'js/Common/Directives/duration-format.html',
                scope: {
                    duration: '=duration',
                    isFormatted: '=isFormatted'
                },
                link: function(scope, element) {

                    scope.durationElements = scope.duration.split(":");

                    scope.$watch('duration', function(newVal) {
                        scope.durationElements = newVal.split(":");
                    });


                }
            };

        }]);

})();
