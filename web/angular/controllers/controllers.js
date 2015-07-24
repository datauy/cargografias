'use strict';

/* Controllers */
angular.module('cargoApp.controllers')
  .controller('homeController', function($rootScope, $q, $scope, cargosFactory, $filter, $cookies, $routeParams, $location, $route, $timeout, $http) {

      /**
       * FromDecade
       * @type {number}
       */
      var fromDecade = 1900;

    $scope.filterAdvance = {};
    $scope.autoPersons = [];
    $scope.activePersons = [];
    $scope.estado = "";
    $rootScope.observers = [];
    $rootScope.yearObserver = [];
    $rootScope.jerarquimetroObserver = [];
    $scope.filter = "name";
    $scope.showResult = false;

    $scope.showPresets = true;
    var parsedParams;

    var processParameters = function(params) {
      parsedParams = params.split('-');
      $scope.filter = parsedParams.shift();
      // $scope.poderometroYear = $scope.activeYear = parseInt(parsedParams.shift());

    }


    //Load initial ids from the url
    if ($routeParams.ids) {
      processParameters($routeParams.ids);
    }

    $scope.$watch('activeYear', function() {
      updateTheUrl();
    });


    $scope.load = function(params, hideAfterClick) {
      
      processParameters(params);
      //light add all persons from url
      if (parsedParams) {
        for (var i = 0; i < parsedParams.length; i++) {
          var index = parsedParams[i];
          var id = cargosFactory.mapId[index];
          $scope.lightAdd(cargosFactory.autoPersons[id], id);
        };
        $scope.refreshAllVisualizations();
        $scope.search = true;
        $scope.showPresets = hideAfterClick ? false : $scope.showPresets;
      }
    }

    // Presets

    var presetsLoader = loadPresets();

    var onDataLoaded = function() {

      $rootScope.estado = "Motor de Visualizacion";
      for (var i = 0; i < $rootScope.observers.length; i++) {
        var observer = $rootScope.observers[i];
        observer();
      };
      $rootScope.estado = "Listo!";
      $rootScope.ready = true;

      if (parsedParams && parsedParams.length == 1 && parsedParams[0] == '') {
        parsedParams.pop(); //Remove spurius parsing
      }
      if (parsedParams && parsedParams.length) {
        //Initial load with parameters in the URL
        for (var i = 0; i < parsedParams.length; i++) {
          var index = parsedParams[i];
          var id = cargosFactory.mapId[index];
          $scope.lightAdd(cargosFactory.autoPersons[id], id);
        };
        $scope.refreshAllVisualizations();
      } else {
        //Initial load without data in the url
        presetsLoader.then(function() {
          if ($scope.presets.length) {
            $scope.load($scope.presets[0].valores); //Default load 1st preset
          }
        });
      }

    };

    $scope.redrawPoderometro = function() {
      for (var i = 0; i < $rootScope.yearObserver.length; i++) {
        var observer = $rootScope.yearObserver[i];
        var poderometro = cargosFactory.getPoderometroAnimado($scope.poderometroYear, $scope.activePersons);
        observer(poderometro);
      };
      for (var i = 0; i < $rootScope.jerarquimetroObserver.length; i++) {
        var observer = $rootScope.jerarquimetroObserver[i];
        var jerarquimetro = cargosFactory.getJerarquimetro($scope.poderometroYear, $scope.activePersons);
        observer(jerarquimetro);
      };
    }

    function loadPresets() {
      var instanceName = window.location.pathname.replace(/\/$/, '').replace(/^\//, '') ;
      instanceName = instanceName || 'cargografias';
      var req = $http.get('/js/datasets/gz/' + instanceName + '_locdata.json');
      req.then(function(res) {
        $scope.presets = JSON.parse(res.data.predefinedSearches || "[]");
        $scope.showPresets = $scope.presets && $scope.presets.length;
      });
      return req;
    }

    $scope.filterAutoPersons = function(q) {
      if (q.length > 3) {
        $scope.showPresets = false;
        $scope.search = true;
        $scope.filterAdvance.name = q;
        $scope.autoPersons = cargosFactory.getAutoPersonsAdvance($scope.filterAdvance);
        $scope.showResult = true;
      } else {
        $scope.autoPersons = [];
        $scope.search = false;
      }
    };

    $scope.filterAutoPersonsAdvance = function () {
        console.log('filterAutoPersonsAdvance')
        $scope.showPresets = false;
        $scope.search = true;
        $scope.autoPersons = cargosFactory.getAutoPersonsAdvance($scope.filterAdvance);
        $scope.showResult = true;
    };

    $scope.createEmbed = function(cb){
      $http.post('/createEmbedUrl', {
        persons:  ( $scope.activePersons || [] ).map(function(person){ return {  popitID: person.popitID, id: person.id } }), 
        filter: $scope.filter
      })
      .success(function(result){
        var instanceName = window.location.pathname.replace(/\/$/, '').replace(/^\//, '') ;
        instanceName = instanceName || 'cargografias';
        var embed = "/" + instanceName + "/embed/" + result.embed._id;
        $scope.embedAvailable = embed;
        if (cb){
          cb(embed);  
        }
        
      })
    };


    $scope.tweetThis =function(){
      $scope.createEmbed(function(embedUrl){
        
        var urlToShorten = window.location.origin + embedUrl;
        
        $http.post('/createShortUrl', {url: urlToShorten}).success(function(result){


          var prefix = data[0].name;
          console.log(result);
           var base ="https://twitter.com/intent/tweet?text=";
            base += encodeURIComponent("Aca está línea de tiempo de " 
            + prefix +  " via @cargografias " 
            +  result.shortUrl );
            base += "&url='" + encodeURIComponent(result.shortUrl);
          window.open(base,'twitter-share-dialog','width=626,height=436');              
        })

       


      }); 
    };

    $scope.shareIt = function(){
      
      var urlToShorten = location.href;
      $http.post('/createShortUrl', {url: urlToShorten}).success(function(result){
        var text = "Linea de tiempo de politicos:"
        var sharedUrl = result.shortUrl;
        var url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text) + '&amp;tw_p=tweetbutton&amp;via=cargografias&amp;url=' + encodeURIComponent(sharedUrl)
        window.open(url, 'twitterShareWindow')                
      })
    };

    $scope.clearFilter=function(){
      $scope.filterAdvance.name = null;
      $scope.filterAdvance.territory= null;
      $scope.filterAdvance.jobTitle = null;
      $scope.filterAdvance.decade = null;
      $scope.search = false;  
    };

    $scope.switchSearch = function(v){
      $scope.showBusAvanzado = v;
      console.log(v);

      if (v){

      }
      else {
        $scope.filterAdvance.territory= null;
        $scope.filterAdvance.jobTitle = null;
        $scope.filterAdvance.decade = null;
      }
    }
    $scope.clearEverthing = function() {
        console.log('clearFilter');
        $scope.filterAdvance.name = null;
        $scope.filterAdvance.territory= null;
        $scope.filterAdvance.jobTitle = null;
        $scope.filterAdvance.decade = null;
        $scope.autoPersons = [];
        $scope.search = false;
        $scope.showResult = false;
        for (var i = 0; i < $scope.activePersons.length; i++) {
          $scope.activePersons[i].autoPersona.agregada = false;
        };
        $scope.activePersons = [];
        updateTheUrl();
        $scope.showPresets = true;
        $scope.refreshAllVisualizations();
    };



    $scope.clearResults = function() {
        console.log('clearResuls');
        $scope.filterAdvance.name = '';
        $scope.filterAdvance.territory = '';
        $scope.filterAdvance.jobTitle = '';
        $scope.filterAdvance.decade = '';
        $scope.showResult = false;
        $scope.autoPersons = [];
        $scope.showPresets = true;
        $scope.search = false;
    }


    cargosFactory.load($scope, onDataLoaded, $rootScope);

    var lastRoute = $route.current;
    $scope.$on('$locationChangeSuccess', function(event) {
      // If same controller, then ignore the route change.
      if (lastRoute.controller == $route.current.controller) {
        $route.current = lastRoute;

      }
    });

    function updateTheUrl() {
      //Update the URL
      $location.path("/" + $scope.filter + "-" + $scope.activePersons.map(function(p) {
        return p.autoPersona.popitID
      }).join('-'));
    }

    $scope.lightAdd = function(autoPersona, id) {
      if (!autoPersona || autoPersona.agregada) return;
      else {
        $scope.autocomplete = " ";
        autoPersona.agregada = true;
        autoPersona.styles = "badge-selected"
        var person = cargosFactory.getFullPerson(id);
        person.autoPersona = autoPersona;
        $scope.activePersons.unshift(person);
      }
    }
    $scope.add = function(autoPersona, id) {
      $scope.lightAdd(autoPersona, id);
      $scope.refreshAllVisualizations();
    };

    $scope.refreshAllVisualizations = function() {

      //TODO: This should all go to observers.
      $scope.hallOfShame = cargosFactory.getHallOfShame($scope.activePersons);
      //$scope.redrawPoderometro();
      data = $scope.activePersons;
      reloadCargoTimeline($scope.filter);
      //Updates Url
      updateTheUrl();
    }


    $scope.filterLine = function(f) {
      $scope.filter = f;
      reloadCargoTimeline(f);
      updateTheUrl();
    }


    $scope.remove = function(person) {
      var indexOf = $scope.activePersons.indexOf(person);
      if (indexOf > -1) {
        $scope.activePersons.splice(indexOf, 1);
      }
      person.autoPersona.agregada = false;
      person.autoPersona.styles = "";
      if ($scope.activePersons.length == 0 && !$scope.search) {
        $scope.showPresets = true;
      }
      $scope.refreshAllVisualizations();

    };

    $scope.clearAll = function() {
      
      for (var i = 0; i < $scope.activePersons.length; i++) {
        $scope.activePersons[i].autoPersona.agregada = false;
      };
      $scope.activePersons = [];
      updateTheUrl();
      $scope.showPresets = true;
      $scope.refreshAllVisualizations();
      
    }

      /**
       * Clean advance filter
       */
      $scope.cleanAdvanceFilter = function() {
        console.log('cleanAdvanceFilter');
          // $scope.autoPersons = [];
          // $("#nombre").val('');
          // console.log('clearFilter');
          // $scope.filterAdvance.name = null;
          // $scope.filterAdvance.organization = null;
          // $scope.filterAdvance.jobTitle = null;
          // $scope.filterAdvance.decade = null;
        
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