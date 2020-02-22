/* global angular */
/* global console */
/* global moment */
/* global window */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
/* jshint shadow:true */

(function () {
    'use strict';

    angular.module('modjoul-mobile.controllers')

        .controller('UserController', ['$scope', '$localStorage', '$timeout', 'UserManagementService',
            '$ionicLoading', '$ionicModal', '$cordovaDialogs', 'OrgManagementService', 'STRINGS', 'MESSAGES',
            'SupervisorEmployeeService', '$ionicPopup', '$cordovaDatePicker', '$ionicListDelegate', 'EmployeeManagementService',
            'WiFiHotspotService', 'UserDeviceManagementService', '$ionicScrollDelegate',
            function ($scope, $localStorage, $timeout, UserManagementService, $ionicLoading, $ionicModal, $cordovaDialogs,
                      OrgManagementService, STRINGS, MESSAGES, SupervisorEmployeeService, $ionicPopup, $cordovaDatePicker,
                      $ionicListDelegate, EmployeeManagementService, WiFiHotspotService, UserDeviceManagementService,
                      $ionicScrollDelegate) {

                $scope.ssidTimeoutValue = 10000;

                $scope.timeoutValue = 20000;


                $scope.isSupervisor = true;

                $scope.factoryResetButtonText = "Factory Reset";
                $scope.infoText = "factory reset";

                $scope.$on("$ionicView.beforeEnter", function () {
                    $scope.$emit('navbarHideEvent', true);
                });

                $scope.strings = STRINGS;
                var orgId = $localStorage.orgId;
                var orgName = $localStorage.profile.orgName;
                var limit = 50;
                var userId = $localStorage.userId;
                var userName = $localStorage.profile.firstName + " " + $localStorage.profile.lastName;

                $scope.supervisorList = [];
                $scope.supervisorPageNumber = 1;
                $scope.moreDataCanBeLoaded = true;
                $scope.selectedRole = "";
                $scope.selectedLocation = "";
                $scope.selectedWorkType = "";
                $scope.listCanSwipe = true;
                $scope.employeeData = {};
                $scope.selectedOption = 'name';

                $scope.doRefresh = function () {

                    $ionicLoading.show();

                    // OrgManagementService.getSupervisorsForOrganization(orgId, userId)
                    //     .then(function (result) {
                    //         console.log(result);
                    //         $ionicLoading.hide();
                    //         $scope.users = result.data;
                    //         $scope.$broadcast('scroll.refreshComplete');
                    //     }, function (error) {
                    //         $ionicLoading.hide();
                    //         console.log(error);
                    //     });

                    SupervisorEmployeeService.GetEmployeesForSupervisor(orgId, userId)
                        .then(function (result) {
                            console.log(result);
                            $ionicLoading.hide();
                            $scope.users = result.data;
                            $scope.$broadcast('scroll.refreshComplete');
                        }, function (error) {
                            $ionicLoading.hide();
                            console.log(error);
                        });


                };

                $scope.doRefresh();

                $scope.optionSelection = function(option){
                    $scope.selectedOption = option;
                };

                $scope.changeShiftClicked = function (user) {
                    showChangePopup(user);
                };

                function showChangePopup(user) {
                    $scope.selectedUser = user;
                    $scope.startTime = $scope.selectedUser.shift.startTime ? $scope.selectedUser.shift.startTime : $scope.selectedUser.shift.shiftStart;
                    $scope.endTime = $scope.selectedUser.shift.endTime ? $scope.selectedUser.shift.endTime : $scope.selectedUser.shift.shiftEnd;


                    var titleString = "<div class='shiftTime-Title'>Change shift time for <br>" + user.firstName + " " +
                        user.lastName + "</div>";

                    $ionicPopup.show({
                        templateUrl: "templates/shifttime-popup.html",
                        scope: $scope,
                        title: titleString,
                        cssClass: 'shiftTime-popup',
                        buttons: [
                            {
                                text: '<b>Cancel</b>',
                                type: 'button-positive-orange'
                            },
                            {
                                text: '<b>Save</b>',
                                type: 'button-positive-orange',
                                onTap: function () {
                                    console.log($scope.selectedUser);

                                    var startTime = moment($scope.startTime, "HH:mm");
                                    var endTime = moment($scope.endTime, "HH:mm");

                                    var duration = moment.duration(endTime.diff(startTime));
                                    var hours = duration.hours();
                                    var minutes = moment.duration((duration.asHours() - hours),'hours').asMinutes().toFixed(0);

                                    var hoursText = "";
                                    var minutesText = "";

                                    if(hours === 1){
                                        hoursText = "hour";
                                    }
                                    else{
                                        hoursText = "hours";
                                    }

                                    if(minutes === 1){
                                        minutesText = "minute";
                                    }
                                    else{
                                        minutesText = "minutes";
                                    }

                                    $cordovaDialogs.confirm('Start time: ' + $scope.startTime +'. End time: ' +
                                        $scope.endTime + '. Difference: ' + hours + " " + hoursText + " and " + minutes + " " + minutesText + ".","Are you sure?", ['Ok', 'Cancel'])
                                        .then(function (buttonIndex) {

                                            if (buttonIndex === 1) {

                                                updateShiftTime(orgId, $scope.selectedUser.userId, $scope.startTime, $scope.endTime);
                                            }
                                        });

                                }
                            }
                        ]
                    });
                }

                function updateShiftTime(orgId, userId, startTime, endTime) {
                    var params = {
                        'startTime': startTime,
                        'endTime': endTime
                    };

                    $ionicLoading.show();

                    SupervisorEmployeeService.setUserShift(orgId, userId, params)
                        .then(function (result) {
                            if (result.status === 200) {
                                $scope.doRefresh();
                            }

                            $ionicLoading.hide();
                        }, function () {
                            $ionicLoading.hide();
                        });
                }

                $scope.shiftTimeClicked = function (type) {
                    var date;
                    var tsOffset = new Date().toString().match(/([-\+][0-9]+)\s/)[1];
                    if (type === 'startTime') {
                        var dateStr = "2017-01-01T" + $scope.startTime + ":00" + tsOffset;
                        date = moment(dateStr, "YYYY-MM-DDTHH:mm:ssZ").toDate();

                    }
                    else {
                        var dateStr = "2017-01-01T" + $scope.endTime + ":00" + tsOffset;
                        date = moment(dateStr, "YYYY-MM-DDTHH:mm:ssZ").toDate();

                    }

                    var options = {
                        date: date,
                        mode: 'time',
                        allowOldDates: true,
                        allowFutureDates: true,
                        doneButtonLabel: 'Done',
                        doneButtonColor: '#000000',
                        cancelButtonLabel: 'Cancel',
                        cancelButtonColor: '#000000'
                    };

                    $cordovaDatePicker.show(options).then(function (date) {
                        if(date){
                            if (type === 'startTime') {
                                $scope.startTime = moment(date).format("HH:mm");
                            }
                            else {
                                $scope.endTime = moment(date).format("HH:mm");
                            }
                        }

                    });
                };


                // var onDateSelected = function (date) {
                //   console.log(new Date(parseInt(date, 10)));
                // };

                $scope.getOrganizationInfo = function () {

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

                $scope.getOrganizationInfo();


                $scope.openAddUser = function () {
                    console.log("add user");
                    $ionicModal.fromTemplateUrl('templates/add-user-form.html', {
                        scope: $scope,
                        animation: 'slide-in-up'
                    }).then(function (modal) {
                        $scope.modal = modal;
                        $scope.modal.show();
                    });


                };

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

                $scope.getSupervisors();

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

                $ionicModal.fromTemplateUrl('templates/supervisor_list.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    $scope.supervisorModal = modal;
                });

                $scope.changeSupervisor = function (user) {
                    $scope.selectedEmployee = user;
                    $scope.selectedSupervisor = $localStorage.profile;
                    $scope.supervisorModal.show();

                };

                $scope.getMoreSupervisors = function () {
                    $scope.supervisorPageNumber = $scope.supervisorPageNumber + 1;
                    $scope.getSupervisors();
                };

                $scope.addUser = function () {

                    var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    if (!$scope.employeeData.email || $scope.employeeData.email === "" ||
                        !$scope.employeeData.firstName || $scope.employeeData.firstName === "" || !$scope.employeeData.lastName ||
                        $scope.employeeData.lastName === "" || !$scope.employeeData.job || $scope.employeeData.job === "" ||
                        !$scope.employeeData.employeeId || $scope.employeeData.employeeId === "") {
                        $cordovaDialogs.alert('Fields empty', '', 'Ok')
                            .then(function () {
                                console.log("Fields empty");
                            });
                    }
                    else if (!pattern.test($scope.employeeData.email)) {
                        $cordovaDialogs.alert('Invalid email address', '', 'Ok')
                            .then(function () {
                                console.log("Invalid email address");
                            });
                    }
                    else if (!$scope.employeeData.location || $scope.employeeData.location === "") {
                        $cordovaDialogs.alert('Select a location from the list', '', 'Ok')
                            .then(function () {
                                console.log("Select a location from the list");
                            });
                    }
                    else {

                        $ionicLoading.show();

                        UserManagementService.createUser({
                            firstName: $scope.employeeData.firstName,
                            lastName: $scope.employeeData.lastName,
                            email: $scope.employeeData.email,
                            job: $scope.employeeData.job,
                            role: "employee",
                            orgId: orgId,
                            employeeId: $scope.employeeData.employeeId,
                            orgName: orgName,
                            supervisorId: userId,
                            supervisorName: userName,
                            locationId: $scope.employeeData.location,
                            workType: $scope.employeeData.workType
                        })
                            .then(function (result) {

                                $ionicLoading.hide();
                                console.log(result);
                                if (result.status === 201) {
                                    $scope.clearFields();

                                    $cordovaDialogs.alert(MESSAGES.USER_CREATED_MESSAGE, '', 'Ok')
                                        .then(function () {
                                            console.log(MESSAGES.USER_CREATED_MESSAGE);
                                        });

                                    $scope.modal.remove();
                                    $scope.doRefresh();
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

                $scope.getLocations = function () {
                    OrgManagementService.getLocations(orgId, false)
                        .then(function (result) {
                            console.log(result);
                            $scope.locations = result.data;
                            var locationList = [];
                            for (var i = 0; i < result.data.length; i++) {

                                locationList.push({
                                    locationId: result.data[i].locationId,
                                    locationName: result.data[i].locationName
                                });
                            }
                            $scope.locationNameIdMapping = locationList;
                            console.log($scope.locationNameIdMapping);
                        }, function (error) {
                            console.log(error);
                        });
                };

                $scope.getLocations();

                $scope.vibrateBelt = function(employee) {
                    $ionicLoading.show();
                    SupervisorEmployeeService.vibrateBelt(orgId, userId, employee.userId)
                        .then(function(result){
                            $ionicLoading.hide();
                            showToast(MESSAGES.DEVICE_VIBRATE_SUCCESS);

                        }, function(error) {
                            $ionicLoading.hide();
                            $cordovaDialogs.alert(MESSAGES.NO_DEVICE_ASSIGNED, 'Error', 'Ok');

                        });
                };


                $scope.clearFields = function () {
                    $scope.userEmailAddress = "";
                    $scope.userFirstName = "";
                    $scope.userLastName = "";
                    $scope.userJob = "";
                    $scope.selectedRole = "";
                    $scope.empID = "";
                    $scope.selectedLocation = "";
                    $scope.selectedWorkType = "";
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

                $scope.showDeleteConfirmation = function (employee) {
                    $cordovaDialogs.confirm('Are you sure you want to delete this user?', ['Ok', 'Cancel'])
                        .then(function (buttonIndex) {

                            //var btnIndex = buttonIndex;

                            if (buttonIndex === 1) {
                                deleteEmployee(employee);
                            }
                            else {
                                console.log('You are not sure');
                            }

                            $ionicListDelegate.closeOptionButtons();
                        });
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

                var deleteEmployee = function (employee) {
                    $scope.employee = employee;
                    var employeeId = $scope.employee.userId;

                    $ionicLoading.show();

                    UserManagementService.deleteUser(orgId, employeeId)
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

                $scope.getAssignedDevice = function(userId){
                    $scope.showLoading = true;
                    UserDeviceManagementService.getAssignedDevice(orgId,userId)
                        .then(function(result) {
                            $ionicLoading.hide();

                            $scope.deviceInfo = result.data;

                        }, function(error) {
                            $ionicLoading.hide();
                            $scope.$broadcast('scroll.refreshComplete');
                            console.log(error);
                        });
                };

                $scope.setupWiFiWizard = function () {

                    $scope.wifiPort = {securityType: "WPA2"};

                    $ionicModal.fromTemplateUrl('templates/config-wifi-modal.html', {
                        scope: $scope
                    }).then(function (modal) {
                        $scope.modal = modal;

                        $scope.employeeSelection = true;
                        $scope.switchOnBelt = false;
                        $scope.connectBelt = false;
                        $scope.beltConfigOptions = false;
                        $scope.wifiConfigDetails = false;
                        $scope.notificationScreen = false;
                        $scope.modal.show();

                        $ionicLoading.show();


                        SupervisorEmployeeService.GetEmployeesForSupervisor(orgId, userId)
                            .then(function (result) {
                                $ionicLoading.hide();
                                $scope.employees = result.data;

                            }, function (error) {
                                console.log(error);
                                $ionicLoading.hide();

                            });
                    });

                };

                $scope.wizardEmployeeSelection = function(){
                    $scope.employeeSelection = true;
                    $scope.switchOnBelt = false;
                    $scope.connectBelt = false;
                    $scope.beltConfigOptions = false;
                    $scope.wifiConfigDetails = false;
                    $scope.notificationScreen = false;
                };

                $scope.wizardFirstScreen = function(){
                    $scope.employeeSelection = false;
                    $scope.switchOnBelt = true;
                    $scope.connectBelt = false;
                    $scope.beltConfigOptions = false;
                    $scope.wifiConfigDetails = false;
                    $scope.notificationScreen = false;
                    $ionicScrollDelegate.scrollTop();
                };

                $scope.wizardSecondScreen = function(){
                    $scope.employeeSelection = false;
                    $scope.switchOnBelt = false;
                    $scope.connectBelt = true;
                    $scope.beltConfigOptions = false;
                    $scope.wifiConfigDetails = false;
                    $scope.notificationScreen = false;
                };

                $scope.wizardThirdScreen = function(){
                    $scope.wifiPort = {securityType: "WPA2"};
                    $scope.employeeSelection = false;
                    $scope.switchOnBelt = false;
                    $scope.connectBelt = false;
                    $scope.beltConfigOptions = true;
                    $scope.wifiConfigDetails = false;
                    $scope.notificationScreen = false;
                };


                $scope.selectEmployee = function(employee){
                    $scope.getAssignedDevice(employee.userId);
                    $scope.wizardFirstScreen();
                };


                $scope.configureWifiSettings = function () {

                    $scope.employeeSelection = false;
                    $scope.switchOnBelt = false;
                    $scope.connectBelt = false;
                    $scope.beltConfigOptions = false;
                    $scope.wifiConfigDetails = true;
                    $scope.notificationScreen = false;

                    $scope.isBeltAvailable = false;

                    $ionicLoading.show();

                    $scope.shouldCallTimeout = true;
                    $timeout(SSIDTimeout, $scope.ssidTimeoutValue);

                    WiFiHotspotService.getSSIDs().then(function (result) {

                        $scope.shouldCallTimeout = false;
                        $ionicLoading.hide();
                        if (result.status === 200) {
                            $scope.isBeltAvailable = true;
                            $scope.ssids = result.data.split(",");

                            console.log($scope.ssids);

                        }
                        else {
                            $scope.isBeltAvailable = false;
                        }

                    }, function () {
                        onSSIDError();
                    });
                };

                $scope.factoryReset = function(){

                    $scope.shouldCallTimeout = true;
                    $timeout(SSIDTimeout, $scope.ssidTimeoutValue);

                    WiFiHotspotService.factoryResetSupervisor().then(function (result) {

                        $scope.shouldCallTimeout = false;
                        $ionicLoading.hide();
                        if (result.status === 200) {
                            $scope.modal.remove();
                            showToast("Factory Reset issued");
                        }

                    }, function () {
                        showToast("Failed to issue Factory Reset");
                        onSSIDError();
                    });

                };

                $scope.shouldCallTimeout = false;

                $scope.configureWifi = function (wifiDetails) {


                    if (!wifiDetails.ssid || wifiDetails.ssid === "") {
                        $cordovaDialogs.alert(MESSAGES.WIFI.SSID_ERROR, 'Error', 'Ok')
                            .then(function () {
                                console.log(MESSAGES.WIFI.SSID_ERROR);
                            });
                    }
                    else if (!wifiDetails.password || wifiDetails.password === "") {
                        $cordovaDialogs.alert(MESSAGES.WIFI.PASSWORD_ERROR, 'Error', 'Ok')
                            .then(function () {
                                console.log(MESSAGES.WIFI.PASSWORD_ERROR);
                            });
                    }
                    else if (!wifiDetails.securityType || wifiDetails.securityType === "") {
                        $cordovaDialogs.alert(MESSAGES.WIFI.SECURITY_TYPE_ERROR, 'Error', 'Ok')
                            .then(function () {
                                console.log(MESSAGES.WIFI.SECURITY_TYPE_ERROR);
                            });
                    }
                    else {
                        $ionicLoading.show();

                        $scope.shouldCallTimeout = true;
                        $timeout(callAtTimeout, $scope.timeoutValue);
                        WiFiHotspotService.postWifiDetails(wifiDetails.ssid, wifiDetails.password, wifiDetails.securityType).then(function (result) {

                            console.log(result);
                            $scope.shouldCallTimeout = false;
                            $ionicLoading.hide();
                            if (result.status === 200) {
                                $scope.switchOnBelt = false;
                                $scope.connectBelt = false;
                                $scope.beltConfigOptions = false;
                                $scope.wifiConfigDetails = false;
                                $scope.notificationScreen = true;

                                // $cordovaDialogs.alert(MESSAGES.WIFI.SERVICE_SUCCESS, 'Success', 'Ok')
                                //     .then(function () {
                                //         console.log(MESSAGES.WIFI.SERVICE_SUCCESS);
                                //     });

                                $scope.wifiPort = {securityType: "WPA2"};

                            }
                            else {
                                console.log("error");
                                $cordovaDialogs.alert(MESSAGES.WIFI.SERVICE_FAILURE, 'Error', 'Ok')
                                    .then(function () {
                                        console.log(MESSAGES.WIFI.SERVICE_FAILURE);
                                    });
                            }

                        }, function (error) {
                            onError();
                        });

                    }
                };

                function showToast(data) {
                    window.plugins.toast.showWithOptions(
                        {
                            message: data,
                            duration: 7000, // ms
                            position: 'top',
                            addPixelsY: -25,
                            styling: {
                                opacity: 0.8,
                                backgroundColor: '#000000',
                                textColor: '#FFFFFF',
                                textSize: 15,
                                cornerRadius: 5.0, // minimum is 0 (square). iOS default 20, Android default 100
                                horizontalPadding: 90, // iOS default 16, Android default 50
                                verticalPadding: 18 // iOS default 12, Android default 30
                            }

                        },
                        function (result) {

                        }
                    );
                }

                function onError() {
                    if ($scope.shouldCallTimeout) {
                        $scope.shouldCallTimeout = false;
                        $ionicLoading.hide();
                        $cordovaDialogs.alert(MESSAGES.WIFI.SERVICE_FAILURE, 'Error', 'Ok')
                            .then(function () {
                                console.log(MESSAGES.WIFI.SERVICE_FAILURE);
                            });
                    }
                }

                function callAtTimeout() {
                    if ($scope.shouldCallTimeout) {
                        onError();
                    }
                }

                function onSSIDError() {
                    if ($scope.shouldCallTimeout) {
                        $scope.shouldCallTimeout = false;
                        $ionicLoading.hide();
                    }
                }

                function SSIDTimeout() {
                    if ($scope.shouldCallTimeout) {
                        onSSIDError();
                    }
                }

                function showToast(data) {
                    window.plugins.toast.showWithOptions(
                        {
                            message: data,
                            duration: 7000, // ms
                            position: 'top',
                            addPixelsY: -25,
                            styling: {
                                opacity: 0.8,
                                backgroundColor: '#000000',
                                textColor: '#FFFFFF',
                                textSize: 15,
                                cornerRadius: 5.0, // minimum is 0 (square). iOS default 20, Android default 100
                                horizontalPadding: 90, // iOS default 16, Android default 50
                                verticalPadding: 18 // iOS default 12, Android default 30
                            }

                        },
                        function () {

                        }
                    );
                }

            }
        ]);
})();
