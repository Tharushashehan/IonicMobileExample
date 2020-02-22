// Modjoul Mobile
/* global angular */
/* global window */
/* global cordova */
/* global StatusBar */
/* global ionic */

angular.module('modjoul-mobile', ['ionic', 'ui.router', 'modjoul-mobile.controllers', 'modjoul-mobile.services',
    'modjoul-mobile.utilities', 'modjoul-mobile.directives', 'modjoul-mobile.constants', 'ngCordova',
    'angularMoment', 'ionic-datepicker', 'naif.base64' ,'ngStorage' ,'ti-segmented-control', 'rzModule'
])

    .run(function ($ionicPlatform,$cordovaDialogs, $rootScope, $localStorage) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.Keyboard) {
                window.Keyboard.hideFormAccessoryBar(false);
            }
            if (window.StatusBar) {
                // Set the statusbar to use the default style, tweak this to
                // remove the status bar on iOS or change it to use white instead of dark colors.
                StatusBar.styleDefault();
            }

        });

        $ionicPlatform.on("resume", function() {
          if (ionic.Platform.isAndroid()  || ionic.Platform.isIOS()) {
            cordova.plugins.notification.badge.set(0);
          }
        });

        $ionicPlatform.on("pause", function() {
          if (ionic.Platform.isAndroid()  || ionic.Platform.isIOS()) {
            cordova.plugins.notification.badge.set(0);
          }
        });

        if ($localStorage.orgConfigs) {
          $rootScope.orgConfigs = $localStorage.orgConfigs;
        }
        else {
          $rootScope.orgConfigs = {};
        }

    })

    .constant('$ionicLoadingConfig', {
        template: "<ion-spinner class='spinner-energized'></ion-spinner><br>Please wait..."
    })

    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider,
                      ionicDatePickerProvider, moment, $logProvider, $httpProvider) {


        //$httpProvider.defaults.timeout = 3000;

        $logProvider.debugEnabled(true);

        var currentDate = moment();
        var maxDate = currentDate;
        var lastMonth = moment().subtract(1, "days").subtract(12, "months");

        var datePickerObj = {
            inputDate: new Date(currentDate.format('YYYY'), currentDate.format('M') - 1, currentDate.format('D')),
            titleLabel: 'Select a Date',
            setLabel: 'Set',
            todayLabel: 'Today',
            closeLabel: 'Close',
            mondayFirst: true,
            weeksList: ["S", "M", "T", "W", "T", "F", "S"],
            monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
            templateType: 'popup',
            from: new Date(lastMonth.format('YYYY'), lastMonth.format('M') - 1, lastMonth.format('D')),
            to: new Date(maxDate.format('YYYY'), maxDate.format('M') - 1, maxDate.format('D')),
            showTodayButton: false,
            dateFormat: 'dd MMMM yyyy',
            closeOnSelect: true,
            disableWeekdays: []
        };
        ionicDatePickerProvider.configDatePicker(datePickerObj);

        $stateProvider.state('employee', {
            url: '/employee',
            abstract: true,
            templateUrl: 'templates/employee_side_menu.html',
            controller: 'EmployeeProfileCtrl'
        })

            .state('employee.scorecard', {
                cache: false,
                url: '/scorecard',
                views: {
                    'default-view': {
                        templateUrl: 'js/Employee/Scorecard/scorecard.html',
                        controller: 'ScorecardCtrl'
                    }
                }
            })

            .state('employee.productivity', {
                url: '/productivity',
                views: {
                    'default-view': {
                        templateUrl: 'js/Employee/Productivity/productivity.html',
                        controller: 'ProductivityCtrl'
                    }
                }
            })


            .state('employee.productivity-worktime', {
                cache: false,
                url: '/productivity/worktime',
                views: {
                    'default-view': {
                        templateUrl: 'js/Employee/Productivity/WorkTime/worktime.html',
                        controller: 'WorkTimeCtrl'
                    }
                }
            })

            .state('employee.safety', {
                url: '/safety',
                views: {
                    'default-view': {
                        templateUrl: 'js/Employee/Safety/safety.html',
                        controller: 'SafetyCtrl'
                    }
                }
            })

            .state('employee.safety-work', {
                url: '/safety-work',
                views: {
                    'default-view': {
                        templateUrl: 'js/Employee/Safety/AggressiveEventsWork/work.html',
                        controller: 'SafetyWorkCtrl'
                    }
                }
            })

            .state('employee.safety-driving', {
                url: '/safety-driving',
                views: {
                    'default-view': {
                        templateUrl: 'js/Employee/Safety/AggressiveEventsDriving/driving.html',
                        controller: 'SafetyDrivingCtrl'
                    }
                }
            })

            .state('employee.safety-indoor-driving', {
                url: '/safety-indoor-driving',
                views: {
                    'default-view': {
                        templateUrl: 'js/Employee/Safety/IndoorDriving/indoorDriving.html',
                        controller: 'SafetyIndoorDrivingCtrl'
                    }
                }
            })


            .state('employee.safety-twisting', {
                url: '/safety-twisting',
                views: {
                    'default-view': {
                        templateUrl: 'js/Employee/Safety/Twisting/twisting.html',
                        controller: 'SafetyTwistingCtrl'
                    }
                }
            })

            .state('employee.safety-workingHeights', {
                url: '/safety-working-heights',
                views: {
                    'default-view': {
                        templateUrl: 'js/Employee/Safety/WorkingHeights/working-heights.html',
                        controller: 'WorkingHeightsCtrl'
                    }
                }
            })

            .state('employee.safety-bends', {
                url: '/safety-bends',
                views: {
                    'default-view': {
                        templateUrl: 'js/Employee/Safety/Bending/bends.html',
                        controller: 'SafetyBendsCtrl'
                    }
                }
            })


            .state('employee.safety-temperature', {
                url: '/safety-temperature',
                views: {
                    'default-view': {
                        templateUrl: 'js/Employee/Safety/Temperature/temperature.html',
                        controller: 'SafetyTemperatureCtrl'
                    }
                }
            })


            .state('employee.profile', {
                url: '/profile',
                views: {
                    'default-view': {
                        templateUrl: 'js/Employee/Profile/profile.html',
                        controller: 'EmployeeProfileCtrl2'
                    }
                }
            })

            .state('employee.settings', {
                url: '/settings',
                views: {
                    'default-view': {
                        templateUrl: 'js/Employee/Settings/settings.html',
                        controller: 'SettingsCtrl'
                    }
                }
            })

            .state('employee.device', {
                cache: false,
                url: '/device',
                views: {
                    'default-view': {
                        templateUrl: 'js/Employee/Device/device.html',
                        controller: 'DeviceCtrl'
                    }
                }
            })


            .state('employee.breadcrumb', {
                url: '/breadcrumb',
                views: {
                    'default-view': {
                        templateUrl: 'js/Employee/Breadcrumb/breadcrumb.html',
                        controller: 'BreadcrumbCtrl'
                    }
                }
            })


            .state('supervisor', {
                url: '/supervisor',
                abstract: true,
                templateUrl: 'templates/supervisor_side_menu.html',
                controller: 'SupervisorProfileCtrl'
            })

            .state('supervisor.now', {
                url: '/now',
                views: {
                    'default-view': {
                        templateUrl: 'js/Supervisor/Now/now.html',
                        controller: 'SupervisorNowController'
                    }
                }
            })


            .state('supervisor.productivity-rankings', {
                url: '/productivity-rankings',
                views: {
                    'default-view': {
                        templateUrl: 'js/Supervisor/Productivity/rankings.html',
                        controller: 'ProductivityRankingsController'
                    }
                }
            })

            .state('supervisor.safety-rankings', {
                url: '/safety-rankings',
                views: {
                    'default-view': {
                        templateUrl: 'js/Supervisor/Safety/rankings.html',
                        controller: 'SafetyRankingsController'
                    }
                }
            })


            .state('supervisor.breadcrumb', {
                url: '/supervisor-breadcrumb',
                views: {
                    'default-view': {
                        templateUrl: 'js/Supervisor/Breadcrumb/breadcrumb.html',
                        controller: 'SupervisorBreadcrumbCtrl'
                    }
                }
            })

            .state('supervisor.work', {
                url: '/supervisor-work',
                views: {
                    'default-view': {
                        templateUrl: 'js/Supervisor/SupervisorWorkTime/worktime.html',
                        controller: 'SupervisorWorkTimeCtrl'
                    }
                }
            })

            .state('supervisor.profile', {
                url: '/supervisor-profile',
                views: {
                    'default-view': {
                        templateUrl: 'js/Supervisor/Profile/profile.html',
                        controller: 'SupervisorProfileCtrl2'
                    }
                }
            })


            .state('supervisor.scorecard', {
                cache: false,
                url: '/supervisor-emp-scorecard',
                views: {
                    'default-view': {
                        templateUrl: 'js/Supervisor/Scorecard/scorecard.html',
                        controller: 'EmployeeScorecardController'
                    }
                },
                params: {
                    obj: null
                }

            })


            .state('supervisor.feed', {
                url: '/supervisor-feed',
                views: {
                    'default-view': {
                        templateUrl: 'js/Supervisor/Feed/feed.html',
                        controller: 'FeedController'
                    }
                }

            })

            .state('supervisor.user-management', {
                url: '/user-management',
                views: {
                    'default-view': {
                        templateUrl: 'js/Supervisor/Users/users.html',
                        controller: 'UserController'
                    }
                }
            })

            .state('supervisor.notifications', {
                url: '/notifications',
                views: {
                    'default-view': {
                        templateUrl: 'js/Supervisor/Notifications/notifications.html',
                        controller: 'NotificationsController'
                    }
                }
            })

            .state('supervisor.statistics', {
                url: '/statistics',
                views: {
                    'default-view': {
                        templateUrl: 'js/Common/Statistics/statistics.html',
                        controller: 'StatisticsController'
                    }
                }
            })


            .state('risk-manager', {
                url: '/risk-manager',
                abstract: true,
                templateUrl: 'templates/risk_manager_side_menu.html',
                controller: 'RiskManagerProfileCtrl'
            })

            .state('risk-manager.dashboard', {
                url: '/dashboard',
                views: {
                    'default-view': {
                        templateUrl: 'js/RiskManager/Dashboard/dashboard.html',
                        controller: 'DashboardController'
                    }
                }
            })


            .state('risk-manager.work', {
                url: '/work',
                views: {
                    'default-view': {
                        templateUrl: 'js/RiskManager/Work/work.html',
                        controller: 'RiskManagerWorkController'
                    }
                }
            })




            .state('risk-manager.drive', {
                url: '/drive',
                views: {
                    'default-view': {
                        templateUrl: 'js/RiskManager/Drive/drive.html',
                        controller: 'RiskManagerDriveController'
                    }
                }
            })

            .state('risk-manager.profile', {
                url: '/profile',
                views: {
                    'default-view': {
                        templateUrl: 'js/RiskManager/Profile/profile.html',
                        controller: 'RiskManagerProfileCtrl2'
                    }
                }
            })


            .state('risk-manager.user-management', {
                url: '/user-management',
                views: {
                    'default-view': {
                        templateUrl: 'js/RiskManager/Users/users.html',
                        controller: 'UserController'
                    }
                }
            })

            .state('risk-manager.claims', {
                url: '/claims',
                views: {
                    'default-view': {
                        templateUrl: 'js/RiskManager/Claims/claims.html',
                        controller: 'ClaimsController'
                    }
                }
            })
            .state('risk-manager.notifications', {
                url: '/notifications',
                views: {
                    'default-view': {
                        templateUrl: 'js/RiskManager/Notifications/notifications.html',
                        controller: 'NotificationsController'
                    }
                }
            })

            .state('risk-manager.statistics', {
                url: '/statistics',
                views: {
                    'default-view': {
                        templateUrl: 'js/Common/Statistics/statistics.html',
                        controller: 'StatisticsController'
                    }
                }
            })


            .state('org-admin', {
                url: '/org-admin',
                abstract: true,
                templateUrl: 'templates/orgadmin_side_menu.html',
                controller: 'OrgAdminProfileCtrl'
            })

            .state('org-admin.locations', {
                url: '/locations',
                views: {
                    'default-view': {
                        templateUrl: 'js/OrgAdmin/Locations/locations.html',
                        controller: 'LocationController'
                    }
                }
            })

            .state('org-admin.statistics', {
                url: '/statistics',
                views: {
                    'default-view': {
                        templateUrl: 'js/Common/Statistics/statistics.html',
                        controller: 'StatisticsController'
                    }
                }
            })

            .state('org-admin.users', {
                url: '/users',
                views: {
                    'default-view': {
                        templateUrl: 'js/OrgAdmin/Users/users.html',
                        controller: 'UsersController'
                    }
                }
            })

            .state('org-admin.add-users', {
                url: '/add-users',
                views: {
                    'default-view': {
                        templateUrl: 'js/OrgAdmin/Users/AddUser/addUser.html',
                        controller: 'UserAdditionController'
                    }
                }
            })

            .state('org-admin.employees', {
                url: '/employees',
                views: {
                    'default-view': {
                        templateUrl: 'js/OrgAdmin/Users/Employees/employee.html',
                        controller: 'EmployeeController'
                    }
                }
            })


            .state('org-admin.supervisors', {
                url: '/supervisors',
                views: {
                    'default-view': {
                        templateUrl: 'js/OrgAdmin/Users/Supervisor/supervisor.html',
                        controller: 'SupervisorController'
                    }
                }
            })

            .state('org-admin.devices', {
              url: '/devices',
              views: {
                'default-view': {
                  templateUrl: 'js/OrgAdmin/Devices/devices.html',
                  controller: 'OrgAdminDeviceCtrl'
                }
              }
            })

            .state('org-admin.gpsConfiguration', {
                url: '/gps-configuration',
                views: {
                    'default-view': {
                        templateUrl: 'js/OrgAdmin/GPSConfiguration/gpsConfiguration.html',
                        controller: 'GPSConfigurationCtrl'
                    }
                }
            })

            .state('org-admin.profile', {
                url: '/profile',
                views: {
                    'default-view': {
                        templateUrl: 'js/OrgAdmin/Profile/profile.html',
                        controller: 'OrgAdminProfileCtrl2'
                    }
                }
            })

            .state('org-admin.change-details', {
              url: '/change-details',
              views: {
                'default-view': {
                  templateUrl: 'js/OrgAdmin/ChangeDetails/changeDetails.html',
                  controller: 'OrgAdminChangeDetailsCtrl'
                }
              }
            })

            .state('org-admin.configureMetrics', {
            url: '/configureMetrics',
            views: {
              'default-view': {
                templateUrl: 'js/OrgAdmin/ConfigureMetrics/configureMetrics.html',
                controller: 'ConfigureMetricsCtrl'
              }
            }
          })

            .state('super-admin', {
                url: '/super-admin',
                abstract: true,
                templateUrl: 'templates/superadmin_side_menu.html',
                controller: 'SuperAdminProfileCtrl'
            })

            .state('super-admin.organizations', {
                url: '/organizations',
                views: {
                    'default-view': {
                        templateUrl: 'js/SuperAdmin/Organizations/organizations.html',
                        controller: 'OrganizationsController'
                    }
                }
            })

            .state('super-admin.org-admins', {
                url: '/org-admins',
                params: {
                    obj: null
                },
                views: {
                    'default-view': {
                        templateUrl: 'js/SuperAdmin/OrgAdmins/orgAdmins.html',
                        controller: 'OrgAdminsController'
                    }
                }
            })


            .state('super-admin.device-manufacturers', {
                url: '/device-manufacturers',
                views: {
                    'default-view': {
                        templateUrl: 'js/SuperAdmin/DeviceManufacturers/deviceManufacturers.html',
                        controller: 'DeviceManufacturersController'
                    }
                }
            })

            .state('super-admin.data-visibility', {
                url: '/data-visibility',
                views: {
                    'default-view': {
                        templateUrl: 'js/SuperAdmin/DataVisibility/dataVisibility.html',
                        controller: 'DataVisibilityController'
                    }
                }
            })


            .state('super-admin.profile', {
                url: '/profile',
                views: {
                    'default-view': {
                        templateUrl: 'js/SuperAdmin/Profile/profile.html',
                        controller: 'SuperAdminProfileCtrl2'
                    }
                }
            })


            .state('device-manufacturer', {
                url: '/device-manufacturer',
                abstract: true,
                templateUrl: 'templates/device_manufacturer_side_menu.html',
                controller: 'DeviceManufacturerProfileCtrl'
            })

            .state('device-manufacturer.devices', {
                url: '/devices',
                views: {
                    'default-view': {
                        templateUrl: 'js/DeviceManufacturer/Devices/devices.html',
                        controller: 'DeviceController'
                    }
                }
            })


            .state('device-manufacturer.device-types', {
                url: '/device-types',
                views: {
                    'default-view': {
                        templateUrl: 'js/DeviceManufacturer/DeviceTypes/deviceTypes.html',
                        controller: 'DeviceTypesController'
                    }
                }
            })

            .state('device-manufacturer.device-settings', {
                url: '/device-settings',
                views: {
                    'default-view': {
                        templateUrl: 'js/DeviceManufacturer/DeviceSettings/deviceSettings.html',
                        controller: 'DeviceSettingsCtrl'
                    }
                }
            })

            .state('device-manufacturer.administration', {
                url: '/administration',
                views: {
                    'default-view': {
                        templateUrl: 'js/DeviceManufacturer/Administration/administration.html',
                        controller: 'AdminController'
                    }
                }
            })

            .state('device-manufacturer.dashboard', {
                url: '/dashboard',
                views: {
                    'default-view': {
                        templateUrl: 'js/DeviceManufacturer/Dashboard/dashboard.html',
                        controller: 'DashboardCtrl'
                    }
                }
            })

            .state('device-manufacturer.profile', {
                url: '/profile',
                views: {
                    'default-view': {
                        templateUrl: 'js/DeviceManufacturer/Profile/profile.html',
                        controller: 'SuperAdminProfileCtrl2'
                    }
                }
            })


            .state('login', {
                url: '/login',
                templateUrl: 'js/Common/Login/login.html',
                controller: 'LoginCtrl'
            })

            .state('logout', {
              url: '/logout',
              templateUrl: 'js/Common/Login/logout.html',
              controller: 'LogoutCtrl'
            });


        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login');

        $ionicConfigProvider.tabs.position('bottom');

        $ionicConfigProvider.views.swipeBackEnabled(false);

        $httpProvider.interceptors.push('AuthInterceptor');

    });
