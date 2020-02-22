/* global angular */
/* global console */
/* global window */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
(function () {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('LocationController', ['$scope', '$state', 'OrgManagementService', '$localStorage', '$ionicLoading',
            '$ionicModal', '$cordovaDialogs', 'MESSAGES', '$ionicListDelegate',
            function ($scope, $state, OrgManagementService, $localStorage, $ionicLoading, $ionicModal, $cordovaDialogs,
                      MESSAGES, $ionicListDelegate) {

                var orgId = $localStorage.orgId;
                var orgName = $localStorage.profile.orgName;
                $scope.messages = MESSAGES;
                $scope.shouldShowDelete = false;
                $scope.shouldShowReorder = false;
                $scope.listCanSwipe = true;

                $scope.loadLocations = function () {

                    $ionicLoading.show();

                    OrgManagementService.getLocations(orgId)
                        .then(function (result) {
                            $ionicLoading.hide();
                            $scope.$broadcast('scroll.refreshComplete');
                            console.log(result);
                            $scope.locations = result.data;
                        }, function (error) {
                            $ionicLoading.hide();
                            $scope.$broadcast('scroll.refreshComplete');
                            console.log(error);
                        });
                };

//            $scope.clearFields = function () {
//                    $scope.userEmailAddress = "";
//                    $scope.userFirstName = "";
//                    $scope.userLastName = "";
//                    $scope.userJob = "";
//                    $scope.selectedRole = "";
//                    $scope.empID = "";
//                    $scope.selectedLocation = "";
//                    $scope.selectedWorkType = "";
//                };

                $scope.deleteLocations = function (location) {
                    $scope.location = location;
                    var locationId = $scope.location.locationId;
                    var orgId = $scope.location.orgId;
                    console.log($scope.location);
                    OrgManagementService.deleteLocation(locationId, orgId)
                        .then(function () {
                            $ionicLoading.hide();
                            $cordovaDialogs.alert(MESSAGES.LOCATION_DELETED_MESSAGE, '', 'Ok')
                                .then(function () {
                                    console.log(MESSAGES.LOCATION_DELETED_MESSAGE);
                                });
                            $scope.loadLocations();
                        }, function (error) {
                            $ionicLoading.hide();
                            $cordovaDialogs.alert(MESSAGES.LOCATION_DELETED_FAILURE_MESSAGE, '', 'Ok')
                                .then(function () {
                                    console.log(MESSAGES.LOCATION_DELETED_FAILURE_MESSAGE);
                                });
                            console.log(error);
                        });
                };

                $scope.showDeleteConfirmation = function (location) {
                    $cordovaDialogs.confirm('Are you sure you want to delete this location?', ['Ok', 'Cancel'])
                        .then(function (buttonIndex) {

                            //var btnIndex = buttonIndex;

                            if (buttonIndex === 1) {
                                $scope.deleteLocations(location);
                            }
                            else {
                                console.log('You are not sure');
                            }

                            $ionicListDelegate.closeOptionButtons();
                        });
                };

                $scope.openAddLocation = function () {
                    $ionicModal.fromTemplateUrl('templates/add-location-form.html', {
                        scope: $scope,
                        animation: 'slide-in-up'
                    }).then(function (modal) {
                        console.log("add location");
                        $scope.modal = modal;
                        $scope.modal.show();
                    });

                };

                $scope.addlocation = function (location, locationCode, street, city, state, postal, contact) {
                    /*jshint maxcomplexity:30 */
                    console.log(location);
                    if (!location || location === "" || !locationCode || locationCode === "" ||
                        !street || street === "" || !city || city === "" || !state || state === "" ||
                        !postal || postal === "" || !contact || contact === "") {

                        $cordovaDialogs.alert('Fields empty', '', 'Ok')
                            .then(function () {
                                console.log("Fields empty");
                            });

                    } else {
                        $ionicLoading.show();

                        OrgManagementService.createLocation({
                            orgId: orgId,
                            locationName: location,
                            locationCode: locationCode,
                            streetName: street,
                            city: city,
                            state: state,
                            postalCode: postal,
                            contact: contact
                        }).then(function (result) {

                            $ionicLoading.hide();
                            console.log(result);
                            if (result.status === 201) {
//                          $scope.clearFields();

                                showToast(MESSAGES.LOCATION_CREATED_MESSAGE);


                                $scope.modal.remove();
                                $scope.loadLocations();
                            }
                        }, function (error) {
                            showToast(MESSAGES.LOCATION_CREATED_FAILURE_MESSAGE);
                            console.log(error);
                        });
                    }
                };

                $scope.loadLocations();

                $scope.navSafetyWork = function () {
                    $state.go("employee.safety-work");
                };

                $scope.navSafetyDriving = function () {
                    $state.go("employee.safety-driving");
                };

                $scope.searchQuery = {};

                var match = function (item, val) {
                    var regex = new RegExp(val, 'i');
                    return item.locationName.toString().search(regex) === 0 ||
                        item.city.toString().search(regex) === 0 || item.postalCode.toString().search(regex) === 0 ||
                        item.state.toString().search(regex) === 0 || item.streetName.toString().search(regex) === 0;
                };

                $scope.filterLocation = function (emp) {

                    if (!$scope.searchQuery || !$scope.searchQuery.query) {
                        return true;
                    }

                    if(match(emp,$scope.searchQuery.query)){
                        return emp;
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
                        function () {

                        }
                    );
                }


            }]);
})();
