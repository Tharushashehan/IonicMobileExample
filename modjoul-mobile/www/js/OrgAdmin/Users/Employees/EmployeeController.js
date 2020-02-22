/* global angular */
/* global window */
/* global console */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

(function () {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('EmployeeController', ['$scope', '$state', 'EmployeeManagementService', '$localStorage', '$ionicLoading',
            '$ionicModal', 'STRINGS', 'OrgManagementService', '$cordovaDialogs', 'MESSAGES', '$ionicPopup', 'DeviceManagementService',
            'UserDeviceManagementService', '$ionicListDelegate',
            function ($scope, $state, EmployeeManagementService, $localStorage, $ionicLoading, $ionicModal, STRINGS,
                      OrgManagementService, $cordovaDialogs, MESSAGES, $ionicPopup, DeviceManagementService,
                      UserDeviceManagementService, $ionicListDelegate) {

                $scope.strings = STRINGS;
                $scope.messages = MESSAGES;
                var orgId = $localStorage.orgId;
                // var orgName = $localStorage.profile.orgName;
                var limit = 50;
                $scope.empPageNumber = 0;
                $scope.supervisorPageNumber = 0;
                $scope.moreDataCanBeLoaded = true;
                $scope.moreEmployeeDataCanbeLoaded = true;
                $scope.users = [];
                $scope.supervisorList = [];

                $scope.selectedSupervisor = {};


                $scope.modalTitle = "Select Supervisor";

                $scope.listCanSwipe = true;

                $scope.selectedRole = "";
                $scope.selectedLocation = "";
                $scope.selectedWorkType = "";


                var userId = $localStorage.userId;
                var userName = $localStorage.profile.firstName + " " + $localStorage.profile.lastName;


                $scope.getEmployees = function () {
                    console.log($scope.empPageNumber);
                    var pageNumber = $scope.empPageNumber;
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

                $scope.openAssignDevice = function (user) {
                    $scope.employeeId = user.userId;
                    $ionicLoading.show();
                    UserDeviceManagementService.getAssignedDevice(orgId, $scope.employeeId)
                        .then(function (result) {
                            $ionicLoading.hide();
                            console.log(result);
                            $scope.assignedDevices = result.data;
                            if ($scope.assignedDevices !== "") {
                                $ionicPopup.show({
                                    templateUrl: "templates/device-details.html",
                                    title: "Devices",
                                    scope: $scope,
                                    cssClass: 'scorecard-config',
                                    buttons: [
                                        {
                                            text: '<b>Close</b>',
                                            type: 'btn btn-scorecard'
                                        }
                                    ]
                                });
                            } else {
                                $scope.assignDevicePopup = $ionicPopup.show({
                                    templateUrl: "templates/assign_device.html",
                                    title: "Devices",
                                    scope: $scope,
                                    cssClass: 'scorecard-config',
                                    buttons: [
                                        {
                                            text: '<b>Close</b>',
                                            type: 'btn btn-scorecard'
                                        }
                                    ]
                                });
                            }
                            console.log($scope.assignedDevices);
                        }, function (error) {
                            console.log(error);
                        });


//                  $scope.getAvailableDevice(orgId,$scope.employeeId);


                };

                $scope.doRefresh = function () {

                    $scope.empPageNumber = 1;
                    $scope.users = [];
                    $scope.getEmployees();



                };

                $scope.doRefresh();

                $scope.getMoreEmployees = function () {
                    $scope.empPageNumber++;
                    $scope.getEmployees();
                };


                $scope.getMoreSupervisors = function () {
                    $scope.supervisorPageNumber = $scope.supervisorPageNumber + 1;
                    $scope.getSupervisors();
                };

                $scope.promoteEmployee = function (employee) {

                    $cordovaDialogs.confirm('Are you sure you want to promote this employee?', ['Ok', 'Cancel'])
                        .then(function (buttonIndex) {

                            if (buttonIndex === 1) {
                                promoteEmployee(employee);
                            }
                        });
                };

                function promoteEmployee(employee) {

                    $ionicLoading.show();
                    OrgManagementService.promoteEmployee(orgId,employee.userId).then(function (result) {

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


                $scope.selectSupervisor = function (supervisor) {

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

                $scope.changeSupervisor = function (user) {
                    $scope.selectedEmployee = user;
                    $scope.supervisorModal.show();

                };

                function updateEmployee(user, supervisorId) {
                    $ionicLoading.show();
                    EmployeeManagementService.assignSupervisor(orgId, user.userId, supervisorId, userId, userName).then(function (result) {

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



                $scope.getAvailableDevice = function () {
                    DeviceManagementService.getAllDevicesForOrganization({},orgId, STRINGS.DEVICE_STATES.AVAILABLE)
                        .then(function (result) {
                            console.log(result);
                            $scope.availableDevices = result.data;
                            if($scope.availableDevices> 0){
                                $scope.deviceId = $scope.availableDevices[0].deviceId;
                            }
                            console.log($scope.availableDevices);
                        }, function (error) {
                            console.log(error);
                        });
                };

                $scope.assignADevice = function (deviceId) {

                    if (!deviceId || deviceId === "") {
                        $cordovaDialogs.alert('Device Serial Number empty', '', 'Ok')
                            .then(function () {
                                console.log("Fields empty");
                            });
                    }

                    else {

                        $ionicLoading.show();

                        UserDeviceManagementService.assignDevice({
                            deviceId: deviceId
                        }, orgId, $scope.employeeId, STRINGS.DEFAULT_DEVICE_TYPE)
                            .then(function (result) {
                                $ionicLoading.hide();
                                $scope.assignDevicePopup.close();
//                                $cordovaDialogs.alert(MESSAGES.DEVICE_CREATED_MESSAGE, '', 'Ok')
//                                    .then(function () {
//                                        console.log(MESSAGES.DEVICE_CREATED_MESSAGE);
//                                        console.log(result);
//
//                                    });
                            }, function (error) {
                                $ionicLoading.hide();

                                $scope.showLoading = false;
                                $cordovaDialogs.alert(MESSAGES.DEVICE_ASSIGN_FAILURE_MESSAGE, '', 'Ok')
                                    .then(function () {
                                        console.log(MESSAGES.DEVICE_ASSIGN_FAILURE_MESSAGE);
                                    });
                                console.log(error);
                            });
                    }
                };


                // $scope.getSupervisors();

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
                    return name.toString().search(regex) === 0 ||
                        item.role.toString().search(regex) === 0 ||
                        (item.supervisorName && item.supervisorName.toString().search(regex) === 0  );
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
