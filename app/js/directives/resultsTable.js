app.directive('resultsTable',  [ function () {
    return {
        restrict: 'AE',
        templateUrl: 'js/templates/results-table.html',
        controller: 'resultsController',
        scope: {
            fixtures: "@"
        }
    };
}]);
