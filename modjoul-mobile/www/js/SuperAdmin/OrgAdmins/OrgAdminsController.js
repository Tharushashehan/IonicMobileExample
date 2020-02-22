/* global angular */
/* global console */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
(function () {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('OrgAdminsController',['$scope', '$localStorage', '$ionicLoading', 'TemperatureService', 'STRINGS', '$ionicModal', '$state', 'OrgManagementService', '$cordovaDialogs', 'MESSAGES', 'UsersService','$log',
            function ($scope, $localStorage, $ionicLoading, TemperatureService, STRINGS, $ionicModal, $state, OrgManagementService, $cordovaDialogs, MESSAGES, UsersService, $log) {

            $scope.selectedOrganization = $state.params.obj;
            console.log($scope.selectedOrganization);
            $scope.openAddOrgAdmin = function () {
                console.log("add org admin");
                $ionicModal.fromTemplateUrl('templates/add-org-admin-form.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                });

            };

            $scope.addorgAdmin = function(email,firstName,lastName){
                var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!email  || email === "" || !firstName  || firstName === "" || !lastName  ||
                    lastName === "") {
                    $cordovaDialogs.alert('Fields empty', '', 'Ok')
                        .then(function () {
                            console.log("Fields empty");
                        });
                } else if (!pattern.test(email)) {
                    $cordovaDialogs.alert('Invalid email address', '', 'Ok')
                        .then(function () {
                            console.log("Invalid email address");
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
                        orgName : $scope.selectedOrganization.orgName,
                        orgId: $scope.selectedOrganization.orgId
                    })
                        .then(function (result) {
                            $ionicLoading.hide();
                            console.log(result);
                            if (result.status === 201) {
                                $scope.clearFieldsOrgAdmin();
                                $cordovaDialogs.alert(MESSAGES.USER_CREATED_MESSAGE, '', 'Ok')
                                    .then(function () {
                                        console.log(MESSAGES.USER_CREATED_MESSAGE);
                                    });
                                $scope.modal.remove();
                                $scope.doRefresh();
                            }
                        },function (error) {
                            $ionicLoading.hide();
                            $cordovaDialogs.alert(MESSAGES.USER_CREATION_FAILURE_MESSAGE, '', 'Ok')
                                .then(function () {
                                    console.log(MESSAGES.USER_CREATION_FAILURE_MESSAGE);
                                });
                            console.log(error);
                        });
                }
            };

            $scope.clearFieldsOrgAdmin = function () {
                $scope.adminEmail = "";
                $scope.adminFirstName = "";
                $scope.adminLastName = "";
            };

            $scope.doRefresh = function() {

                $ionicLoading.show();

                var orgId = $scope.selectedOrganization.orgId;
                OrgManagementService.getOrgAdminsForOrganization(orgId).then(function (result) {
                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.refreshComplete');

                    if (result.status === 200) {
                        console.log(orgId);
                        $scope.admins = result.data.users;
                        console.log(result);
                    }
                }, function (){
                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.refreshComplete');
                });
            };

            $scope.doRefresh();

        }]);


})();
