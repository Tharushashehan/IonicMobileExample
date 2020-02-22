/* global angular */
/* global Highcharts */
(function() {
    'use strict';

    angular.module('modjoul-mobile.directives')

      .directive('lineChartRanges', function($window) {
        return {
          restrict: 'E',
          template: '<div></div>',
          scope: {
            data: '=',
            options: '=options'
          },
          link: function(scope, element) {
            Highcharts.chart(element[0], {
                colors: ["#F99D1C", "#F99D1C", "#F99D1C", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
                        "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
                    chart: {

                      backgroundColor: 'transparent'
                    },
                    title : {
                      text : ''
                    },
                    xAxis: {
                        type: 'datetime',
                        categories: scope.data.time,
                        labels: {
                          style: {
                            color: '#E0E0E3'
                          }
                        },

                        title: {
                          text: scope.data.title,
                          style: {
                            color: '#A0A0A3'
                          }
                        }
                    },

                    yAxis: {
                        gridLineWidth:0,
                        labels: {
                          style: {
                           color: '#E0E0E3'
                          }
                        },
                        title: {
                            text: scope.data.ytitle
                        }
                    },

                    tooltip: {
                        crosshairs: true,
                        shared: true,
                        valueSuffix: 'm'
                    },

                    legend: {
                      style: {
                        color: 'white'
                      },
                      enabled : false
                    },

                    series: [{
                        name: scope.data.title,
                        title: {
                          style: {
                            color:'#333333'
                          }
                        },
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
