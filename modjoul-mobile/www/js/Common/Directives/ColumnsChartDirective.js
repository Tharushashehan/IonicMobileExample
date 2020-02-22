/* global angular */
/* global Highcharts */
(function () {
    'use strict';

    angular.module('modjoul-mobile.directives')

        .directive('columnsChart', ['$window', '$filter', function ($window, $filter) {
            return {
                restrict: 'E',
                template: '<div></div>',
                scope: {
                    data: '=',
                    options: '=options'
                },
                link: function (scope, element) {

                    scope.$watch("data",function(newValue,oldValue) {
                        scope.data = newValue;
                        drawChart();
                    });

                    scope.$watch("options",function(newValue,oldValue) {
                        scope.options = newValue
                    });


                    function drawChart(){

                        var property = scope.options.property;
                        var chart = {
                            type: 'column',
                            width: $window.innerWidth - 50,
                            height: 300
                        };
                        var yAxis = {
                            min: 0,
                            gridLineColor: 'transparent'
                        };
                        var xAxis = {
                            categories: scope.data.data,
                            labels: {
                                formatter: function () {
                                    return this.value;
                                }
                            }
                        };
                        if (property === "dark") {
                            chart.backgroundColor = 'transparent';
                            yAxis.labels = {
                                style: {
                                    color: '#ffffff'
                                }
                            };
                            yAxis.title = {
                                text: scope.options.metric,
                                style: {
                                    color: '#ffffff'
                                }
                            };
                            xAxis.labels = {
                                style: {
                                    color: '#ffffff'
                                }
                            };
                        }
                        else if (property === "popup2") {
                            yAxis.labels = {
                                style: {
                                    color: '#808080'
                                }
                            };
                            yAxis.title = {
                                text: scope.options.metric,
                                style: {
                                    color: '#808080'
                                }
                            };
                            xAxis.labels = {
                                style: {
                                    color: '#808080'
                                }
                            };

                            if (scope.options.min) {
                                yAxis.min = scope.options.min
                            }

                            if (scope.options.lines) {
                                yAxis.plotLines = scope.options.lines
                            }
                        }
                        else {
                            yAxis.labels = {
                                style: {
                                    color: '#808080'
                                }
                            };
                            yAxis.title = {
                                text: scope.options.metric,
                                style: {
                                    color: '#808080'
                                }
                            };
                            xAxis.labels = {
                                style: {
                                    color: '#808080'
                                }
                            };
                        }

                        Highcharts.chart(element[0], {
                            colors: ["#F99D1C"],
                            chart: chart,
                            title: {
                                text: scope.options.title ? scope.options.title : "",
                                style: {
                                    color: '#FFFFFF'
                                }
                            },
                            legend: {
                                enabled: false
                            },
                            xAxis: xAxis,
                            yAxis: yAxis,
                            tooltip: {
                                //headerFormat: '<b> ' + scope.options.format + '</b><br/>',
                                pointFormatter: function () {
                                    if(scope.options.units == 'minutes'){
                                        var duration = $filter('timeFormatFilter')(this.y, scope.options.units).split(":");
                                        var hourUnit = duration[0] == 1 ? "hr" : "hrs";
                                        var minutesUnit = duration[1] == 1 ? "min" : "mins";
                                        var secondsUnit = duration[2] == 1 ? "sec" : "secs";

                                        return duration[0] == 0 ? duration[1] + minutesUnit + " " + duration[2] + secondsUnit : duration[0] + hourUnit + " " + duration[1] + minutesUnit;
                                    }
                                    else{
                                        var unit = scope.options.units;
                                        if(unit && unit != ""){
                                            return this.y + " (" + unit + ")";
                                        }
                                        else {
                                            return this.y;
                                        }

                                    }

                                }
                            },
                            plotOptions: {
                                area: {
                                    fillOpacity: 0.5
                                },
                                column: {
                                    maxPointWidth: 60
                                }
                            },
                            credits: {
                                enabled: false
                            },
                            series: [{
                                name: scope.options.seriesName,
                                data: scope.data.values,
                                borderWidth: 0

                            }]
                        });
                    }


                }
            };

        }]);

})();
