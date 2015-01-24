angular.module('cargografias', ['ngMaterial', 'ngMessages'])
.controller('DemoCtrl', function($scope, $mdDialog) {
  $scope.user = {
    title: 'Developer',
    email: 'ipsum@lorem.com',
    firstName: '',
    lastName: '' ,
    company: 'Google' ,
    address: '1600 Amphitheatre Pkwy' ,
    city: 'Mountain View' ,
    state: 'CA' ,
    biography: 'Loves kittens, snowboarding, and can type at 130 WPM.\n\nAnd rumor has it she bouldered up Castle Craig!',
    postalCode : '94043'
  };
  $scope.showAdvanced = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'dialog.html',
      targetEvent: ev,
    })
    .then(function(answer) {
      $scope.alert = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.alert = 'You cancelled the dialog.';
    });
  };

});

function DialogController($scope, $mdDialog) {
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
}