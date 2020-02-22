/* global angular */
(function() {
    'use strict';
    angular.module('modjoul-mobile.services')
        .factory('LeaderboardService', function($location, $log, apiHost, RestClient) {

            var getProductivityLeaderboard = function(orgId, userId) {

                return RestClient.get(apiHost + '/organizations/' + orgId + '/supervisors/' + userId + '/leaderboard?field=productivity')
                    .then(function(response){
                        return response;
                    }, function(err){
                        throw err;
                    });
            };

            var getProductivityLeaderboardByItem = function(orgId, userId, item, period) {

                return RestClient.get(apiHost + '/organizations/' + orgId + '/supervisors/' + userId + '/leaderboard?field=' + item + "&period="+ period)
                    .then(function(response){
                        return response;
                    }, function(err){
                        throw err;
                    });
            };

            var getSafetyLeaderboard = function(orgId, userId) {

                return RestClient.get(apiHost + '/organizations/' + orgId + '/supervisors/' + userId + '/leaderboard?field=safety')
                    .then(function(response){
                        return response;
                    }, function(err){
                        throw err;
                    });
            };

          var getLeaderboardWithOptions = function(orgId, userId, optionString) {

            return RestClient.get(apiHost + '/organizations/' + orgId + '/supervisors/' + userId + '/leaderboard?field=' + optionString)
              .then(function(response){
                return response;
              }, function(err){
                throw err;
              });
          };


            return {
                getProductivityLeaderboard : function(orgId, userId){
                    return getProductivityLeaderboard(orgId, userId);
                },
                getProductivityLeaderboardByItem : function(orgId, userId,item, period){
                    return getProductivityLeaderboardByItem(orgId, userId,item, period);
                },
                getSafetyLeaderboard : function(orgId, userId){
                    return getSafetyLeaderboard(orgId, userId);
                },
                getLeaderBoardAggressiveEvents : function (orgId, userId){
                    return getLeaderboardWithOptions (orgId, userId, 'aggressive-events-rate');
                },
                getLeaderBoardNearMissEvents : function (orgId, userId){
                  return getLeaderboardWithOptions (orgId, userId, 'near-miss-events-rate');
                },
                getLeaderBoardIdleTime : function (orgId, userId){
                  return getLeaderboardWithOptions (orgId, userId, 'idle-time');
                },
                getLeaderBoardDriveTime : function (orgId, userId){
                  return getLeaderboardWithOptions (orgId, userId, 'drive-time');
                },
                getLeaderBoardWorkTime : function (orgId, userId){
                  return getLeaderboardWithOptions (orgId, userId, 'work-time-percentage');
                },
                getLeaderBoardEffectivePay : function (orgId, userId){
                  return getLeaderboardWithOptions (orgId, userId, 'effective-pay-percentage');
                }
            };
        });
})();

