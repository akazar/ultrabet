app.controller('resultsController', ['$rootScope', '$scope', function($rootScope, $scope){
    $rootScope.$on('leagueResults', function(event, data){
        $scope.fixtures = data.fixtures;
    });

}]);