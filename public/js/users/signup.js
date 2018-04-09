

app.controller("signup", function ($scope, $http, $window) {

    $scope.mail, $scope.username, $scope.password, $scope.passwordTest;
    let mail, username, password, passwordTest;

    $scope.signup = function () {

        mail = $scope.mail;
        username = $scope.username;
        password = $scope.password;
        passwordTest = $scope.passwordTest;

        if (passwordTest != password) {
            $scope.password = "";
            $scope.passwordTest = "";
            return $scope.message = 'Les mots de passe entrés ne sont pas identiques.';
        }

        $http.post("http://localhost:3000/signup", {
            mail: mail,
            username: username,
            password: password,
            passwordTest: passwordTest
        }).then(function Success(reponse) {
            $window.location.href = '/login';
            return console.log(reponse.data);
        }).catch(err => console.log(err));
    }

});

app.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);

app.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

