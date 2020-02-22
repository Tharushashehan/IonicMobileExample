/* global angular */

(function () {
    'use strict';
    angular.module("modjoul-mobile.constants", []);
    angular.module("modjoul-mobile.constants")

    //Prod
        .constant("apiHost", "https://api.modjoul.com/v1")
        .constant("apiHost2", "https://api.modjoul.com/v2");
    //Dev
    //     .constant("apiHost", "http://modjoul-api-dev.us-east-1.elasticbeanstalk.com/v1")
    //     .constant("apiHost2", "http://modjoul-api-dev.us-east-1.elasticbeanstalk.com/v2");
    //QA
    //  .constant("apiHost", "http://localhost:3001/v1");


})();
