/* global angular */
/* global window */
(function () {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('DataVisibilityController', ['$scope', '$state', '$localStorage', '$ionicLoading', '$ionicModal', 'STRINGS',
            'OrgManagementService', '$cordovaDialogs', 'MESSAGES', '$cordovaCamera', '$ionicListDelegate', '$log',
            function ($scope, $state, $localStorage, $ionicLoading, $ionicModal, STRINGS, OrgManagementService, $cordovaDialogs, MESSAGES,
                      $cordovaCamera, $ionicListDelegate, $log) {

                $scope.listCanSwipe = true;

                $scope.$on("$ionicView.beforeEnter", function () {
                    $scope.$emit('navbarHideEvent', false);
                });

                $scope.doRefresh = function () {

                    $ionicLoading.show();

                    OrgManagementService.getOrganizations(true)
                        .then(function (result) {
                            $ionicLoading.hide();
                            $log.debug(result);
                            $scope.organizations = result.data;
                        }, function (error) {
                            $ionicLoading.hide();
                            $log.debug(error);
                        });

                };

                $scope.checkConsumers = function (selectedOriginator) {
                    $log.debug(selectedOriginator);
                    var selectedOrg1 = JSON.parse(selectedOriginator);
                    $log.debug(selectedOrg1);
                    $scope.selectedOrgName = selectedOrg1.orgName;
                    var consumers = $scope.organizations;
                    $scope.consumers = consumers;
                    $log.debug($scope.consumers);
                };

                $scope.addConnection = function (selectedOriginator, selectedConsumer) {
                    $scope.showLoading = true;
                    $log.debug(selectedOriginator);
                    $log.debug(selectedConsumer);
                    var selectedOrginatorOrg = JSON.parse(selectedOriginator);
                    var selectedConsumerOrg = selectedConsumer;
                    $log.debug(selectedConsumerOrg);

                    var payload = {
                        generatorId: selectedOrginatorOrg.orgId
                    };
                    $log.debug(payload);

                    $ionicLoading.show();

                    OrgManagementService.postOrganizationVisibility(payload, selectedConsumerOrg)
                        .then(function (result) {
                            $ionicLoading.hide();
                            if (result.status === 200) {
                                $log.debug(result.data);

                                $scope.modal.remove();

                                showToast("Connection Added Successfully");
                            }
                        }, function (error) {
                            $log.error(error);
                            $ionicLoading.hide();
                            $log.debug("Failed to Add Connection");
                            $cordovaDialogs.alert("Failed to Add Connection");
                        });
                };

                $scope.checkOriginators = function (selectedOrg) {
                    var orgId = selectedOrg;
                    $log.debug(selectedOrg);

                    OrgManagementService.getOrganizationVisibility(orgId)
                        .then(function (result) {
                            $ionicLoading.hide();
                            $scope.orgVisibilityItems = result.data;
                            $log.debug($scope.orgVisibilityItems);
                        }, function (error) {
                            $ionicLoading.hide();
                            $log.debug(error);
                        });
                };

                var deleteDataVisibility = function (orgItem) {
                    $scope.showLoading = true;
                    OrgManagementService.deleteOrganizationVisibility(orgItem.consumerId, orgItem.accessId)
                        .then(function (result) {
                            $scope.showLoading = false;
                            if (result.status === 200) {
                                $log.debug(result.data);
                                $scope.orgVisibilityItems.splice($scope.orgVisibilityItems.indexOf(orgItem), 1);
                                $log.debug("deleted successfully");
                            }
                        }, function (error) {
                            $log.error(error);
                            $scope.showLoading = false;
                            $log.debug("Failed to delete originator.");
                        });

                };

                $scope.showDeleteConfirmation = function (item) {
                    $cordovaDialogs.confirm('Are you sure you want to remove this organization?', ['Ok', 'Cancel'])
                        .then(function (buttonIndex) {
                            if (buttonIndex === 1) {
                                deleteDataVisibility(item);
                            }
                            else {
                                $log.debug('You are not sure');
                            }

                            $ionicListDelegate.closeOptionButtons();
                        });
                };

                $scope.getOrgName = function (orgId) {
                    //$log.debug(orgId);
                    for (var i = 0; i < $scope.organizations.length; i++) {
                        if ($scope.organizations[i].orgId === orgId.generatorId) {
                            //$log.debug($scope.orgs[i].orgId);
                            return $scope.organizations[i].orgName ? $scope.organizations[i].orgName : $scope.organizations[i].name;
                        }
                    }
                };


                $scope.openAddDataVisibility = function () {
                    $log.debug("add data visibility");
                    $ionicModal.fromTemplateUrl('templates/add-data-visibility.html', {
                        scope: $scope,
                        animation: 'slide-in-up'
                    }).then(function (modal) {
                        $scope.modal = modal;
                        $scope.modal.show();
                    });

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
            }]);
})();
