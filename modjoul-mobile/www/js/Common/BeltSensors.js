/* global angular */

(function () {
    'use strict';
    angular.module("modjoul-mobile.constants")
        .constant("SENSOR_STRINGS",
            {
                SENSOR_KEYS: {
                    beltStatus: "beltStatus",
                    altimeter: "altimeter",
                    humiditySensor: "humiditySensor",
                    temperatureSensor: "temperatureSensor",
                    pressureFrontLeft: "pressureFrontLeft",
                    pressureFrontRight: "pressureFrontRight",
                    pressureBackLeft: "pressureBackLeft",
                    pressureBackRight: "pressureBackRight",
                    pressureSideLeft: "pressureSideLeft",
                    pressureSideRight: "pressureSideRight",
                    gps: "gps",
                    gyroFrontLeft: "gyroFrontLeft",
                    gyroFrontRight: "gyroFrontRight",
                    gyroBackLeft: "gyroBackLeft",
                    gyroBackRight: "gyroBackRight",
                    gyroSideLeft: "gyroSideLeft",
                    gyroSideRight: "gyroSideRight",
                    accelFrontLeft: "accelFrontLeft",
                    accelFrontRight: "accelFrontRight",
                    accelBackLeft: "accelBackLeft",
                    accelBackRight: "accelBackRight",
                    accelSideLeft: "accelSideLeft",
                    accelSideRight: "accelSideRight",
                    magnetometer: "magnetometer",
                    gpsSignalStrength: "gpsSignalStrength",
                    rtcHealth: "rtcHealth",
                    sdCardHealth: "sdCardHealth",
                    wifiSignalStrength: "wifiSignalStrength",
                    gsmSignalStrength: "gsmSignalStrength",
                    batteryChargePercentage: "batteryChargePercentage",
                    freeMemory: "freeMemory"
                },
                "SENSOR_TITLES": {
                    beltStatus: "Belt overall",
                    altimeter: "Altimeter",
                    humiditySensor: "Humidity sensor",
                    temperatureSensor: "Temperature sensor",
                    pressureFrontLeft: "Pressure Sensor Front Left",
                    pressureFrontRight: "Pressure Sensor Front Right",
                    pressureBackLeft: "Pressure Sensor Back Left",
                    pressureBackRight: "Pressure Sensor Back Right",
                    pressureSideLeft: "Pressure Sensor Side Left",
                    pressureSideRight: "Pressure Sensor Side Right",
                    gps: "GPS",
                    gyroFrontLeft: "Gyro Sensor Front Left",
                    gyroFrontRight: "Gyro Sensor Front Right",
                    gyroBackLeft: "Gyro Sensor Back Left",
                    gyroBackRight: "Gyro Sensor Back Right",
                    gyroSideLeft: "Gyro Sensor Side Left",
                    gyroSideRight: "Gyro Sensor Side Right",
                    accelFrontLeft: "Accelerometer Front Left",
                    accelFrontRight: "Accelerometer Front Right",
                    accelBackLeft: "Accelerometer Back Left",
                    accelBackRight: "Accelerometer Back Right",
                    accelSideLeft: "Accelerometer Side Left",
                    accelSideRight: "Accelerometer Side Right",
                    magnetometer: "Magnetometer",
                    gpsSignalStrength: "GPS signal strength",
                    rtcHealth: "RTC Health",
                    sdCardHealth: "SD Card Health",
                    wifiSignalStrength: "Wifi signal strength",
                    gsmSignalStrength: "GSM signal strength",
                    batteryChargePercentage: "Battery strength",
                    freeMemory: "Free memory available"
                }
            });
})();
