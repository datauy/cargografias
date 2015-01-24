angular.module('cargografias', ['ngMaterial', 'ngMessages'])
.directive('autoComplete',['$http',function($http){
    return {
        restrict:'AE',
        scope:{
            selectedTags:'=model'
        },
        templateUrl:'autocomplete-template.html',
        link:function(scope,elem,attrs){

            scope.suggestions=[];

            scope.selectedTags=[];

            scope.selectedIndex=-1;

            scope.removeTag=function(index){
                scope.selectedTags.splice(index,1);
            }

            scope.search=function(){
                

            	console.log(scope.searchText);
            	var data = ["Cristina", "Nestor", "Carlos", "Eduardo", "Fernando"];
        	    if(data.indexOf(scope.searchText)===-1){
                    data.unshift(scope.searchText);
                }
                scope.suggestions=data;
                scope.selectedIndex=-1;

                
            }

            scope.addToSelectedTags=function(index){
                if(scope.selectedTags.indexOf(scope.suggestions[index])===-1){
                    scope.selectedTags.push(scope.suggestions[index]);
                    scope.searchText='';
                    scope.suggestions=[];
                }
            }

            scope.checkKeyDown=function(event){
                if(event.keyCode===40){
                    event.preventDefault();
                    if(scope.selectedIndex+1 !== scope.suggestions.length){
                        scope.selectedIndex++;
                    }
                }
                else if(event.keyCode===38){
                    event.preventDefault();
                    if(scope.selectedIndex-1 !== -1){
                        scope.selectedIndex--;
                    }
                }
                else if(event.keyCode===13){
                    scope.addToSelectedTags(scope.selectedIndex);
                }
            }

            scope.$watch('selectedIndex',function(val){
                if(val!==-1) {
                    scope.searchText = scope.suggestions[scope.selectedIndex];
                }
            });
        }
    }
}]
).controller('DemoCtrl', function($scope, $mdDialog) {
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