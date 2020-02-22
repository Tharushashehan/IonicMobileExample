/* global angular */
/* global console */
/* global google */
/* global document */

/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
(function() {
    'use strict';

    angular.module('modjoul-mobile.controllers')
        .controller('ClaimsController', ['$scope', '$localStorage', 'UserManagementService', 'ClaimsService',
          '$ionicLoading', '$ionicModal', '$cordovaDialogs','$timeout','$ionicPopup',
            function($scope, $localStorage, UserManagementService, ClaimsService,  $ionicLoading, $ionicModal,$cordovaDialogs, $timeout, $ionicPopup) {

              // var orgId = $localStorage.orgId;

              $scope.doRefresh = function () {

                $ionicLoading.show();

                $scope.loadClaims = function () {

                  var params = {};
                  var orgId = $localStorage.orgId;

                  ClaimsService.getClaims(params, orgId).then(function (result) {
                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.claims = result.data;
                    console.log($scope.claims);

                  }, function () {
                    $scope.$broadcast('scroll.refreshComplete');
                    $ionicLoading.hide();
                  });

                };

                $scope.loadClaims();

              };

              $scope.doRefresh();


              $scope.onBlackboxEvent = function(claim){
                console.log(claim);
                $timeout(function(){
                var myLatLng = new google.maps.LatLng(claim.lat, claim.long);
                var mapOptions = {
                  center: myLatLng,
                  zoom:16
                };

                var map = new google.maps.Map(document.getElementById("blackbox-event-map"),mapOptions);

                var marker = new google.maps.Marker({
                  position: myLatLng,
                  map: map
                });

                $scope.map = map;
                console.log($scope.map);
                console.log(marker);

              },800);


                var titleString = "<div class='shiftTime-Title'>Event Location</div>";

                $ionicPopup.show({
                  templateUrl: "templates/blackbox-location-popup.html",
                  scope: $scope,
                  title: titleString,
                  cssClass : 'blackbox-event-popup',
                  buttons: [
                    {
                      text: '<b>Close</b>',
                      type: 'button-positive-orange'
                    }
                  ]
                });
              };

          }


        ]);
})();
