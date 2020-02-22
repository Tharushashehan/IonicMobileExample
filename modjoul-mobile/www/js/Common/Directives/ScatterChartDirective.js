/* global angular */
/* global Highcharts */
(function() {
    'use strict';

    angular.module('modjoul-mobile.directives')

      .directive('scatterChart', function($window, moment) {
        return {
          restrict: 'E',
          template: '<div></div>',
          scope: {
            data: '=',
            options: '=options'
          },
          link: function(scope, element) {

          if(!scope.options.color){
              scope.options.color = "#2b908f";
          }
            Highcharts.chart(element[0], {

              colors: [scope.options.color, "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
                            "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
                                title: {
                                    text: ''
                                },
                                chart : {
                                    type: 'scatter',
                                    zoomType: 'xy',
                                    backgroundColor: 'transparent',
                                    width:340,
                                    height:280
                              },
                                xAxis: {
                                  title: {
                                      text: 'Time'
                                  },
                                  type: 'datetime',
                                  labels: {
                                      formatter: function() {
                                          return Highcharts.dateFormat('%H:%M', moment.unix(this.value));
                                      }
                                  },
                                  endOnTick: true,
                                  startOnTick: true,
                                  showLastLabel: true,
                                  tickInterval : (3600)
                                },
                                yAxis: {
                                  title: {
                                      text: ''
                                  },
                                  labels: {
                                      enabled: false
                                  },
                                  gridLineColor: 'transparent'
                                },
                                plotOptions: {
                                  scatter: {
                                      marker: {
                                          radius: 10,
                                          symbol: 'circle',
                                          states: {
                                              hover: {
                                                  enabled: true,
                                                  lineColor: 'rgb(100,100,100)'
                                              }
                                          }
                                      },
                                      tooltip: {
                                          headerFormat: scope.options.tooltipHeader,
                                          pointFormatter: function() {
                                              return Highcharts.dateFormat('%H:%M', moment.unix(this.x));
                                          }
                                      }
                                  }
                                },
                                legend: {
                                  enabled: false
                                },
                                series: [{
                                  name: '',
                                  data: scope.data
                                }]
            });
          }
        };


      });

})();
