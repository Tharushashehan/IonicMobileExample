/* global angular */

(function () {
    'use strict';
    angular.module("modjoul-mobile.constants")
        .constant("STRINGS", {
            EMPLOYEE_ROLE: "Employee Role",
            FALL_FORWARDS: "Falls Forward",
            FALL_FORWARDS2: "Falls Forward",
            FALL_BACKWARDS: "Falls Backward",
            FALL_SIDEWAYS: "Falls Sideways",
            FALL_LEFT: "Falls Left",
            FALL_RIGHT: "Falls Right",
            AMBIENT_TEMPERATURE: "Temperature",
            ALL: "all",
            WORK: "work",
            DRIVE: "drive",
            IDLE: "idle",
            RUNNING: "running",
            WALKING: "Walking",
            WORKINGFROMHEIGHTS: "walkingFromHeights",
            UNCATEGORIZED: "uncategorized",
            SLIPS: "Slips",
            TRIPS: "Trips",
            BRAKES: "Brakes",
            HARD_CORNERS: "Hard Corners",
            SWERVES: "Swerves",
            HARD_ACCELERATIONS: "Hard Accelerations",
            OVER_SPEED_LIMIT: "Over Speed Limit",
            AGGRESSIVE_DRIVING_EVENTS: "Driving Safety",
            AGGRESSIVE_EVENTS_100_MI: "Aggressive Events Count 100 Miles",
            AGGRESSIVE_WORK_EVENTS: "Aggressive Work Events",
            NEAR_MISS_EVENTS: "Trips & Falls",
            INDOOR_DRIVING: "Indoor Driving",
            BENDING: "Bending",
            TWISTING: "Twisting",
            STAIRS: "On Stairs",
            GOOD_BENDS: "Good Bends",
            BAD_BENDS: "Bad Bends",
            GOOD_LIFTS: "Good Lifts",
            BAD_LIFTS: "Bad Lifts",
            AVERAGE_HEIGHT: "Average Height",
            MAXIMUM_HEIGHT: "Maximum Height",
            MINIMUM_HEIGHT: "Minimum Height",
            WALKING_UP_STAIRS: "Walking Up Stairs",
            WALKING_DOWN_STAIRS: "Walking Down Stairs",
            SITTING: "Sitting",
            STANDING: "Standing",
            LYING: "Lying",
            DRIVING: "Driving",
            HIP_AXIAL_TWIST: "Hip Axial Twist",
            STRAIN_X: "Strain X",
            TWIST_STRAIN: "Twist Strain",
            TWISTING_ANGLE: "Twisting Angle",
            TOTAL_IDLE_TIME: "Total Idle Time",
            WORK_TIME: "Work Time",
            IDLE_TIME: "Idle Time",
            DURATION: "Duration",
            DISTANCE: "Distance",
            HEIGHT: 'Height',
            COUNT: 'Count',
            NO_DATA: "No Data",
            DEFAULT_CHART_METRIC: "Count",
            DEFAULT_CHART_UNIT: "",
            COLORS: {
                MODJOUL_BLACK: "#262626",
                MODJOUL_ORANGE: "#F99D1C",
                MODJOUL_GRAY: "#8E8E8E",
                MODJOUL_RED: "#C50808",
                MODJOUL_GREEN: "#54AA09",
                MODJOUL_BLUE: "#0085c3",
                MODJOUL_BROWN: "#B06804",
                MODJOUL_PINK: "#E1435B",
                MODJOUL_YELLOW: "#F9D316"
            },
            BENDING_MIX_COLORS: {
                BENDS: "#FDE2BB",
                BENDS_WITH_TWISTS: "#F99D1C",
                BENDS_WITH_ACCEL: "#F56F09",
                BENDS_WITH__TWIST_ACCEL: "#C50808"
            },
            DRIVING_TIME: "Driving Time",
            DRIVING_DISTANCE: "Driving Distance",
            NEAR_MISS_WORK_RATE: "Near Miss Work Rate",
            NEAR_MISS_WORK_HOURS: "Driving Distance",
            AGGRESSIVE_EVENTS_COUNTS: "Aggressive Events Counts",
            AGGRESSIVE_EVENTS: "Aggressive Events Count 100Miles",
            ACTUAL_HOURS_WORKED: "Actual Hours Worked",
            HOW_MANY_STEPS: "How Many Steps",
            HOW_FAR: "How Far",
            HOW_LONG: "How Long",
            HOW_FAST: "How Fast",
            TIME_TO_EXIT_VEHICLE: "Time to exit vehicle",
            ENERGY_USED_FOR_WORK: "Energy used for work",
            BREADCRUMB_ACTIVITY_LIST: {
                WORK: {
                    WALKING: "Walking",
                    RUNNING: "Running",
                    UPSTAIRS: "Upstairs",
                    DOWNSTAIRS: "Downstairs",
                    BENDING: "Bend",
                    TWISTING: "Twisting",
                    STANDING: "Standing",
                    SITTING: "Sitting",
                    WORKING_FROM_HEIGHTS: "WorkingAtHeight",
                    WORKING_FROM_HEIGHTS_MAP: "Working From Height",
                    SLIP: "Slip",
                    TRIP: "Trip",
                    FALL_SIDEWAYS: "Fall_Sideways",
                    FALL_SIDEWAYS_MAP: "Fall Sideways",
                    FALL_BACKWARDS: "Fall_Backwards",
                    FALL_BACKWARDS_MAP: "Fall Backwards",
                    FALL_FORWARDS: "Fall_Forward",
                    FALL_FORWARDS_MAP: "Fall Forward"
                },
                DRIVE: {
                    DRIVING: "Driving",
                    GETTING_IN_VEHICLE: "Getting_In_Vehicle",
                    GETTING_OUT_VEHIVLE: "Getting_Out_Vehicle",
                    HARD_BRAKE: "Hard_Brake",
                    HARD_BRAKE_MAP: "Hard Brake",
                    HARD_CORNER: "Hard_Corner",
                    HARD_CORNER_MAP: "Hard Corner",
                    SWERVES: "Swerves",
                    SWERVES_MAP: "Swerve",
                    HARD_ACCELERATION: "Hard_Acceleration",
                    HARD_ACCELERATION_MAP: "Hard Acceleration"
                }
            },
            BREADCRUMB_FILTER_TITLES: {
                LOCATIONS: "Locations",
                DRIVING: "Driving History",
                OUTOFBOUNDS: "Out Of Bounds"

            },
            ACTIVITIES_MAPPING : {
                FALL_PARENT: 'fall',
                FALL_FORWARDS: 'FallForwardsCount',
                FALL_FORWARDS_RATE: 'FallForwardsPercentage',
                FALL_BACKWARDS: 'FallBackwardsCount',
                FALL_BACKWARDS_RATE: 'FallBackwardsPercentage',
                FALL_SIDEWAYS: 'FallSidewaysCount',
                FALL_SIDEWAYS_RATE: 'FallSidewaysPercentage',
                SLIP_PARENT: 'slip',
                SLIPS: 'SlipsCount',
                SLIPS_RATE: 'SlipRate',
                TRIP_PARENT: 'trip',
                TRIPS: 'TripsCount',
                TRIPS_RATE: 'TripRate',
                NEAR_MISS_WORK_TOTAL_PARENT: 'summary',
                NEAR_MISS_WORK_PARENT: 'near-miss-events',
                NEAR_MISS_WORK_TOTAL: 'NearMissWork',
                NEAR_MISS_WORK_RATE: 'NearMissWorkRate',
                NEAR_MISS_WORK_X_HOURS: 'NearMissWorkXHours',
                HARD_ACCELERATION_PARENT: 'hard-acceleration',
                HARD_ACCELERATIONS: 'HardAccelerationCount',
                HARD_BRAKE_PARENT: 'hard-brake',
                HARD_BRAKES: 'BrakeCount',
                HARD_CORNER_PARENT: 'hard-corner',
                HARD_CORNERS: 'HardCornersCount',
                OVER_SPEED_PARENT: 'over-speed',
                OVER_SPEED: 'OverSpeedCount',
                OVER_SPEED_PERCENTAGE: 'OverSpeedLimitPercentage',
                SWERVE_PARENT: 'swerve',
                SWERVES: 'SwervesCount',
                AGGRESSIVE_DRIVING_TOTAL_PARENT: 'summary',
                AGGRESSIVE_EVENTS_COUNT: 'AggressiveEventsCount',
                AGGRESSIVE_EVENTS_COUNT_100_MILES: 'AggressiveEventsCount100Miles',

                BENDING_PARENT: 'bending',
                BENDING_PARENT2: 'Bending',
                BENDING_DEGREE_PARENT: 'BendingDegrees',
                BENDING_HOW_LONG: 'BendingTime',

                BENDTIME21TO30: 'BendTime21To30',
                BENDTIME31TO40: 'BendTime31To40',
                BENDTIME41TO50: 'BendTime41To50',
                BENDTIME51TO60: 'BendTime51To60',
                BENDTIME61TO70: 'BendTime61To70',
                BENDTIME70: 'BendTime70',

                BENDCOUNT21TO30: 'BendCount21To30',
                BENDCOUNT31TO40: 'BendCount31To40',
                BENDCOUNT41TO50: 'BendCount41To50',
                BENDCOUNT51TO60: 'BendCount51To60',
                BENDCOUNT61TO70: 'BendCount61To70',
                BENDCOUNT70: 'BendCount70',

                TWISTING30: "TwistBelow30",
                TWISTING30_60: "Twist30_60",
                TWISTING60: "TwistAbove60",

                BAD_BEND_COUNT: 'BadBendCount',
                BENDING_COUNT: 'BendingCount',
                BENDING_SPEED: 'BendingSpeed',
                BENDING_DEGREE_MEAN: 'BendingDegreeMean',
                BENDING_RATE: 'BendingRate',
                BENDING_DEGREE_MIN: 'BendingDegreeMin',
                BENDING_DEGREE_MAX: 'BendingDegreeMax',
                BENDING_PERCENTAGE: 'BendingTimePercentage',

                TWISTING_PARENT: "twisting",
                TWISTING_PERCENTAGE: 'TwistingTimePercentage',
                HIP_AXIAL_TWIST_COUNT: 'HipAxialTwistCount',
                TWISTING_ANGLE: 'TwistingAngle',
                GOOD_BEND_COUNT: 'GoodBendCount',

                WALKING_PARENT: 'walking',
                HOW_FAR: 'HowFar',
                HOW_LONG: 'HowLong',
                HOW_FAST: 'HowFast',
                HOW_MANY_STEPS: 'HowManySteps',
                HOW_FAR_WALKING: 'HowFar',
                HOW_LONG_WALKING: 'HowLong',
                HOW_MANY_STEPS_WALKING: 'HowManySteps',
                WALKING_RATE: 'WalkingTimePercentage',
                RUNNING_RATE: 'RunningTimePercentage',
                HOW_FAR_RUNNING: 'HowFar',
                HOW_LONG_RUNNING: 'HowLong',
                HOW_MANY_STEPS_RUNNING: 'HowManySteps',
                RUNNING_PARENT: 'running',
                STAIRS_PARENT: "stairs",
                STAIRS_PERCENTAGE: 'StairsTimePercentage',

                WORK_TIME_TOTAL_PARENT: 'summary',
                WORK_TIME_TOTAL_RATE: 'WorkTimePercentage',
                WORK_TIME: 'WorkTime',
                WORK_TIME_PERCENTAGE: 'WorkTimePercentage',
                WORK_TIME_PARENT: 'work-time',
                OTHER_PARENT: 'others',
                INDOOR_DRIVING_PARENT: 'indoorDriving',

                DRIVING_PARENT: 'driving',
                DRIVING_DISTANCE: 'DrivingDistance',
                DRIVING_TIME: 'DrivingTime',
                DRIVING_IDLE_TIME: 'IdleTimeDriving',
                ENTER_VEHICLE_PARENT: 'enterVehicle',
                TIME_TO_ENTER_VEHICLE: 'TimeToEnterVehicle',
                EXIT_VEHICLE_PARENT: 'exitVehicle',
                TIME_TO_EXIT_VEHICLE: 'TimeToExitVehicle',
                LYING_PARENT: 'Lying',
                IDLE_TIME_LYING: 'IdleTimeLying',
                IDLE_TIME_PARENT: 'idle-time',
                IDLE_TIME_TOTAL_PARENT: 'summary',
                TOTAL_IDLE_TIME_RATE: 'TotalIdleTimePercentage',
                TOTAL_IDLE_TIME: 'TotalIdleTime',
                SITTING_PARENT: 'sitting',
                IDLE_TIME_SITTING: 'IdleTimeSitting',
                STANDING_PARENT: 'standing',
                IDLE_TIME_STANDING: 'IdleTimeStanding',
                WORK_FROM_HEIGHTS_PARENT: 'workingFromHeights',
                WORK_FROM_HEIGHTS_TOTAL_PARENT: 'summary',
                ALTITUDE_MEAN: 'AltitudeMean',
                ALTITUDE_MIN: 'AltitudeMin',
                ALTITUDE_MAX: 'AltitudeMax',
                WORKING_HEIGHT_COUNT: 'WorkingHeightCount',
                WORKING_HEIGHT_TIME: 'WorkingHeightTime',
                AMBIENT_TEMPERATURE: 'AmbientTemperature',
                INDOOR_INCIDENTS: "Incidents",
                INDOOR_HARD_BRAKE: "HardBrake",
                INDOOR_HARD_MANEUVER: "HardManeuver"
            },
            FEED_MAPPING: {
                "Fall_Forward": "fell forwards",
                "Downstairs": "went downstairs",
                "Fall_Sideways": "fell sideways",
                "Fall_Backwards": "fell backwards",
                "Trip": "tripped",
                "Slip": "slipped",
                "Upstairs": "went upstairs",
                "Hard_Brake": "was driving and braked hard",
                "Hard_Acceleration": "was driving and accelerated dangerously fast",
                "Hard_Corner": "was driving and took a hard corner",
                "Swerves": "was driving and swerved on the road"
            },
            FEED_ICONS: {
                "Fall_Forward": {icon: "exclamation-circle", color: "red"},
                "Downstairs": {icon: "arrow-circle-o-down", color: "green"},
                "Fall_Sideways": {icon: "exclamation-circle", color: "red"},
                "Fall_Backwards": {icon: "exclamation-circle", color: "red"},
                "Trip": {icon: "question-circle", color: "orange"},
                "Slip": {icon: "question-circle", color: "orange"},
                "Upstairs": {icon: "arrow-circle-o-up", color: "green"},
                "Hard_Brake": {icon: "asterisk", color: "red"},
                "Hard_Acceleration": {icon: "asterisk", color: "orange"},
                "Hard_Corner": {icon: "asterisk", color: "orange"},
                "Swerve": {icon: "asterisk", color: "red"}
            },
            ORG_CONFIG: {
                ACTUAL: {
                    idleTime: "idleTime",
                    sitting: "sitting",
                    standing: "standing",
                    stationaryWork: "stationaryWork",
                    idleDriving: "idleDriving",
                    lying: "lying",
                    timeToExitVehicle: "timeToExitVehicle",

                    driveTime: "driveTime",
                    driving: "driving",
                    indoorDriving: "indoorDriving",

                    wholeBodyVibration: "wholeBodyVibration",

                    bend: "bend",
                    bending: "bending",

                    twist: "twist",

                    overSpeedLimit: "overSpeedLimit",

                    workingFromHeights: "workingFromHeights",

                    workTime: "workTime",
                    walking: "walking",
                    running: "running",
                    walkingUpStairs: "walkingUpStairs",
                    walkingDownStairs: "walkingDownStairs",
                    pulling: "pulling",
                    pushing: "pushing",
                    scrubbing: "scrubbing",
                    twisting: "twisting",
                    lifting: "lifting",
                    jumping: "jumping",
                    other: "other",

                    aggressiveEvents: "aggressiveEvents",
                    hardAcceleration: "hardAcceleration",
                    hardCorner: "hardCorner",
                    hardBrake: "hardBrake",
                    // swerve: "swerve",

                    scores: "scores",
                    lumbarScore: "lumbarScore",
                    metScore: "metScore",

                    nearMissEvents: "nearMissEvents",
                    falling: "falling",
                    slipping: "slipping",
                    tripping: "tripping"
                },
                PRETTY: {
                    idleTime: "Belt Lying On Table",
                    sitting: "Reclined Sitting",
                    standing: "Sitting/Standing",
                    stationaryWork: "Stationary Work",
                    idleDriving: "Stuck On Traffic",
                    lying: "Lying",
                    timeToExitVehicle: "Time To Exit Vehicle",

                    driveTime: "Drive Time",
                    driving: "Driving",
                    indoorDriving: "Indoor Driving",

                    wholeBodyVibration: "Whole Body Vibration",

                    workingFromHeights: "Working From Heights",

                    bend: "Bend",
                    bending: "Bending",

                    twist: "Twisting",

                    overSpeedLimit: "Time Over Speed Limit",

                    workTime: "Work Time",
                    walking: "Walking",
                    running: "Running",
                    walkingUpStairs: "Walking Up Stairs",
                    walkingDownStairs: "Walking Down Stairs",
                    pulling: "Pulling",
                    reaching: "Reaching",
                    pushing: "Pushing",
                    scrubbing: "Scrubbing",
                    twisting: "Twisting",
                    lifting: "Lifting",
                    jumping: "Jumping",
                    other: "Other",

                    aggressiveEvents: "Driving Safety",
                    hardAcceleration: "Hard Acceleration",
                    hardCorner: "Hard Cornering/Swerving",
                    hardBrake: "Hard Braking",
                    // swerve: "Hard Swerving",

                    scores: "Scores",
                    lumbarScore: "Lumbar Score",
                    metScore: "MET Score",

                    nearMissEvents: "Potential Trips & Falls",
                    falling: "Potential Falls",
                    slipping: "Slips",
                    tripping: "Potential Trips"
                }

            },
            BELT_SENSORS: {
                ACTUAL : {
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
                PRETTY : {
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
                    gpsSignalStrength: "PS signal strength",
                    rtcHealth: "RTC Health",
                    sdCardHealth: "SD Card Health",
                    wifiSignalStrength: "Wifi signal strength",
                    gsmSignalStrength: "GSM signal strength",
                    batteryChargePercentage: "Battery charge status",
                    freeMemory: "Free memory available"
                }

            },
            LEADERBOARD_WORK_ACTIVITIES: [
                {
                    id : "work-time",
                    name : "WORK TIME"
                },
                {
                    id : "idle-time",
                    name : "STATIC TIME"
                },
                {
                    id : "walk-time",
                    name : "WALKING"
                },
                {
                    id : "stand-time",
                    name : "SITTING/STANDING"
                },
                // {
                //     id : "drive-time",
                //     name : "DRIVE TIME"
                // },
                // {
                //     id : "walk-upstairs-time",
                //     name : "WALKING UPSTAIRS TIME"
                // },
                // {
                //     id : "walk-downstairs-time",
                //     name : "WALKING DOWNSTAIRS TIME"
                // },
                // {
                //     id : "push-time",
                //     name : "PUSHING TIME"
                // },
                // {
                //     id : "pull-time",
                //     name : "PULLING TIME"
                // },
                {
                    id : "bend-time",
                    name : "BENDING"
                },
                {
                    id : "twist-time",
                    name : "TWISTING"
                }
                // {
                //     id : "scrub-time",
                //     name : "SCRUBBING TIME"
                // },
                // {
                //     id : "jump-time",
                //     name : "JUMPING TIME"
                // }
            ],
            DATES: {
              SERIES_DATE: /*'2016-10-10',*/ '2016-09-30',
              SUMMARY_DATE: /*'2016-10-11',*/ '2016-09-29',
              START_DATE: /*'2016-10-04',*/'2016-09-22',
              DAYS: '7'
            },
            WORK_TYPES: [
            {
              id: 'driver',
              prettyName: "Driver"
            },
            {
              id: 'inHouseWorker',
              prettyName: 'In-House Worker'
            },
            {
              id: 'both',
              prettyName: 'Both'
            }
            ],
            ROLES: [
            {
              id: 'employee',
              prettyName: "Employee"
            },
            {
              id: 'supervisor',
              prettyName: 'Supervisor'
            },
            {
              id: 'risk_manager',
              prettyName: 'Risk Manager'
            },
            {
              id: 'org_admin',
              prettyName: 'Organization Admin'
            }
            ],
            DEVICE_STATES: {
                CREATED:"CREATED",
                ASSIGNED: "ASSIGNED",
                AVAILABLE:"AVAILABLE",
                ALLOCATED:"ALLOCATED",
                DELETED:"DELETED"
            },
            TYPE_DAILY : "daily",
            TYPE_WEEKLY : "weekly",
            TYPE_MONTHLY : "monthly",
            TYPESEGMENTS : ['daily', 'weekly','monthly'],
            RISKMANAGERTREND : ['daily', 'analysis'],
            RISKMANAGERANALYSIS : ['trend', 'jobFunctions'],
            NOTIFICATION_TYPE_CLAIM : 'claim',
            CALL_SUPPORT_TEL : "8647229760",
            DEFAULT_DEVICE_TYPE : "smart",
            RANKSEGMENTS : ['work', 'drive'],
            SAFETYRANKSEGMENTS : ['nearmiss', 'aggressive']

        });

})();
