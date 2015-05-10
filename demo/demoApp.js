angular.module('facebookUtilsDemo', ['facebookUtils', 'ngRoute'])
  .constant('facebookConfigSettings', {
    'routingEnabled' : true,
    'channelFile'    : 'channel.html',
    'appID'          : '872985136101593'
  })
  .config(function($routeProvider) {
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

    $rootScope.$on('fbLoginSuccess', function(name, response) {
      // facebookUser.then(function(user) {
      //   user.api('/me').then(function(response) {
      //     $rootScope.loggedInUser = response;
      //   });
      // });
      hungAPI.login(response.authResponse).then(function(response){
        alert(res);
      });
    });

    $rootScope.$on('fbLogoutSuccess', function() {
      $scope.$apply(function() {
        $rootScope.loggedInUser = {};
      });
    });
  })
  .factory('hungAPI', function($http){

    return {
      login: login
    };
    
    function login(credentials){
      var payload = {
        userId: credentials.userID,
        accessToken: credentials.accessToken
      };

      return $http.post('http://localhost:3000/api/auth/fb', payload);
    }
  });
