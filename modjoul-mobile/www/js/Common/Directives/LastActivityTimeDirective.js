/* global angular */
/* global Highcharts */
(function () {
    'use strict';

    angular.module('modjoul-mobile.directives')

        .directive('lastActivityTime', ['UsersService', '$localStorage', function (UsersService, $localStorage) {
            return {
                restrict: 'E',
                template: '<div align="center" ng-if="lastActivityTime"><a class="last-activity">Last activity reported at {{lastActivityTime | amDateFormat:"MMMM DD YYYY hh:mm:ss a"}} </a></div>',
                scope: {
                    trigger: '=trigger'
                },
                link: function (scope, element) {

                    scope.$watch('trigger', function (newVal) {
                        getLastActivityTime();
                    });

                    function getLastActivityTime() {
                        var orgId = $localStorage.orgId;
                        var userId = "";
                        if ($localStorage.profile.role == "supervisor") {
                            userId = $localStorage.selectedEmployee ? $localStorage.selectedEmployee.userId : null;
                        }
                        else {
                            userId = $localStorage.userId;
                        }

                        if (userId) {
                            UsersService.getLastActivityTime(orgId, userId)
                                .then(function (result) {
                                    if (result.data) {
                                        scope.lastActivityTime = result.data.timestamp;
                                    }
                                }, function () {

                                });
                        }

                    }
                }
            };

        }]);

})();
