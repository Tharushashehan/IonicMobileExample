/* global angular */
/* global window */
/* global console */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

(function () {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('UserAdditionController', ['$scope', '$state', 'EmployeeManagementService', '$localStorage', '$ionicLoading',
            '$ionicModal', 'STRINGS', 'OrgManagementService', '$cordovaDialogs', 'MESSAGES', '$ionicPopup', 'DeviceManagementService',
            'UserDeviceManagementService', '$ionicListDelegate',
            function ($scope, $state, EmployeeManagementService, $localStorage, $ionicLoading, $ionicModal, STRINGS,
                      OrgManagementService, $cordovaDialogs, MESSAGES, $ionicPopup, DeviceManagementService,
                      UserDeviceManagementService, $ionicListDelegate) {

                $scope.strings = STRINGS;
                $scope.messages = MESSAGES;
                var orgId = $localStorage.orgId;
                var orgName = $localStorage.profile.orgName;
                var limit = 50;
                $scope.pageNumber = 0;
                $scope.supervisorPageNumber = 0;
                $scope.moreDataCanBeLoaded = true;
                $scope.moreEmployeeDataCanbeLoaded = true;
                $scope.users = [];
                $scope.supervisorList = [];
                $scope.modalTitle = "Select Supervisor";
                $scope.selectedSupervisor = null;
                $scope.employeeData = {};
                $scope.selectedOption = 'name';

                $scope.listCanSwipe = true;

                $scope.selectedRole = "";
                $scope.selectedLocation = "";
                $scope.selectedWorkType = "";


                var userId = $localStorage.userId;
                var userName = $localStorage.profile.firstName + " " + $localStorage.profile.lastName;

                $scope.getOraganizationInfo = function () {
                    OrgManagementService.getExistingOrgDetails(orgId)
                        .then(function (result) {
                            console.log(result);
                            $ionicLoading.hide();
                            $scope.jobFunctions = result.data.orgJobFunctions;

                        }, function (error) {
                            $ionicLoading.hide();
                            console.log(error);
                        });
                };

                $scope.getOraganizationInfo();

                $scope.getEmployees = function () {
                    var pageNumber = $scope.pageNumber;
                    if (pageNumber === 1) {
                        $ionicLoading.show();
                    }

                    EmployeeManagementService.getEmployees(orgId, pageNumber, limit)
                        .then(function (result) {
                            console.log(result);
                            $ionicLoading.hide();
                            $scope.users = $scope.users.concat(result.data.users);

                            if(result.data.users && result.data.users.length === 0){
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


                $scope.getMoreEmployees = function () {
                    $scope.pageNumber = $scope.pageNumber + 1;
                    $scope.getEmployees();
                };


                $scope.getMoreSupervisors = function () {
                    $scope.supervisorPageNumber = $scope.supervisorPageNumber + 1;
                    $scope.getSupervisors();
                };

                $scope.openAddUser = function () {
                    console.log("add employee");
                    $ionicModal.fromTemplateUrl('templates/add-employee-form.html', {
                        scope: $scope,
                        animation: 'slide-in-up'
                    }).then(function (modal) {
                        $scope.modal = modal;
                        $scope.modal.show();
                    });

                };

                $scope.optionSelection = function(option){
                    $scope.selectedOption = option;
                };

                $scope.changeSupervisorClicked = function (user) {
                    console.log("Change clicked " + user);
                    $scope.selectedEmployee = user;

                    var config = {
                        title: "Select a Supervisor",
                        items: $scope.supervisorsForPicker,
                        selectedValue: user.supervisorId,
                        doneButtonLabel: "Save",
                        cancelButtonLabel: "Cancel"
                    };

                    //updateEmployee($scope.selectedEmployee, 'SID002');

                    window.plugins.listpicker.showPicker(config,
                        function (item) {
                            console.log("You have selected " + item);
                            $scope.selectedEmployee.supervisorId = item;
                            updateEmployee($scope.selectedEmployee, item);
                        },
                        function () {
                            console.log("You have cancelled");
                        }
                    );

                };


                $scope.assignSupervisor = function (supervisor) {

                    $cordovaDialogs.confirm('Are you sure you want to change supervisor?', ['Ok', 'Cancel'])
                        .then(function (buttonIndex) {

                            if (buttonIndex === 1) {
                                updateEmployee($scope.selectedEmployee, supervisor.userId);
                            }
                            else {
                                console.log('You are not sure');
                            }
                        });
                };

                $ionicModal.fromTemplateUrl('templates/supervisor_list_emp.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    $scope.supervisorModal = modal;
                });

                $scope.selectSupervisor = function (supervisor) {

                    $scope.employeeData.supervisorId = supervisor.userId;
                    $scope.employeeData.supervisorName = supervisor.firstName + " " + supervisor.lastName;
                    $scope.supervisorModal.hide();
                };

                function updateEmployee(user, supervisorId) {
                    $ionicLoading.show();
                    EmployeeManagementService.assignSupervisor(user.userId, supervisorId, userId, userName).then(function (result) {

                        if (result.status === 200) {
                            $scope.supervisorModal.hide();
                            $scope.doRefresh();
                        }
                        $ionicLoading.hide();

                    }, function () {
                        $ionicLoading.hide();
                    });

                }


                $scope.addUser = function () {
                    console.log($scope.employeeData);

                    var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    if (!$scope.employeeData.email || $scope.employeeData.email === "" || !$scope.employeeData.firstName || $scope.employeeData.firstName === "" || !$scope.employeeData.lastName || $scope.employeeData.lastName === "") {
                        $cordovaDialogs.alert('Fields empty', '', 'Ok')
                            .then(function () {
                                console.log("Fields empty");
                            });
                    } else if (!pattern.test($scope.employeeData.email)) {
                        $cordovaDialogs.alert('Invalid email address', '', 'Ok')
                            .then(function () {
                                console.log("Invalid email address");
                            });
                    } else if (!$scope.employeeData.role || $scope.employeeData.role === "") {
                        $cordovaDialogs.alert('Select a role from the list', '', 'Ok')
                            .then(function () {
                                console.log("Select a role from the list");
                            });
                    } else if (!$scope.employeeData.location || $scope.employeeData.location === "") {
                        $cordovaDialogs.alert('Select a location from the list', '', 'Ok')
                            .then(function () {
                                console.log("Select a location from the list");
                            });
                    }
                    else if($scope.employeeData.role === "employee" && (!$scope.employeeData.supervisorName || $scope.employeeData.supervisorName === "")){
                        $cordovaDialogs.alert('Select a supervisor from the list', '', 'Ok')
                            .then(function () {
                                console.log("Select a supervisor from the list");
                            });
                    }
                    else if ($scope.employeeData.role === "employee" && (!$scope.employeeData.jobFunction || $scope.employeeData.jobFunction === "")) {
                        $cordovaDialogs.alert('Select a job function from the list', '', 'Ok')
                            .then(function () {
                                console.log("Select a job function from the list");
                            });
                    }
                    else {
                        $ionicLoading.show();

                        EmployeeManagementService.createEmployee({
                            firstName: $scope.employeeData.firstName,
                            lastName: $scope.employeeData.lastName,
                            email: $scope.employeeData.email,
                            role: $scope.employeeData.role,
                            orgId: orgId,
                            employeeId: $scope.employeeData.employeeId,
                            orgName: orgName,
                            supervisorId: $scope.employeeData.supervisorId,
                            supervisorName: $scope.employeeData.supervisorName,
                            locationId: $scope.employeeData.location,
                            jobFunction: $scope.employeeData.jobFunction
                        })
                            .then(function (result) {
                                $ionicLoading.hide();
                                console.log(result);
                                if (result.status === 201) {
                                    $scope.clearFields();

                                    $scope.employeeData = {};
                                    $cordovaDialogs.alert(MESSAGES.USER_CREATED_MESSAGE, '', 'Ok')
                                        .then(function () {
                                            console.log(MESSAGES.USER_CREATED_MESSAGE);
                                        });
                                    $scope.modal.remove();
                                }

                            }, function (error) {
                                $ionicLoading.hide();
                                $cordovaDialogs.alert(MESSAGES.USER_CREATION_FAILURE_MESSAGE, '', 'Ok')
                                    .then(function () {
                                        console.log(MESSAGES.USER_CREATION_FAILURE_MESSAGE);
                                    });

                                console.log(error);
                            });

                    }
                };

                $scope.getSupervisors = function () {

                    OrgManagementService.getSupervisorsForOrganization(orgId, $scope.supervisorPageNumber, limit)
                        .then(function (result) {
                            console.log(result.data);
                            $scope.supervisorList = $scope.supervisorList.concat(result.data.users);
                            if(result.data.users && result.data.users.length === 0){
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

                $scope.getLocations = function () {
                    OrgManagementService.getLocations(orgId, false)
                        .then(function (result) {
                            console.log(result);
                            $scope.locations = result.data;
                            var locationList = [];
                            for (var i = 0; i < result.data.length; i++) {

                                locationList.push({
                                    locationId: result.data[i].locationId,
                                    locationName: result.data[i].locationName,
                                    locationCode: result.data[i].locationCode
                                });
                            }
                            $scope.locationNameIdMapping = locationList;

                        }, function (error) {
                            console.log(error);
                        });
                };


                // $scope.getSupervisors();
                $scope.getLocations();

                $scope.clearFields = function () {
                    $scope.userEmailAddress = "";
                    $scope.userFirstName = "";
                    $scope.userLastName = "";
                    $scope.userJob = "";
                    $scope.selectedRole = "";
                    $scope.empID = "";
                    $scope.selectedLocation = "";
                    $scope.supervisorName = "";
                    $scope.selectedWorkType = "";
                };

                $scope.$on("$ionicView.beforeEnter", function () {
                    $scope.$emit('navbarHideEvent', false);
                });


                $scope.searchQuery = {};



            }]);
})();
