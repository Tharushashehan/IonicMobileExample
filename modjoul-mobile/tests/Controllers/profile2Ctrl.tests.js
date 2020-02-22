/* global describe */
/* global beforeEach */
/* global inject */
/* global it */
/* global module */
/* global expect */
/* global $rootScope */
/* global scopeMock */
/* global jasmine */
/* global $scope */
/* global deferredProfile */
/* global $localStorage*/
/*global $httpBackend*/

describe('ProfileController', function() {

    var controller,
        deferredProfile,
        TemperatureServiceMock,
        ionicDatePickerMock;

    //  Load the App Module
    beforeEach(module('modjoul-mobile'));
    // beforeEach(module('modjoul-mobile.controllers'));

    // disable template caching
    beforeEach(module(function($provide, $urlRouterProvider) {
        $provide.value('$ionicTemplateCache', function(){} );
        $urlRouterProvider.deferIntercept();
    }));

    // Instantiate the Controller and Mocks
    beforeEach(inject(function($controller,$rootScope,$q, $injector) {
       $scope = $rootScope.$new();
       $httpBackend = $injector.get('$httpBackend');
       deferredProfile = $q.defer();

       TemperatureServiceMock = {
         getTemperatureSummary: jasmine.createSpy('ProfileByUserID spy')
                      .and.returnValue(deferredProfile.promise)
       };

       ionicDatePickerMock = jasmine.createSpyObj('ionicDatePicker spy', ['openDatePicker']);


       controller = $controller('EmployeeProfileCtrl', {
                      '$scope': $scope,
                      'ionicDatePicker': ionicDatePickerMock,
                      'TemperatureService': TemperatureServiceMock}
                   );
    }));

    describe('#doRefresh', function() {

        // Call doLogin on the Controller
        beforeEach(inject(function(_$localStorage_) {
            $localStorage = _$localStorage_;
            $localStorage.selectedDate = "2016-10-10";
            $localStorage.orgId = "fedex";
            $localStorage.userId = "UID001";
            controller.serviceParams = {period: $localStorage.selectedDate};
            controller.orgId = $localStorage.orgId;
            controller.userId = $localStorage.userId;
            $scope.doRefresh();
        }));

        it('should call getTemperatureSummary on TemperatureServiceMock', function() {
            expect(TemperatureServiceMock.getTemperatureSummary).toHaveBeenCalledWith({period: "2016-10-10"}, 'fedex', 'UID001');
        });

        describe('when the get TemperatureSummary is executed,', function() {

            it('If the request succeeds', function() {
                // $httpBackend.expectGET('js/Employee/Productivity/IdleTime/idletime.html').respond(200, '');
                // $httpBackend.expectGET('js/Employee/Productivity/productivity.html').respond(200, '');
                // $httpBackend.expectGET('js/Employee/Scorecard/scorecard.html').respond(200, '');
                // $httpBackend.expectGET('templates/employee_side_menu.html').respond(200, '');
                // $httpBackend.expectGET('js/Common/Login/login.html').respond(200, '');
                
                // Mock the response from ProfileService
                deferredProfile.resolve(
                  { status:200,
                    data:{"period": "2016-10-12",
                          "metrics": {
                            "AmbientTemperature": 30,
                            "AmbientHumidity": 70
                          },
                          "units": {
                            "AmbientTemperature": "F",
                            "AmbientHumidity": "%"
                          }}

                });
                $scope.$apply();
                expect($scope.temperature).not.toBe(undefined);
                expect($scope.temperature.AmbientHumidity).toEqual(70);
            });

            // it('if unsuccessful, should show a popup', function() {
            //
            //     // Mock the login response from DinnerService
            //     deferredProfile.reject();
            //     $rootScope.$digest();
            //
            //     expect(ionicPopupMock.alert).toHaveBeenCalled();
            // });
        });
    });
});
