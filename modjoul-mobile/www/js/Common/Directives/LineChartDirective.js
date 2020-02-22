/* global angular */
/* global Highcharts */
(function() {
    'use strict';

    angular.module('modjoul-mobile.directives')
        .directive('lineChart', function($window, $log) {
            return {
                restrict: 'AE',
                replace: 'true',
                scope: {
                    options: '=',
                    data: '='
                },

                link: function(scope, elem, attr) {

                    $log.debug(scope.options);
                    Highcharts.chart(elem[0], {
                        colors: [scope.options.color],
                        chart: {
                            backgroundColor: 'transparent',
                            width: $window.innerWidth -50,
                            height: $window.innerHeight -220
                        },
                        title: {
                            text: '',
                            x: -20 //center
                        },

                        xAxis: {
                            categories: scope.data.timestamps,
                            labels: {
                                formatter: function () {
                                    return this.value;
                                }
                            }

                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: scope.options.metric
                            },
                            gridLineColor: 'transparent'
                        },
                        exporting: {
                            enabled: false
                        },
                        tooltip: {
                            headerFormat: '<b> ' + scope.options.format + '</b><br/>',
                            pointFormatter: function () {
                                var metric = scope.options.metric;
                                if (this.y > 1) {
                                    metric += 's';
                                }
                                return this.y + " " + metric;
                            }
                        },
                        legend: {
                            enabled: false
                        },
                        series: [{name:'',
                            data: scope.data.values
                        }]
                    });

                }
            };
        });

})();
