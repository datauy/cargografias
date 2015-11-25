'use strict';

/* Controllers */
angular.module('cargoApp.controllers')
  .controller('searchController', function($rootScope,  $anchorScroll, $q, $scope,presetsFactory, cargosFactory, $filter, $cookies, $routeParams, $location, $route, $timeout, $http) {

  var instanceName = window.location.pathname.replace(/\/$/, '').replace(/^\//, '').trim();
  instanceName = instanceName || 'cargografias';




    $scope.filterAdvance = {};
    $scope.filterAutoPersonsAdvance = function () {
        $scope.showPresets = false;
        $scope.search = true;
        $scope.autoPersons = cargosFactory.getAutoPersonsAdvance($scope.filterAdvance);
        $scope.showResult = true;
        $scope.started =true;
    };

  
      /**
       * FromDecade
       * @type {number}
       */
      var fromDecade = 1900;
      $scope.message = {
         text: 'hello world!',
         time: new Date()
      };



    $scope.autoPersons = [];

    $scope.activePersons = [];
    $scope.estado = "";
    $scope.search = false;
    $rootScope.observers = [];
    $rootScope.yearObserver = [];
    $rootScope.jerarquimetroObserver = [];
    $scope.filter = "name";
    $scope.showResult = false;

    $scope.showPresets = true;
    var parsedParams;

    $scope.load = function(params, hideAfterClick) {
      // processParameters(params);
      // //light add all persons from url
      // if (parsedParams) {
      //   for (var i = 0; i < parsedParams.length; i++) {
      //     var index = parsedParams[i];
      //     var id = cargosFactory.mapId[index];
      //     $scope.lightAdd(cargosFactory.autoPersons[id], id);
      //   };
      $location.path('/timeline/name-801edb');  
      // }
    }


    $scope.goto = function(p) {

      if (p.person){
        p = p.person;
      }
      $location.path('/timeline/name-' + p.popitID);
      $anchorScroll();
    }

    // Presets

    
    var onDataLoaded = function() {
      
          cargosFactory.calculateRankings();

          $rootScope.estado = "Motor de Visualizacion";
          for (var i = 0; i < $rootScope.observers.length; i++) {
            var observer = $rootScope.observers[i];
            observer();
          };
          $rootScope.estado = "Listo!";
          $rootScope.ready = true;

          if ($routeParams.territory || $routeParams.membership){
            $scope.filterAutoPersonsAdvance();
          }

    };
    $scope.customization= window.customization;

    
    
    if ($routeParams.territory){
      $scope.filterAdvance.territory = $routeParams.territory;
    }
    if ($routeParams.membership){
      $scope.filterAdvance.jobTitle = $routeParams.membership;
    }
       
    cargosFactory.load($scope, onDataLoaded, $rootScope);

     /**
       * Get all Organizations
       * @returns {*}
       */
      $scope.getPersonsCount = function() {
        return cargosFactory.autoPersons.length;
      }

       /**
       * Get all Organizations
       * @returns {*}
       */
      $scope.getMembershipCount = function() {
        return cargosFactory.membershipsCount;
      }
       /**
       * Get all Organizations
       * @returns {*}
       */
      $scope.getMembershipRanking = function() {
        return cargosFactory.membershipRanking;
      }

      /**
       * Get all Organizations
       * @returns {*}
       */
      $scope.getPersonRanking = function() {
        return cargosFactory.personRanking;
      }
      /**
       * Get all Organizations
       * @returns {*}
       */
      $scope.getTerritoryRanking = function() {
        return cargosFactory.territoryRanking;
      }

       /**
       * Get all Organizations
       * @returns {*}
       */
      $scope.getMinYear = function() {
        return cargosFactory.minYear;
      }
      
       /**
       * Get all Organizations
       * @returns {*}
       */
      $scope.getMaxYear = function() {
        return cargosFactory.maxYear;
      }
      
    

      /**
       * Get all Organizations
       * @returns {*}
       */
      $scope.getOrganizations = function() {
        return cargosFactory.getOrganizations();
      }
      /**
       * Get all Organizations
       * @returns {*}
       */
      $scope.getTerritories = function() {
        return cargosFactory.getTerritories();
      }

      /**
       * get All JobTitles
       * @returns {*}
       */
      $scope.getJobTitle = function() {
        return cargosFactory.getJobTitle();
      }

      /**
       * Get decades
       * @returns {*}
       */
      var decades = [];
      $scope.getDecades = function() {
        if (decades.length === 0){
          decades = cargosFactory.getDecades(fromDecade);;
        }
        return decades;
      }






  });