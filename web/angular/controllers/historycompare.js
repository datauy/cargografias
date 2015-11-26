'use strict';

/* Controllers */
angular.module('cargoApp.controllers')
  .controller('historycompareController', function($rootScope, $q, $scope,presetsFactory, cargosFactory, $filter, $cookies, $routeParams, $location, $route, $timeout, $http) {

  var instanceName = window.location.pathname.replace(/\/$/, '').replace(/^\//, '').trim();
  instanceName = instanceName || 'cargografias';
  

  $scope.filterAutoPersonsAdvance = function () {
        $scope.showPresets = false;
        $scope.search = true;
        $scope.autoPersons = cargosFactory.getAutoPersonsAdvance($scope.filterAdvance);
        $scope.showResult = true;
        $scope.getData();
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

    // Presets

    var presetsLoader = loadPresets();

    var onDataLoaded = function() {
        console.log("onDataLoadde");
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
      console.log("loadPresets");
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
        var hall = cargosFactory.getJobTitle();
        //console.log("Jobtitle:" +hall.length);
          //$scope.getData();
        return hall;
             
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


     


      $scope.onClick = function (points, evt) {
        console.log(points, evt);
      };


    $scope.getData = function(){
      $scope.labels = loadLabels($scope.autoPersons[1].memberships);//["1994", "1995", "1996", "1997", "1998", "1999", "2000"];

      $scope.series = [$scope.autoPersons[1].name]//['Persona 1', 'Persona 2'];
      $scope.data = loadData($scope.autoPersons[1].memberships); //[ [65, 59, 80, 81, 56, 55, 40]]; //,[28, 48, 40, 19, 86, 27, 90]];

    }  

    function loadLabels(memberships){
      var arrayStartDate=[];
      console.log("Cargos:: " +memberships.length);
      
      var expression = '-start_date';
      memberships = $filter('orderBy')(memberships, expression,true);

      for (var i = 0; i < memberships.length; i++) {
        arrayStartDate[i] = memberships[i].start_date.substr(0,4);
      };

      
      return arrayStartDate;// ["1994", "1995", "1996", "1997", "1998", "1999", "2000"];
    }

    function loadData(memberships){
      var arrayParty=[];
      var arrayTempKeyValue=[];

      for (var i = 0; i < memberships.length; i++) {
        arrayParty[i] = getId(memberships[i].party_id,memberships);//memberships[i].party_id;
      };

      return [ /* [65, 59, 80, 81, 56, 55, 40] */ arrayParty ]; 
    
    }

    function getId(party,memberships){
      var arrayParty=[];
      var i = 0;
      var posicion = 0;
      for ( i = 0; i < memberships.length; i++) {
       arrayParty[i] = memberships[i].party_id;

      
      };

      for (var j = 1; j <= arrayParty.length; j++) {
        if(arrayParty[j]==party){
            
            posicion=j;
            break;
        }
      };
      
      return posicion ;
    }



  });