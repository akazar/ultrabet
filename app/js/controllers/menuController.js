app.controller('menuController', ['$http', '$rootScope', function($http, $rootScope){
    $http({
        method: 'GET',
        url: 'http://127.0.0.1:3000/leagues/',
    }).success(function (data, status) {
        this.leagues = data;
    }.bind(this));

    this.chooseLeague = function(id){
        $http({
            method: 'GET',
            url: 'http://127.0.0.1:3000/fixtures/' + id
        }).success(function (data, status) {
            $rootScope.$emit('leagueResults', data.fixtures);
        }.bind(this));
    }

}]);
