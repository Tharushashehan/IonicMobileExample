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
        ProfileServiceMock;


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

       ProfileServiceMock = {
         ProfileByUserID: jasmine.createSpy('ProfileByUserID spy')
                      .and.returnValue(deferredProfile.promise)
       };

       controller = $controller('EmployeeProfileCtrl2', {
                      '$scope': $scope,
                      'ProfileService': ProfileServiceMock }
                   );
    }));

    describe('#doRefresh', function() {

        // Call doLogin on the Controller
        beforeEach(inject(function(_$localStorage_) {
            $localStorage = _$localStorage_;
            $localStorage.orgId = "fedex";
            $localStorage.userId = "UID001";
            controller.serviceParams = {};
            controller.orgId = $localStorage.orgId;
            controller.userId = $localStorage.userId;
            $scope.doRefresh();
        }));

        it('should call ProfileByUserID on ProfileService', function() {
            expect(ProfileServiceMock.ProfileByUserID).toHaveBeenCalledWith({}, 'fedex', 'UID001');
        });

        describe('when the get ProfileByUserID is executed,', function() {

            it('If the request succeeds', function() {
                // $httpBackend.expectGET('js/Employee/Productivity/IdleTime/idletime.html').respond(200, '');
                // $httpBackend.expectGET('js/Employee/Productivity/productivity.html').respond(200, '');
                // $httpBackend.expectGET('js/Employee/Scorecard/scorecard.html').respond(200, '');
                // $httpBackend.expectGET('templates/employee_side_menu.html').respond(200, '');
                // $httpBackend.expectGET('js/Common/Login/login.html').respond(200, '');
                // Mock the response from ProfileService
                deferredProfile.resolve(
                  { status:200,
                    data:{
                    "firstName": "Brandon",
                    "lastName": "March",
                    "email": "brandon@modjoul.com",
                    "age": 45,
                    "locationId": "LID001",
                    "dateOfBirth": "05-13-1971",
                    "address": {
                      "streetName": "Sloan Street",
                      "city": "Clemson",
                      "state": "SC",
                      "postalCode": "29002"
                    },
                    "orgName": "Fedex",
                    "orgId": "fedex",
                    "employeeId": "8004784",
                    "role": "employee",
                    "job": "Warehouse Associate",
                    "isEmployee": true,
                    "isSupervisor": false,
                    "supervisorId": "SID001",
                    "supervisorName": "Roger Moore",
                    "surveyCompleted": true,
                    "workType": "inHouseWorker",
                    "isRegistered": true,
                    "profilePhoto": "",
                    "profileMimeType": "image/png",
                    "passwordToken": "1aa43f10-28db-11e7-8809-3b8e2070db7c",
                    "shift": {
                      "startTime": "2:00",
                      "endTime": "21:00"
                    },
                    "deletedBy": {},
                    "userId": "UID001",
                    "trend": {
                      "productivity": {
                        "trend": 0
                      },
                      "safety": {
                        "trend": 0
                      }
                    }
                  }});
                $scope.$apply();
                expect($scope.profile).not.toBe(undefined);
                expect($scope.profile.firstName).toEqual("Brandon");
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
