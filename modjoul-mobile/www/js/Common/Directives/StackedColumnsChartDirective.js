/* global angular */
/* global Highcharts */
(function () {
    'use strict';

    angular.module('modjoul-mobile.directives')

        .directive('stackedColumnsChart', function ($window, STRINGS) {
            return {
                restrict: 'E',
                template: '<div></div>',
                scope: {
                    data: '=',
                    options: '=options'
                },
                link: function (scope, element) {

                    //Refresh when "data" changes
                    scope.$watch("data",function(newValue,oldValue) {
                        drawChart(element[0],scope.data,scope.options);
                    });

                }

            };

            function drawChart(element, data, options){
                var labelColor = "#ffffff";

                Highcharts.chart(element, {
                    colors: [STRINGS.COLORS.MODJOUL_ORANGE, STRINGS.COLORS.MODJOUL_BLUE,
                        STRINGS.COLORS.MODJOUL_GREEN, STRINGS.COLORS.MODJOUL_RED, STRINGS.COLORS.MODJOUL_BROWN, STRINGS.COLORS.MODJOUL_PINK, STRINGS.COLORS.MODJOUL_YELLOW],
                    chart: {
                        type: 'column',
                        width: $window.innerWidth -10,
                        height:400,
                        backgroundColor : 'transparent'
                    },
                    title: {
                        text: ''
                    },
                    legend: {
                        enabled: true,
                        align: 'right',
                        verticalAlign: 'bottom',
                        floating: false,
                        itemStyle: {
                            color: '#A0A0A0'
                        },
                        itemHoverStyle: {
                            color: '#FFF'
                        },
                        itemHiddenStyle: {
                            color: '#444'
                        }
                    },
                    xAxis: {
                        categories: data.timestamps,

                        labels: {
                            style:{
                                color: labelColor
                            },
                            formatter: function () {
                                return this.value;
                            }
                        }
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: options.metric? options.metric + " (" + options.units + ")" :"Count",
                            style:{
                                color: labelColor
                            }
                        },
                        gridLineColor: 'transparent',
                        labels: {
                            style:{
                                color: labelColor
                            }
                        },
                        stackLabels: {
                            enabled: true,
                            style: {
                                color:labelColor
                            }
                        }
                    },
                    tooltip: {
                        pointFormatter: function () {
                            var unit = options.units;
                            return this.y + " " + unit;
                        }
                    },
                    plotOptions: {
                        area: {
                            fillOpacity: 0.5
                        },
                        column: {
                            maxPointWidth: 50,
                            stacking: 'normal',
                            dataLabels: {
                                enabled: true
                            }
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    series: data.values
                });
            }

        });

})();
