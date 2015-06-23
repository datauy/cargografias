'use strict';

/**
 *  Filter Controller
 */
angular.module('cargoApp.controllers').controller('filterController',
    function($rootScope, $q, $scope) {

        /**
         * Cantidad mínima de caracteres
         * @type {number}
         */
        $scope.minLength = 3;


    }
);