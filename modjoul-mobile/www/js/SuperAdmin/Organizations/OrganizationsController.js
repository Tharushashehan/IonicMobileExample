/* global angular */
/* global Camera */
/* global window */

(function () {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('OrganizationsController', ['$scope', '$state', '$localStorage', '$ionicLoading', '$ionicModal', 'STRINGS',
            'OrgManagementService', '$cordovaDialogs', 'MESSAGES', '$cordovaCamera', '$log', 'UsersService',
            function ($scope, $state, $localStorage, $ionicLoading, $ionicModal, STRINGS, OrgManagementService, $cordovaDialogs, MESSAGES,
                      $cordovaCamera, $log, UsersService) {

                $scope.enteredJobfunctions = [];
                $scope.currentSelection = null;
                $scope.showEditPrompt = false;

                $scope.$on("$ionicView.beforeEnter", function () {
                    $scope.$emit('navbarHideEvent', false);
                });

                $scope.doRefresh = function () {

                    function getOrganizations() {
                        $ionicLoading.show();

                        OrgManagementService.getOrganizations()
                            .then(function (result) {
                                $scope.$broadcast('scroll.refreshComplete');
                                $ionicLoading.hide();
                                $log.debug(result);
                                $scope.organizations = result.data;
                            }, function (error) {
                                $scope.$broadcast('scroll.refreshComplete');
                                $ionicLoading.hide();
                                $log.debug(error);
                            });
                    }

                    getOrganizations();

                    $scope.navOrgAdmins = function (organization) {
                        $state.go("super-admin.org-admins", {obj: organization});
                    };

                    $scope.openAddOrgAdmin = function (organization) {
                        $scope.selectedOrganization = organization;
                        $log.debug(organization);
                        $log.debug("add org admin");

                        $ionicModal.fromTemplateUrl('templates/add-org-admin-form.html', {
                            scope: $scope,
                            animation: 'slide-in-up'
                        }).then(function (modal) {
                            $scope.modal = modal;
                            $scope.modal.show();
                        });

                    };


                    $scope.keyDown = function (event) {

                        if (event.keyCode === 13 && !event.target.value == "") {

                            if ($scope.enteredJobfunctions.indexOf(event.target.value) === -1) {
                                $scope.enteredJobfunctions.push(event.target.value);
                                event.target.value = "";
                            }

                        }
                    };

                    $scope.editJobFunction = function (item) {
                        $scope.currentSelection = item;
                        $scope.showEditPrompt = true;

                    };

                    $scope.removeJobFunction = function () {

                        $scope.enteredJobfunctions.splice($scope.enteredJobfunctions.indexOf($scope.currentSelection),1);
                        $scope.currentSelection = null;
                        $scope.showEditPrompt = false;
                    };

                    $scope.closePrompt = function () {
                        $scope.showEditPrompt = false;
                    };


                    $scope.openAddOrganization = function () {
                        $log.debug("add org admin");
                        $ionicModal.fromTemplateUrl('templates/add-organization-form.html', {
                            scope: $scope,
                            animation: 'slide-in-up'
                        }).then(function (modal) {
                            $scope.modal = modal;
                            $scope.modal.show();
                        });

                    };

                    $scope.addorgAdmin = function (email, firstName, lastName) {

                        var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        if (!email || email === "" || !firstName || firstName === "" || !lastName || lastName === "") {
                            $cordovaDialogs.alert('Fields empty', '', 'Ok')
                                .then(function () {
                                    $log.debug("Fields empty");
                                });
                        } else if (!pattern.test(email)) {
                            $cordovaDialogs.alert('Invalid email address', '', 'Ok')
                                .then(function () {
                                    $log.debug("Invalid email address");
                                });
                        }
                        else {
                            $ionicLoading.show();

                            UsersService.createUser({
                                firstName: firstName,
                                lastName: lastName,
                                email: email,
                                role: 'org_admin',
                                job: "Org Admin",
                                orgId: $scope.selectedOrganization.orgId
                            })
                                .then(function (result) {
                                    $ionicLoading.hide();
                                    $log.debug(result);
                                    if (result.status === 201) {
                                        $scope.clearFieldsOrgAdmin();

                                        showToast(MESSAGES.USER_CREATED_MESSAGE);

                                        $scope.modal.remove();

                                    }
                                }, function (error) {
                                    $ionicLoading.hide();
                                    $cordovaDialogs.alert(MESSAGES.USER_CREATION_FAILURE_MESSAGE, '', 'Ok')
                                        .then(function () {
                                            $log.debug(MESSAGES.USER_CREATION_FAILURE_MESSAGE);
                                        });
                                    $log.debug(error);
                                });
                        }
                    };

                    $scope.upload = function () {
                        var options = {
                            quality: 75,
                            destinationType: Camera.DestinationType.DATA_URL,
                            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                            allowEdit: false,
                            encodingType: Camera.EncodingType.PNG

                        };
                        $cordovaCamera.getPicture(options).then(function (imageData) {
                            $log.debug("Image has been added");
                            //$log.debug(imageData);
                            $scope.uploadedImage = imageData;
                        }, function (error) {
                            $log.debug(error);
                        });
                    };

                    $scope.addOrganization = function (orgName,adminEmail,adminFirstName,adminLastName, orgStreetName,
                                                       orgCity, orgState, orgPostalCode,phone) {


                        var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        if (!adminEmail || adminEmail === "" || !adminFirstName || adminFirstName === "" || !adminLastName ||
                            adminLastName === "" || !orgName || orgName === "" || !orgStreetName || orgStreetName === "" ||
                            !orgCity || orgCity === "" || !orgState || orgState === "" || !orgPostalCode || orgPostalCode === "" ||
                            !phone || phone === "") {

                            $cordovaDialogs.alert('Fields empty', '', 'Ok')
                                .then(function () {
                                    $log.debug("Fields empty");
                                });
                        } else if (!pattern.test(adminEmail)) {
                            $cordovaDialogs.alert('Invalid email address', '', 'Ok')
                                .then(function () {
                                    $log.debug("Invalid email address");
                                });
                        }

                        else {

                            $ionicLoading.show();

                            OrgManagementService.createOrganization({
                                name: orgName,
                                address: {
                                    streetName: orgStreetName,
                                    city: orgCity,
                                    state: orgState,
                                    postalCode: orgPostalCode
                                },
                                contact: phone,
                                // orgLogo: $scope.uploadedImage,
                                orgJobFunctions: $scope.enteredJobfunctions,
                                logoMimeType: "image/png"
                            }).then(function (result) {
                                $ionicLoading.hide();
                                $log.debug(result);
                                if (result.status === 201) {
                                    $scope.clearFieldsOrganization();

                                    $scope.selectedOrganization = result.data;

                                    $scope.addorgAdmin(adminEmail,adminFirstName,adminLastName);

                                    $scope.modal.remove();
                                    showToast(MESSAGES.ORGANIZATION_CREATED_MESSAGE);
                                    getOrganizations();
                                }
                            }, function (error) {
                                $ionicLoading.hide();
                                $cordovaDialogs.alert(MESSAGES.ORGANIZATION_CREATION_FAILURE_MESSAGE, '', 'Ok')
                                    .then(function () {
                                        $log.debug(MESSAGES.ORGANIZATION_CREATION_FAILURE_MESSAGE);
                                    });
                                $log.debug(error);
                            });
                        }
                    };

                    $scope.clearFieldsOrganization = function () {
                        $scope.orgName = "";
                        $scope.adminEmail = "";
                        $scope.adminFirstName = "";
                        $scope.adminLastName = "";
                        $scope.orgStreetName = "";
                        $scope.orgCity = "";
                        $scope.orgState = "";
                        $scope.orgPostalCode = "";
                        $scope.phone = "";
                        $scope.image = "";

                        $scope.uploadedImage = "";

                        $scope.enteredJobfunctions = {};

                    };

                    $scope.clearFieldsOrgAdmin = function () {
                        $scope.adminEmail = "";
                        $scope.adminFirstName = "";
                        $scope.adminLastName = "";
                    };
                };

                $scope.doRefresh();

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

                $scope.isString = function(value){
                    return typeof value === 'string';
                };

            }]);
})();
