angular.module('facebookUtilsDemo', ['facebookUtils', 'ngRoute'])
  .constant('facebookConfigSettings', {
    'routingEnabled' : true,
    'channelFile'    : 'channel.html',
    'appID'          : '872985136101593'
  })
  .config(function($routeProvider, $httpProvider) {

    $httpProvider.defaults.useXDomain = true;

    $routeProvider.when('/', {
      templateUrl : 'demo/partials/main.html',
      controller  : angular.noop
    })
    .when('/private', {
      templateUrl : 'demo/partials/private.html',
      controller  : angular.noop,
      needAuth    : true
    })
    .otherwise({
      redirectTo  : '/'
    });
  })
  .controller('RootCtrl', function($rootScope, $scope, facebookUser, hungAPI) {
    $rootScope.loggedInUser = {};

    $scope.fireAway = function(){
      hungAPI.login().then(function(response){
        hungAPI.setAPIToken(response.data.accessToken);
      });
    };

    $scope.fireUsers = function(){
      hungAPI.getUsers().then(function(res){
        alert(res);
      });
    };

    $rootScope.$on('fbLoginSuccess', function(name, response) {
      // facebookUser.then(function(user) {
      //   user.api('/me').then(function(response) {
      //     $rootScope.loggedInUser = response;
      //   });
      // });
      hungAPI.setAuthInfo(response.authResponse);
    });

    $rootScope.$on('fbLogoutSuccess', function() {
      $scope.$apply(function() {
        $rootScope.loggedInUser = {};
      });
    });
  })
  .factory('hungAPI', function($http){

    var auth_info;
    var api_token;

    return {
      login: login,
      setAuthInfo: setAuthInfo,
      getUsers: getUsers,
      setAPIToken:setAPIToken
    };

    function setAPIToken(apiToken){
      api_token = apiToken;
    }

    function setAuthInfo(authInfo){
      auth_info = authInfo;
    }
    
    function login(){
      var payload = {
        userId: auth_info.userID,
        accessToken: auth_info.accessToken || false
      };

      return $http.post('http://localhost:3000/api/auth', payload);
    }

    function getUsers(){
      var config = {
          method: 'GET', 
          url: 'http://localhost:3000/api/users', 
          headers: {
            'x-auth': api_token
          }
      };
      return $http(config);
    }
  });
