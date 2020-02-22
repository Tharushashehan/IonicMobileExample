(function() {
    'use strict';
    /* global angular
    */
   angular.module('modjoul-mobile.utilities')
        .service('AuthInterceptor', ['$injector', '$localStorage', '$window',
            function($injector, $localStorage, $window) {

                return {
                    'response' : function(response) {
                        return response;
                    },
                    'responseError' : function(rejection) {
                        if(rejection.config.method === "GET"
                            && (rejection.status === 401 || rejection.status === 403)) {
                            var $state = $injector.get("$state");
                            var $ionicHistory = $injector.get("$ionicHistory");
                            var $ionicLoading = $injector.get("$ionicLoading");
                            $window.localStorage.clear();
                            $ionicHistory.clearCache();
                            $ionicHistory.clearHistory();
                            $ionicLoading.hide();

                            $localStorage.$reset();
                            if(!$localStorage.auth_error_shown) {
                                $localStorage.auth_error_shown = true;
                                $state.go('login');
                            }
                            console.log("Unauthorized to proceed");
                            throw rejection;

                        } else {
                            throw rejection;
                        }
                    }
                };
       }]);
})();
