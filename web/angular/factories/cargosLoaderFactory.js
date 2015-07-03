'use strict';

/* Filters */

angular.module('cargoApp.factories', [])
  .factory('cargoLoaderFactory', function($http, $filter) {
    
    var datasources = [];

    var cargografiasSources = [];

    var instanceName = window.location.pathname.replace(/\/$/, '').replace(/^\//, '');
    instanceName = instanceName || 'cargografias';

    cargografiasSources.push('/js/datasets/gz/' + instanceName + '-persons.json');
    cargografiasSources.push('/js/datasets/gz/' + instanceName + '-memberships.json');
    cargografiasSources.push('/js/datasets/gz/' + instanceName + '-organizations.json');
    cargografiasSources.push('/js/datasets/gz/' + instanceName + '-posts.json');


    //TODO: Uncoment to test other data sources
    // var legisladoresSources = [];

    // legisladoresSources.push('/js/datasets/legisladores-ar-persons.json');
    // legisladoresSources.push('/js/datasets/legisladores-ar-memberships.json');
    // legisladoresSources.push('/js/datasets/legisladores-ar-organizations.json');
    // legisladoresSources.push('/js/datasets/legisladores-ar-posts.json');


    // var finlandiaSources = [];

    // finlandiaSources.push('/js/datasets/eduskunta-persons.json');
    // finlandiaSources.push('/js/datasets/eduskunta-memberships.json');
    // finlandiaSources.push('/js/datasets/eduskunta-organizations.json');
    // finlandiaSources.push('/js/datasets/eduskunta-posts.json');


    

    // datasources.push(cargografiasSources);
    // datasources.push(legisladoresSources);
    // datasources.push(finlandiaSources);
    


    var currentDataSource = cargografiasSources;

    var f = {};

    f.load = function($scope,factory,callback, $rootScope){

            //TODO; How we can make this into popit?
            // $http.get('/js/datasets/pesopoder.json')
            //       .then(function(res){

            //         $rootScope.estado = "Representatividad";
            //         factory.weight = res.data;
            //       });

            $http.get(currentDataSource[0])
               .then(function(res){
                $rootScope.estado = "Personas";
                factory.persons = res.data;
                  for (var i = 0; i < res.data.length; i++) {
                    //Search Index
                    res.data[i].index = i;
                    //Photo or default photo
                    try{
                      res.data[i].image = res.data[i].images ? res.data[i].images[0].url :'/img/person.png'    // get popit picture
                    }
                    catch(e){
                      res.data[i].image = '/img/person.png' ;
                    }
                    //Initials for graphics
                    var splitedName =  res.data[i].name.split(' ')
                    res.data[i].initials = res.data[i].name ? splitedName.map(function(item){ return item.substr(0,1).toUpperCase() }).join('.') + "." : '-';  
                    //TODO: This should come 100% from data. Remove in the future
                    res.data[i].lastName = res.data[i].name ? splitedName.reverse()[0] : '';
                    try{
                      res.data[i].popitID = res.data[i].id_sha1.substring(0,6);
                      res.data[i].chequeado = false;
                      if (chequeados.indexOf(res.data[i].popitID) > -1){
                          res.data[i].chequeado = true;
                      }
                    }
                    catch(e){
                      console.log("No Id?-", res.data[i].name, res.data[i].id_sha1);
                    }
                    factory.mapId[res.data[i].popitID] = i;
                    factory.autoPersons.push(res.data[i]);
                  };
              }).then(function(){

                $http.get(currentDataSource[1])
                 .then(function(res){
                  $rootScope.estado = "Puestos";
                      for (var i = 0; i < res.data.length; i++) {
                          if (res.data[i].post_id){
                            factory.memberships.push(res.data[i]);
                          }
                      };
                }).then(function(){
                  $http.get(currentDataSource[2])
                    .then(function(res){
                      $rootScope.estado = "Organizaciones";
                      factory.organizations = res.data;
                      //TODO: Why is this here? Shouldn't go to organization level attribute?
                      //nivel: res.data[i].name === 'Argentina' ? 'nacional' : 'provincial'
                  }).then(function(){
                    $http.get(currentDataSource[3])
                      .then(function(res){
                        factory.posts = res.data;
                        $rootScope.estado = "Partidos";
                    }).then(callback);
                  });
                });
             });
        }
        return f;
});

//TODO: this should be on popit, hard hack for Elections BA.
var chequeados = ["2c109a", "55a99b","5928af", "1d3338", "f4b3f5"];

