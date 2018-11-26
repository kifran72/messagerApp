app.controller("getfile", function ($scope, $http, $window) {

    $scope.file;
    let file;

    $scope.upload = function () {
        file = $scope.file;
        console.log(file);
    }
});