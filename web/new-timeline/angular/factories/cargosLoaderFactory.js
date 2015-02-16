'use strict';

/* Filters */

angular.module('cargoApp.factories', [])
  .factory('cargoLoaderFactory', function($http, $filter) {
    
    var f = {};

    f.load = function($scope,factory,callback, $rootScope){

            //TODO; How we can make this into popit?
            // $http.get('/js/datasets/pesopoder.json')
            //       .then(function(res){

            //         $rootScope.estado = "Representatividad";
            //         factory.weight = res.data;
            //       });

            $http.get('/js/datasets/gz/cargografias-persons-popit-dump.json')
               .then(function(res){
                $rootScope.estado = "Personas";
                factory.persons = res.data;
                  for (var i = 0; i < res.data.length; i++) {
                    //Search Index
                    res.data[i].index = i;
                    //Photo or default photo
                    res.data[i].image = res.data[i].images ?  res.data[i].images[0].url :'/img/person.png'    // intentando obtener la foto desde el popit!
                    //Initials for graphics
                    res.data[i].initials = res.data[i].name.match(/[A-Z]/g).join('.') + ".";
                    factory.autoPersons.push(res.data[i]);
                  };
              }).then(function(){

                $http.get('/js/datasets/gz/cargografias-memberships-popit-dump.json')
                 .then(function(res){
                  $rootScope.estado = "Puestos";
                  //factory.memberships = res.data;
                      for (var i = 0; i < res.data.length; i++) {
                          if (res.data[i].post_id){
                            factory.memberships.push(res.data[i]);
                          }
                      };
                }).then(function(){
                  $http.get('/js/datasets/gz/cargografias-organizations-popit-dump.json')
                    .then(function(res){
                      $rootScope.estado = "Organizaciones";
                      factory.organizations = res.data;
                      //TODO: Why is this here? Shouldn't go to organization level attribute?
                      //nivel: res.data[i].name === 'Argentina' ? 'nacional' : 'provincial'
                  }).then(function(){
                    $http.get('/js/datasets/gz/cargografias-posts-popit-dump.json')
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

