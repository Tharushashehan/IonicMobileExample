/* global angular */
/* global window */
/* global console */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

(function () {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('SupervisorController', ['$scope', '$state', 'EmployeeManagementService', '$localStorage', '$ionicLoading',
            '$ionicModal', 'STRINGS', 'OrgManagementService', '$cordovaDialogs', 'MESSAGES', '$ionicPopup', 'DeviceManagementService',
            'UserDeviceManagementService', '$ionicListDelegate',
            function ($scope, $state, EmployeeManagementService, $localStorage, $ionicLoading, $ionicModal, STRINGS,
                      OrgManagementService, $cordovaDialogs, MESSAGES, $ionicPopup, DeviceManagementService,
                      UserDeviceManagementService, $ionicListDelegate) {

                $scope.strings = STRINGS;
                $scope.messages = MESSAGES;
                var orgId = $localStorage.orgId;
                var profile = $localStorage.profile;
                var limit = 50;
                $scope.pageNumber = 0;
                $scope.supervisorPageNumber = 0;
                $scope.moreDataCanBeLoaded = true;
                $scope.moreEmployeeDataCanbeLoaded = true;
                $scope.users = [];
                $scope.supervisorList = [];

                $scope.listCanSwipe = true;

                $scope.selectedRole = "";
                $scope.selectedLocation = "";
                $scope.selectedWorkType = "";


                $scope.getMainSupervisors = function () {

                    var pageNumber = $scope.pageNumber;
                    if (pageNumber === 1) {
                        $ionicLoading.show();
                    }

                    OrgManagementService.getSupervisorsForOrganization(orgId, pageNumber, limit)
                        .then(function (result) {
                            console.log(result);
                            $ionicLoading.hide();
                            $scope.users = $scope.users.concat(result.data.users);

                            if (result.data.users && result.data.users.length === 0) {
                                $scope.moreEmployeeDataCanbeLoaded = false;
                            }
                            $scope.$broadcast('scroll.refreshComplete');
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        }, function (error) {
                            $ionicLoading.hide();
                            $scope.$broadcast('scroll.refreshComplete');
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            console.log(error);
                        });
                };

                $scope.doRefresh = function () {

                    $scope.pageNumber = 1;
                    $scope.users = [];
                    $scope.getMainSupervisors();

                };

                $scope.doRefresh();

                $scope.getMoreUsers = function () {
                    $scope.pageNumber = $scope.pageNumber + 1;
                    $scope.getMainSupervisors();
                };

                $scope.getMoreSupervisors = function () {
                    $scope.supervisorPageNumber = $scope.supervisorPageNumber + 1;
                    $scope.getSupervisors();
                };

                $scope.selectSupervisor = function (supervisor) {

                    $cordovaDialogs.confirm('Are you sure you want to demote supervisor?', ['Ok', 'Cancel'])
                        .then(function (buttonIndex) {

                            if (buttonIndex === 1) {
                                console.log($scope.selectedSupervisor);
                                console.log(supervisor);
                                demoteSupervisor($scope.selectedSupervisor, supervisor);
                            }
                        });
                };

                $ionicModal.fromTemplateUrl('templates/supervisor_list.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    $scope.supervisorModal = modal;
                });

                $scope.openOtherSupervisors = function (user) {
                    $scope.selectedSupervisor = user;
                    $scope.supervisorModal.show();

                };

                function demoteSupervisor(supervisor, replacementSupervisor) {
                    $ionicLoading.show();
                    OrgManagementService.demoteSupervisor(orgId,{
                        userId: replacementSupervisor.userId,
                        name: replacementSupervisor.firstName + " " + replacementSupervisor.lastName
                    }, supervisor.userId, profile).then(function (result) {

                        console.log(result);

                        if (result.status === 200) {
                            $scope.supervisorModal.hide();
                            $scope.doRefresh();
                        }
                        $ionicLoading.hide();

                    }, function () {
                        $ionicLoading.hide();
                    });

                }


                $scope.getSupervisors = function () {

                    OrgManagementService.getSupervisorsForOrganization(orgId, $scope.supervisorPageNumber, limit)
                        .then(function (result) {
                            console.log(result.data);
                            $scope.supervisorList = $scope.supervisorList.concat(result.data.users);
                            if (result.data.users && result.data.users.length === 0) {
                                $scope.moreDataCanBeLoaded = false;
                            }
                            $scope.$broadcast('scroll.refreshComplete');
                            $scope.$broadcast('scroll.infiniteScrollComplete');

                        }, function (error) {
                            console.log(error);
                            $scope.$broadcast('scroll.refreshComplete');
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        });

                };

                // $scope.getSupervisors();

                $scope.$on("$ionicView.beforeEnter", function () {
                    $scope.$emit('navbarHideEvent', false);
                });

                var deleteEmployee = function (employee) {
                    $scope.employee = employee;
                    var employeeId = $scope.employee.userId;
                    var orgId = $scope.employee.orgId;

                    OrgManagementService.deleteUser(employeeId, orgId)
                        .then(function () {
                            $ionicLoading.hide();
                            $cordovaDialogs.alert(MESSAGES.EMPLOYEE_DELETED_MESSAGE, '', 'Ok')
                                .then(function () {
                                    console.log(MESSAGES.EMPLOYEE_DELETED_MESSAGE);
                                });
                            $scope.doRefresh();
                        }, function (error) {
                            $ionicLoading.hide();
                            $cordovaDialogs.alert(MESSAGES.EMPLOYEE_DELETED_FAILURE_MESSAGE, '', 'Ok')
                                .then(function () {
                                    console.log(MESSAGES.EMPLOYEE_DELETED_FAILURE_MESSAGE);
                                });
                            console.log(error);
                        });
                };

                $scope.showDeleteConfirmation = function (employee) {
                    $cordovaDialogs.confirm('Are you sure you want to delete this employee?', ['Ok', 'Cancel'])
                        .then(function (buttonIndex) {

                            // var btnIndex = buttonIndex;

                            if (buttonIndex === 1) {
                                deleteEmployee(employee);
                            }
                            else {
                                console.log('You are not sure');
                            }

                            $ionicListDelegate.closeOptionButtons();
                        });
                };

                $scope.searchQuery = {};

                var match = function (item, val) {
                    var regex = new RegExp(val, 'i');
                    var name = item.firstName + " " + item.lastName;
                    return name.toString().search(regex) === 0 || item.role.toString().search(regex) === 0;
                };

                $scope.filterEmployee = function (emp) {

                    if (!$scope.searchQuery || !$scope.searchQuery.query) {
                        return true;
                    }

                    if(match(emp,$scope.searchQuery.query)){
                        return emp;
                    }
                };


            }]);
})();
