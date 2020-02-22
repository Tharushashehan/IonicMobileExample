/* global angular */
/* global console */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

(function () {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('SupervisorEmployeeSelectionController', ['$scope', '$state', '$localStorage', '$rootScope', 'SupervisorEmployeeService',
            function ($scope, $state, $localStorage, $rootScope, SupervisorEmployeeService) {

                $scope.$on('empSelected', function () {
                    doRefresh();
                });

                function doRefresh() {
                    var allEmployee = {
                        userId: 'all',
                        firstName: 'All',
                        lastName: 'Employees',
                        job: ''
                    };

                    var orgId = $localStorage.orgId;
                    var supervisorId = $localStorage.userId;
                    SupervisorEmployeeService.GetEmployeesForSupervisor(orgId, supervisorId)
                        .then(function (result) {
                            console.log(result);
                            $scope.employees = result.data;

                            if(!$localStorage.selectedEmployee){
                                $scope.selectedEmployee = $scope.employees[0];
                                $localStorage.selectedEmployee = $scope.employees[0];
                                $rootScope.$broadcast('empSelected', true);
                            }

                            // $scope.employees.unshift(allEmployee);


                        }, function (error) {
                            console.log(error);
                            // $scope.employees = [(allEmployee)];
                            $scope.employees = [];
                        });

                    if($localStorage.selectedEmployee){
                        $scope.selectedEmployee = $localStorage.selectedEmployee;
                    }

                }

                doRefresh();

                $scope.isStatusAvailable = function(employee){
                    var match = $scope.employeeList.indexOf(employee.userId);
                    if(match !== -1){
                        return $scope.beltStatus[match];
                    }
                    else{
                        return false;
                    }

                };

                $scope.selectEmployee = function (emp) {
                    $localStorage.selectedEmployee = emp;
                    $scope.selectedEmployee = emp;
                    console.log('Employee tapped');
                    $rootScope.$broadcast('empSelected', true);
                };


                $scope.searchQuery = {};

                var match = function (item, val) {
                    var regex = new RegExp(val, 'i');
                    return item.firstName.toString().search(regex) === 0 ||
                        item.lastName.toString().search(regex) === 0 || item.userId.toString().search(regex) === 0;
                };

                $scope.filterEmployee = function (emp) {

                    if (!$scope.searchQuery || !$scope.searchQuery.first) {
                        return true;
                    }

                    var matched = true;
                    var q = $scope.searchQuery.first;

                    q.split(' ').forEach(function (token) {
                        matched = matched && match(emp, token);
                    });
                    return matched;
                };

            }]);
})();
