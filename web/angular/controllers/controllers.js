'use strict';

/* Controllers */
angular.module('cargoApp.controllers')
  .controller('homeController', function($rootScope,$q, $scope,cargosFactory, $filter,$cookies, $routeParams, $location, $route, $timeout, $http) {
  	
    $scope.autoPersons = [];
  	$scope.activePersons = [];
    $scope.estado = "";
  	$rootScope.observers =[];
    $rootScope.yearObserver =[];
    $rootScope.jerarquimetroObserver =[];
    $scope.filter ="timeline";

    $scope.showPresets = true;
    var parsedParams;

    var processParameters = function(params){
        parsedParams = params.split('-');
        $scope.filter = parsedParams.shift();
        $scope.poderometroYear = $scope.activeYear = parseInt(parsedParams.shift());

    }

    //Load initial ids from the url
    if($routeParams.ids){
     processParameters($routeParams.ids);
    }

  $scope.$watch('activeYear', function(){
    updateTheUrl();
  });


  $scope.load = function(params, hideAfterClick){
      $scope.clearAll();
      processParameters(params);
        //light add all persons from url
        if(parsedParams){
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

  var onDataLoaded = function(){
    
     $rootScope.estado = "Motor de Visualizacion";
      for (var i = 0; i < $rootScope.observers.length; i++) {
        var observer = $rootScope.observers[i];
        observer();
      };
      $rootScope.estado = "Listo!";
      $rootScope.ready= true;

      if(parsedParams && parsedParams.length == 1 && parsedParams[0] == '') parsedParams.pop(); //Remove spurius parsing
      if(parsedParams && parsedParams.length){
        //Initial load with parameters in the URL
          for (var i = 0; i < parsedParams.length; i++) {
            var index = parsedParams[i];
            var id = cargosFactory.mapId[index];
            $scope.lightAdd(cargosFactory.autoPersons[id], id);
          };
          $scope.refreshAllVisualizations();  
        }else{
          //Initial load without data in the url
          presetsLoader.then(function(){
            if($scope.presets.length){
              $scope.load($scope.presets[0].valores); //Default load 1st preset
            }
          });
        }

  };

  $scope.redrawPoderometro = function(){
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

  function loadPresets(){
    var instanceName = window.location.pathname.replace(/\/$/, '').replace(/^\//, '');
    instanceName = instanceName || 'cargografias';
    var req = $http.get('/js/datasets/gz/' + instanceName + '_locdata.json');
    req.then(function(res){
      $scope.presets = JSON.parse(res.data.predefinedSearches || "[]");
      $scope.showPresets= $scope.presets && $scope.presets.length;
    });
    return req;
  }

  $scope.filterAutoPersons = function(q){
    if (q.length > 3){
      $scope.showPresets= false;
      $scope.search = true;
      $scope.autoPersons =cargosFactory.getAutoPersons(q);
    }
  };
  
  $scope.clearFilter = function(){
     //HACK: why?????????
     $("#nombre").val('');
     $scope.nombre ='',
     $scope.autoPersons = [];
     $scope.search = false;
  };

  $scope.clearResults= function(){
     $("#nombre").val('');
     $scope.nombre ='',
     $scope.autoPersons = [];
     $scope.showPresets= true;
     $scope.search = false;
  }


  cargosFactory.load($scope,onDataLoaded, $rootScope);

  var lastRoute = $route.current;
  $scope.$on('$locationChangeSuccess', function(event) {
      // If same controller, then ignore the route change.
      if(lastRoute.controller == $route.current.controller) {
        $route.current = lastRoute;

      }
  });

  function updateTheUrl(){
      //Update the URL
      $location.path("/" + $scope.filter  + "-" + $scope.activeYear + "-" + $scope.activePersons.map(function(p){ return p.autoPersona.popitID }).join('-'));
  }

    $scope.lightAdd = function(autoPersona, id){
      if (!autoPersona || autoPersona.agregada) return ;
      else
      {
        $scope.autocomplete = " ";
        autoPersona.agregada = true;
        autoPersona.styles = "badge-selected"
        var person = cargosFactory.getFullPerson(id);
        person.autoPersona = autoPersona;
        $scope.activePersons.push(person);
      }
    }
    $scope.add = function(autoPersona, id){
        $scope.lightAdd(autoPersona,id);
        $scope.refreshAllVisualizations();
    };

    $scope.refreshAllVisualizations = function(){
      
      //TODO: This should all go to observers.
      $scope.hallOfShame = cargosFactory.getHallOfShame($scope.activePersons);
      //$scope.redrawPoderometro();
      data = $scope.activePersons;
      
      reloadTimeline();
      //Updates Url
      updateTheUrl();
    }
    

    $scope.filterLine= function(f){
      $scope.filter = f;
      setControlFix(f);
      updateTheUrl();
    }


    $scope.remove = function(person){
    	var indexOf = $scope.activePersons.indexOf(person);
    	if (indexOf > -1){
    		 $scope.activePersons.splice(indexOf, 1);
    	}
      person.autoPersona.agregada = false;
      person.autoPersona.styles = "";
      if ($scope.activePersons.length == 0 && !$scope.search){
        $scope.showPresets = true;
      }
      $scope.refreshAllVisualizations();

    };

    $scope.clearAll = function(){
      for (var i = 0; i < $scope.activePersons.length; i++) {
        $scope.activePersons[i].autoPersona.agregada = false;
      };
      $scope.activePersons = [];
      updateTheUrl();
      $scope.showPresets=true;
      $scope.refreshAllVisualizations();

    }


    //TODO: Move this to a new controller that only handles hello tutorial

    // //First time Loader    
    // var showSlides = $cookies.showSlides;
    // if (!showSlides){
    //    $scope.showSlides = true;
    //    $cookies.showSlides = true;
    // }
    // //TODO: Descomentar para que se muestre solo la primera vez
    // $scope.closeSlides = function(){
    //   $scope.showSlides = false;
    //   // Setting  cookie
    //   $cookies.showSlides = true;
    // }
    

  });

