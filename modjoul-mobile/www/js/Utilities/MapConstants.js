/* global angular */
(function() {
  'use strict';
  angular.module("modjoul-mobile.constants")

    .constant("MapConstants", {
      latitude: 38.859237,
      longitude: -98.657800,
      zoom: 4

        }
    )


    .constant("MapMessages", {
          breadcrumb_load_failed: "Failed to load breadcrumb data",
          breadcrumb_no_data: "No breadcrumb data for selected date",
          breadcrumb_no_employee: "Please select an employee",
          supervisor_breadcrumb_no_data: "No breadcrumb data for selected employee/date",
          out_of_bounds_no_data: "No out of bounds data for selected date",
          supervisor_out_of_bounds_no_data: "No out of bounds data for selected employee/date",
          out_of_bounds_load_failed: "Failed to load out of bounds data"

            }
        );

})();
