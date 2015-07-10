var mob = angular.module("mob", ['ui.router']);
mob.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('gig', {
      url: "/gig/:id",
      templateUrl: "views/onegig.html",
      controller: "GigCtrl"
    })
    .state('login', {
      url: "/login",
      templateUrl: "views/loginUser.html",
      controller: "LoginCtrl"
    })
    .state('adduser', {
      url: "/createUser",
      templateUrl: "views/createUser.html",
      controller: "CreateUserCtrl"
    })
    .state('list', {
      url: "/",
      templateUrl: "views/listView.html",
      controller: "listCtrl"
    })
    .state('create', {
      url: "/create",
      templateUrl: "views/create.html",
      controller: "CreateCtrl"
    });
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
})
.constant('BASE_URL', 'https://mob-squad.herokuapp.com')
.factory('Gig', function($http, BASE_URL) {
  return {
    getAllGigs: function() {
      return $http.get(BASE_URL + '/api/services');
    },
    getOneGig: function(service_id) {
      return $http.get(BASE_URL + '/api/services/' + service_id);
    },
    postGig: function(service) {
      return $http.post(BASE_URL + '/api/services', service);
    },
    createUser: function(user) {
      return $http.post(BASE_URL + '/api/users', user);
    }
  }
})
.controller('NavCtrl', function($scope, $state) {})
.controller('CreateUserCtrl', function() {
  $scope.createUser = function() {
    console.log($scope.user);
  }
})
.controller('LoginCtrl', function() {
  $scope.loginUser = function() {
    console.log($scope.user);
  }
})
.controller('GigCtrl', function($scope, $state, Gig) {
  var service_id = $state.params.id;
  Gig.getOneGig(service_id)
  .success(function(data){
    $scope.service = data;
  })
  .catch(function(error){
    console.log(error);
  });
})
.controller('CreateCtrl', function($scope, Gig) {
  $scope.submit = function() {
    Gig.postGig($scope.service)
    .success(function(data) {
      $scope.service = {};
      alert('Donation request received!');
    }).catch(function(error) {
      console.error(error);
    })
  }
})
.controller('listCtrl', function($scope, Gig) {
  Gig.getAllGigs()
  .success(function(data) {
    console.log(data);
    $scope.services = data;
  }).catch(function(error) {
    console.log(error);
  })
})
