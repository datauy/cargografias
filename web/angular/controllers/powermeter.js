'use strict';

/* Controllers */
angular.module('cargoApp.controllers')
  .controller('powermeterController', function($rootScope,  $anchorScroll, $q, $scope,presetsFactory, cargosFactory, $filter, $cookies, $routeParams, $location, $route, $timeout, $http) {

  $scope.option = {
        positiveColor: '#fe6869',
        subjectRange: [35, 45],
        arounderRange: [15, 25]
    };
    $scope.data = [{
        name: 'Subject01',
        value: 10.0,
        children: [{
            name: '01-01', //arounder
            value: -5.1
        }, {
            name: '01-02',
            value: 3.1
        }]
    }, {
        name: 'Subject02',
        value: 12.5,
        children: [{
            name: '02-01', //arounder
            value: 3.1
        }, {
            name: '02-02',
            value: 6.1
        }]
    }];
  var instanceName = window.location.pathname.replace(/\/$/, '').replace(/^\//, '').trim();
  instanceName = instanceName || 'cargografias';

      $scope.personList = [];
      $scope.countResult = 0;
      $scope.selectedPersons = [];
      $scope.addPerson = function(p){
        $scope.selectedPersons.push(p);
        p.added= true;
      }
      $scope.removePerson = function(p){
        var indexOf = $scope.selectedPersons.indexOf(p);
        if (indexOf > -1) {
          $scope.selectedPersons.splice(indexOf, 1);
        }
        p.added = false;
      }

      $scope.compareSelected = function(){
       $scope.gotoList($scope.selectedPersons);
    }
    $scope.compareResult = function(){
      $scope.gotoList($scope.autoPersons);
    }

    $scope.gotoList = function(list){
       var ids = ""
        for (var i = 0; i < list.length; i++) {
          ids += list[i].popitID + "-";
        };

      
      $location.path('/timeline/name-' + ids);
      $anchorScroll();
    }





      $scope.suggest =function(){
       

          var prefix = "";
          if ($scope.filterAdvance.name){
            prefix+= " para '" + $scope.filterAdvance.name +"'";
          }
          if ($scope.filterAdvance.jobTitle){
            if (prefix.length > 0){
              prefix+= " , " ;
            }
            else {
              prefix+= " para " ;
            }
            prefix += $scope.filterAdvance.jobTitle ;
          }
          if ($scope.filterAdvance.territory)
            {
            prefix+= " en " + $scope.filterAdvance.territory ;
          }
          if ($scope.filterAdvance.decade){
            if (prefix.length > 0){
              prefix+= " para el año " 
            }
            else {
              prefix+= " durante ";  
            }
            prefix+= $scope.filterAdvance.decade ;
          }

           var base ="https://twitter.com/intent/tweet?text=";
            base += encodeURIComponent("Hey @cargografias, agreguen datos" 
            + prefix);
            
           window.open(base,'twitter-share-dialog'); 
      }; 
    


    $scope.filterAdvance = {};
    $scope.filterAutoPersons = function(q) {
      if (q.length > 3) {
        $scope.showPresets = false;
        $scope.search = true;
        $scope.filterAdvance.name = q;
        
        var result = cargosFactory.getAutoPersonsAdvance($scope.filterAdvance);
        $scope.countResult  = result.length;
        var expression = '-memberships.length';
        result = $filter('orderBy')(result, expression, false);
        $scope.autoPersons = _.take(result,25);
        $scope.showResult = true;
      } else {
        $scope.autoPersons = [];
        $scope.search = false;
      }
    };
    $scope.filterAutoPersonsAdvance = function () {
        $scope.showPresets = false;
        $scope.search = true;
        var result = cargosFactory.getAutoPersonsAdvance($scope.filterAdvance);
        var expression = '-memberships.length';
        result = $filter('orderBy')(result, expression, false);
        $scope.countResult  = result.length;
        $scope.autoPersons = _.take(result,25);
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