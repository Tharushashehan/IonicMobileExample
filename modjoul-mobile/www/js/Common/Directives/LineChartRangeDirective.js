/* global angular */
/* global Highcharts */
(function() {
    'use strict';

    angular.module('modjoul-mobile.directives')

      .directive('lineChartRange', function($window, $log) {
        return {
          restrict: 'E',
          template: '<div></div>',
          scope: {
            data: '=',
            options: '=options'
          },
          link: function(scope, element) {
          $log.debug(scope.data);
            Highcharts.chart(element[0], {
                    colors: ["#F99D1C"],
                    chart: {
                        width:340,
                        height: 265
                    },
                    title: {
                        text: ''
                    },
                    xAxis: {
                        type: 'datetime',
                        endOnTick: true,
                        startOnTick: true,
                        showLastLabel: true,
                        labels: {
                            formatter: function () {
                                return Highcharts.dateFormat('%e %b', this.value);
                            }
                        }
                    },

                    yAxis: {
                        gridLineWidth: 0,
                        title: {
                            text: scope.options.yTitle || ''
                        }
                    },

                    tooltip: {
                        crosshairs: true,
                        shared: true,
                        valueSuffix: 'm'
                    },

                    legend: {},

                    series: [{
                        name: 'Average Height',
                        data: scope.data.average,
                        zIndex: 1,
                        marker: {
                            fillColor: 'white',
                            lineWidth: 2,
                            lineColor: '#F99D1C'
                        }
                    }, {
                        name: 'Range',
                        data: scope.data.data,
                        type: 'arearange',
                        lineWidth: 0,
                        linkedTo: ':previous',
                        fillOpacity: 0.3,
                        zIndex: 0
                    }]


            });
          }
        };



      });

})();
