/* global angular */
/* global Highcharts */
(function() {
    'use strict';

    angular.module('modjoul-mobile.directives')

      .directive('continuumChart', function($window, moment) {
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

              colors: [scope.options.color, "#90ee7e", "#f39c12", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
                                      "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
                                  chart: {
                                      type: 'area',
                                      spacingBottom: 30,
                                      backgroundColor: 'transparent'
                                  },
                                  title: {
                                      text: ''
                                  },
                                  legend: {
                                      enabled: false
                                  },
                                  xAxis: {
                                      type: 'datetime',
                                      endOnTick: true,
                                      startOnTick: true,
                                      showLastLabel: true,
                                      labels: {
                                      style: {
                                                          color: '#E0E0E3'
                                                        },
                                          formatter: function() {
                                              return Highcharts.dateFormat('%H:%M', moment.unix(this.value));
                                          }
                                      }
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
                                  tooltip: {
                                      headerFormat: scope.options.tooltipHeader,
                                      pointFormatter: function() {
                                          return Highcharts.dateFormat('%H:%M', moment.unix(this.x));
                                      }
                                  },
                                  plotOptions: {
                                      area: {
                                          fillOpacity: 0.5
                                      }
                                  },
                                  credits: {
                                      enabled: false
                                  },
                                  series: [{
                                      name: 'Work Time',
                                      data: scope.data
                                          //[[1474788992,null], [1474965818,null], [1474969418,1],[1474973018, 1],[1474976618, null],[1474983818,1],[1474987418, 1], [1474991018, 1]]
                                  }]
            });
          }
        };


      });

})();
