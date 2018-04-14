
app.controller("loginUser", function ($scope, $http, $window) {
    $scope.username, $scope.password;
    let username, password;

    // Création de la fonction loginUser pour permmettre l'envoie du username et password par la route crée "/login" et si la reponse de la route est true rediriger vers "/" sinon message d'erreur
    $scope.loginUser = function () {

        username = $scope.username;
        password = $scope.password;

        console.log(username);
        console.log(password);
        $http.post("http://localhost:3000/login", {
            username: username,
            password: password
        }).then(function (rep) {
            if (rep.data.success) {
                $window.location.href = '/';
            } else {
                console.log(rep);
                $('.erreurMessage').fadeIn(300);
            }
        })

    }
});
