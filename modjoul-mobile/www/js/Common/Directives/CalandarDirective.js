/* global angular */
/* global Highcharts */
(function() {
    'use strict';

    angular.module('modjoul-mobile.directives')

      .directive('calendarSelector', ['$rootScope', '$localStorage', 'ionicDatePicker',function($rootScope,$localStorage,ionicDatePicker) {
        return {
          restrict: 'E',
          template: '<button class="button button-icon button-clear" ng-click="openCalendar()"><i class="fa fa-calendar" aria-hidden="true"></i></button>',
          scope: {
            trigger: '='
          },
          link: function(scope, element) {

              scope.openCalendar = function () {

                  var currentDate = moment();
                  var maxDate = moment().add(1, "days");
                  var lastMonth = moment().subtract(12, "months");

                  var selectedDate;
                  if ($localStorage.selectedDate === undefined) {

                      selectedDate = currentDate;
                  }
                  else {
                      selectedDate = moment($localStorage.selectedDate, "YYYY-MM-DD");
                  }

                  var ipObj1 = {
                      callback: function (val) {
                          $localStorage.selectedDate = moment(val, "x").format("YYYY-MM-DD");
                          $rootScope.$broadcast('dateSelected', true);
                      },
                      from: new Date(lastMonth.format('YYYY'), lastMonth.format('M') - 1, lastMonth.format('D')),
                      to: new Date(maxDate.format('YYYY'), maxDate.format('M') - 1, maxDate.format('D')),
                      inputDate: new Date(selectedDate.format('YYYY'), selectedDate.format('M') - 1, selectedDate.format('D'))
                  };
                  ionicDatePicker.openDatePicker(ipObj1);
              };

          }
        };

      }]);

})();
