/* global angular */
/* global console */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
(function () {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('ConfigureMetricsCtrl', ['$scope', '$state', '$localStorage','$ionicLoading', 'STRINGS', '$ionicPopup',
            '$cordovaDialogs', '$ionicModal','OrgConfigService',
            function ($scope, $state, $localStorage, $ionicLoading, STRINGS, $ionicPopup,
                      $cordovaDialogs, $ionicModal,OrgConfigService) {

                $scope.strings = STRINGS;
                var orgId = $localStorage.orgId;

                $scope.doRefresh = function() {

                  $ionicLoading.show();

                  OrgConfigService.getOrgConfiguration(orgId)
                    .then(function (result) {
                      if (result.status === 200) {
                        console.log(result);

                        var configurationItems = [];
                        var configurationKeyItems = [];
                        var selected = {};
                        var configOptions = result.data;
                        $scope.configData = result.data;

                        var count = 0;

                        Object.keys(configOptions).forEach(function (parentKey) {
                          var parentValue = configOptions[parentKey];
                          configurationItems[count] = [];
                          // selected[count] = [];
                          selected[parentKey] = {};

                          Object.keys(parentValue).forEach(function (key) {
                            var value = parentValue[key];
                            configurationItems[count].push(key);

                            if (value) {
                              selected[parentKey][key] = value;
                            }

                          });

                          configurationKeyItems.push({title: parentKey, count: count});
                          count++;
                        });

                        $scope.selected = selected;
                        $scope.configOptions = configurationItems;
                        $scope.configCategories = configurationKeyItems;
                        console.log($scope.configCategories);
                        console.log($scope.configOptions);

                        $ionicLoading.hide();
                        $scope.$broadcast('scroll.refreshComplete');
                      }
                    }, function (error) {
                      console.log(error);
                      $ionicLoading.hide();
                      $scope.$broadcast('scroll.refreshComplete');
                    });
                };

                $scope.closeConfiguration = function(){

                $ionicLoading.show();

                OrgConfigService.saveOrgConfiguration($scope.selected, orgId)
                  .then(function (result) {
                      console.log(result);
                      console.log("successfully updated");
                      $cordovaDialogs.alert('Successfully Updated','Ok');
                      $ionicLoading.hide();
                  }, function (error) {
                      console.log(error);
                      $ionicLoading.hide();
                  });
                };

                $scope.doRefresh();
            }
        ]);

})();
