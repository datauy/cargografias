'use strict';

/* Controllers */
angular.module('cargoApp.controllers')
  .controller('homeController', function($rootScope,$anchorScroll, $q, $scope,presetsFactory, cargosFactory, $filter, $cookies, $routeParams, $location, $route, $timeout, $http) {
    
    $scope.customization= window.customization;

  var instanceName = window.location.pathname.replace(/\/$/, '').replace(/^\//, '').trim();
  instanceName = instanceName || 'cargografias';
  $scope.go = function ( path ) {

    $location.path( path );
    $anchorScroll();
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

    $scope.filterAdvance = {};
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
   
      $location.path('/timeline/' + params);
    
    }
    $scope.reload = function(params, hideAfterClick) {
      $location.path('/timeline/' + params);
    }
    $scope.loadPerson = function(p) {
      $location.path('/timeline/territory-' + p.person.popitID);
    }

    // Presets

    var presetsLoader = loadPresets();

    var onDataLoaded = function() {
      
          cargosFactory.calculateRankings();

          $rootScope.estado = "Motor de Visualizacion";
          for (var i = 0; i < $rootScope.observers.length; i++) {
            var observer = $rootScope.observers[i];
            observer();
          };
          $rootScope.estado = "Listo!";
          $rootScope.ready = true;

    };
    
    function loadPresets() {
      var instanceName = window.location.pathname.replace(/\/$/, '').replace(/^\//, '') ;
      instanceName = instanceName || 'cargografias';
      var locdataPath = window.__config.baseStaticPath + '/datasets/' + instanceName + '_locdata.json' + '?v=' + window.__config.lastUpdate;
      var req = $http.get(locdataPath);
      req.then(function(res) {
        $scope.presets = JSON.parse(res.data.predefinedSearches || "[]");
        $scope.showPresets = $scope.presets && $scope.presets.length;
      });
      return req;
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