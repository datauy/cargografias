'use strict';

angular.module('cargoApp.controllers', []);
angular.module('cargoApp.directives', []);

// Declare app level module which depends on filters, and services
var cargoApp = angular.module('cargoApp', [
  'ngRoute',
  'cargoApp.filters',
  'cargoApp.factories',
  'cargoApp.directives',
  'cargoApp.controllers',
  'angularMoment',
  'ngCookies',
  'countTo'
]).
config(['$routeProvider', function($routeProvider) {
  
  $routeProvider.when('/', {templateUrl: '/angular/partials/main.html', controller: 'homeController'});
  $routeProvider.when('/timeline/:ids?', {templateUrl: '/angular/partials/main.html', controller: 'timeLineController'});
  $routeProvider.otherwise({redirectTo: '/'});
}]);
cargoApp.run(function(){
	new WOW().init();
})