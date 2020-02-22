/* global Highcharts */
/* global angular */
(function() {
    'use strict';
    angular.module('modjoul-mobile.directives', []);

    angular.module('modjoul-mobile.directives')
        .directive('donutChart', function() {
            return {
                restrict: 'AE',
                replace: 'true',
                scope: {
                    chartOptions: '=chartOptions',
                    chartData: '=chartData'
                },

                link: function(scope, elem, attr) {
                    Highcharts.chart(scope.chartOptions.chartDivId, {
                        chart: {
                            type: 'solidgauge',
                            marginTop: 0,
                            backgroundColor: 'rgba(255, 255, 255, 0)'
                        },

                        title: {
                            text: scope.chartOptions.title.text,
                            align: 'center',
                            verticalAlign: scope.chartOptions.title.verticalAlign,
                            y: scope.chartOptions.title.YAxis
                        },

                        pane: {
                            startAngle: 0,
                            endAngle: 360,
                            background: [{
                                outerRadius: (scope.chartOptions.radius + 2) + '%',
                                innerRadius: (scope.chartOptions.radius - 2) + '%',
                                backgroundColor: Highcharts.Color(scope.chartOptions.borderColor).setOpacity(0.3).get(),
                                borderWidth: 0
                            }]
                        },

                        yAxis: {
                            min: 0,
                            max: 100,
                            lineWidth: 0,
                            tickPositions: []
                        },

                        plotOptions: {
                            solidgauge: {
                                borderWidth: '5px',
                                dataLabels: {
                                    enabled: false
                                },
                                linecap: 'round',
                                stickyTracking: false
                            }
                        },

                        series: [{
                            name: 'Stand',
                            borderColor: scope.chartOptions.borderColor,
                            data: [{
                                color: '#000',
                                radius: scope.chartOptions.radius + '%',
                                innerRadius: scope.chartOptions.radius + '%',
                                y: scope.chartData.value
                            }]
                        }]
                    });
                }
            };
        });

})();
