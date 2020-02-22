/* global angular
   global Highcharts */
(function() {
    'use strict';
    angular.module('modjoul-mobile.directives')
    .directive('pieChart', function() {
        return {
            restrict: 'AE',
            replace: 'true',
            scope: {
                chartOptions: '=chartOptions',
                chartData: '=chartData'
            },

            link: function(scope, elem, attr) {

                Highcharts.chart('drivingSafetyChart', {
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        backgroundColor: 'rgba(255, 255, 255, 0)',
                        type: 'pie'
                    },
                    colors:['#41afb5', '#b06804'],
                    title: {
                        text: '',
                        style:{
                            color: '#fff'
                        }
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    legend:{
                        itemStyle:{
                            color: '#fff'
                        }
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            borderWidth : 0,
                            dataLabels: {
                                enabled: false
                            },
                            showInLegend: true
                        }
                    },
                    series: [{
                        name: 'Brands',
                        colorByPoint: true,
                        data: scope.chartData
                    }]
                });
            }
        };
    });
})();
