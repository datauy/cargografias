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
  'countTo',
  'chart.js',
  'angular-d3-cluster'
]).
config(['$routeProvider', function($routeProvider) {
  
  $routeProvider.when('/', {templateUrl: '/angular/partials/home.html', 
    controller: 'homeController'});
  $routeProvider.when('/search', {templateUrl: '/angular/partials/search.html', 
    controller: 'searchController'});
  $routeProvider.when('/search/territory/:territory', {templateUrl: '/angular/partials/search.html', 
    controller: 'searchController'});
  $routeProvider.when('/search/membership/:membership', {templateUrl: '/angular/partials/search.html', 
    controller: 'searchController'});
  $routeProvider.when('/poderometro', {templateUrl: '/angular/partials/poderometro.html', 
    controller: 'powermeterController'});
  $routeProvider.when('/historycompare', {templateUrl: '/angular/partials/comparehistory.html', 
    controller: 'historycompareController'});

  
  $routeProvider.when('/timeline/:ids?', 
    {templateUrl: '/angular/partials/main.html', controller: 'timelineController'});
  $routeProvider.otherwise({redirectTo: '/'});
}]);
cargoApp.run(function(){
	new WOW().init();
})