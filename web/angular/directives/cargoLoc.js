'use strict';
/* Directives */
angular.module('cargoApp.directives').
directive('ngCargoLoc', function() {
    return {
        
        scope: true,

        template: '{{text}}',

        controller: ['$scope', '$http',
            function($scope, $http) {

                var instanceName = window.location.pathname.replace(/\/$/, '').replace(/^\//, '');
                instanceName = instanceName || 'cargografias';

                $http.get('/js/datasets/gz/' + instanceName + '_locdata.json').then(function(res){
                  $scope.text = res.data[$scope.key] 
                })
            }
        ], 

        link: function($scope, element, attributes) {
          $scope.key = attributes["ngCargoLoc"];
        }

    }
});

