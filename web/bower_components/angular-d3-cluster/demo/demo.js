'use strict';
var demo = angular.module('demo', ['angular-d3-cluster']);

demo.controller('DemoController', function($scope) {
    $scope.option = {
        subjectRange: [35, 45],
        arounderRange: [15, 25],
        positiveColor: '#fe6869',
        onSubjectClick: function(subject) {
            alert(subject.subjectId);
        },
        onArounderClick: function(arounder) {
            alert(arounder.arounderId);
        }
    };
    $scope.data = [{
        subjectId: 'id-01',
        name: 'Subject01',
        value: 10.0,
        children: [{
            arounderId: 'aro-01-01',
            name: '01-01', //arounder
            value: -5.1
        }, {
            arounderId: 'aro-01-02',
            name: '01-02',
            value: 3.1
        }]
    }, {
        subjectId: 'id-02',
        name: 'Subject02',
        value: 12.5,
        children: [{
            arounderId: 'aro-02-01',
            name: '02-01', //arounder
            value: 3.1
        }, {
            arounderId: 'aro-02-02',
            name: '02-02',
            value: 6.1
        }]
    }];
});
