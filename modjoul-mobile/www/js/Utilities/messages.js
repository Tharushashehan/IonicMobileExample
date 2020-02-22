/* global angular */
(function () {
    'use strict';
    angular.module("modjoul-mobile.constants")
        .constant("MESSAGES", {
            USER_CREATED_MESSAGE: "User has been created successfully",
            USER_CREATION_FAILURE_MESSAGE: "Failed to create user",
            ORGANIZATION_CREATED_MESSAGE: "Organization has been created successfully",
            ORGANIZATION_CREATION_FAILURE_MESSAGE: "Failed to create Organization",
            ORG_ADMIN_CREATED_MESSAGE: "Organization Administrator has been created successfully",
            ORG_ADMIN_FAILURE_MESSAGE: "Failed to create Organization Administrator",
            DEVICE_CREATED_MESSAGE: "Successfully added device",
            DEVICE_FAILURE_MESSAGE: "Failed to create device",
            DEVICE_ASSIGN_MESSAGE: "Successfully assigned device",
            DEVICE_ASSIGN_FAILURE_MESSAGE: "Failed to assign device",
            DEVICE_TYPE_CREATED_MESSAGE: "Successfully added device type",
            DEVICE_TYPE_FAILURE_MESSAGE: "Failed to create device type",
            DEVICE_MANUFACTURER_CREATED_MESSAGE: "Device Manufacturer has been created successfully",
            DEVICE_MANUFACTURER_FAILURE_MESSAGE: "Failed to create Device Manufacturer",
            LOCATION_DELETED_MESSAGE: "Location has been deleted successfully",
            LOCATION_DELETED_FAILURE_MESSAGE: "Failed to delete location",
            LOCATION_CREATED_MESSAGE: "Location has been created successfully",
            LOCATION_CREATED_FAILURE_MESSAGE: "Failed to create location",
            FORGOT_PASSWORD_SUCCESS: "Email has been sent to reset your Password. Please check your Email!",
            FORGOT_PASSWORD_FAILURE: "Failed to send password reset email",
            INVALID_EMAIL_ADDRESS: "Invalid email address",
            EMPTY_FIELDS_MESSAGE: "Please fill the fields",
            EMPTY_EMAIL_ADDRESS_MESSAGE: "Please fill the email address",
            EMPLOYEE_DELETED_MESSAGE: "Employee has been deleted successfully",
            EMPLOYEE_DELETED_FAILURE_MESSAGE: "Failed to delete employee",
            DEVICEMAN_DELETED_MESSAGE: "Device Manufacturer has been deleted successfully",
            DEVICEMAN_DELETED_FAILURE_MESSAGE: "Failed to delete the Manufacturer",
            NO_DATA_AVAILABLE: "No Data Available",
            ORG_GATEWAY_ADD_SUCCESS: "Gateway Configured Successfully",
            ORG_GATEWAY_ADD_FAILURE: "Failed to Configure Gateway",
            WIFI: {
                WIFI_FORM_ERROR: "Wifi connection details are empty",
                SSID_ERROR: "SSID is empty",
                PASSWORD_ERROR: "Password is empty",
                SECURITY_TYPE_ERROR: "Security type not selected",
                SERVICE_FAILURE: "Failed to send credentials. Please try again.",
                SERVICE_SUCCESS: "Successfully sent credentials"
            },
            DEVICE_ID_NOT_FOUND: "Device not found for given Serial Number",
            CLAIM_CREATE_SUCCESS: "Initiated claim successfully",
            CLAIM_CREATE_FAILURE: "Failed to initiate claim",
            DEVICE_VIBRATE_SUCCESS: "Successfully sent vibration command to belt",
            NO_DEVICE_ASSIGNED: "There is no device assigned to this employee"

        });

})();
