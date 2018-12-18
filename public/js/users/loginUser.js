
app.controller('loginUser', ($scope, $http, $window, $timeout) => {
  $scope.connect = false;
  $scope.incorrect = false;
  $scope.username, $scope.password;
  let username; let password;

  // Création de la fonction loginUser pour permmettre l'envoie du username et password par la route crée "/login" et si la reponse de la route est true rediriger vers "/" sinon message d'erreur
  $scope.loginUser = () => {
    username = $scope.username;
    password = $scope.password;
    $http.post('/login', {
      username: username,
      password: password,
    }).then((rep) => {
      if (rep.data.success) {
        $window.location.href = '/';
      } else {
        if (username === undefined && password === undefined) {
          $scope.connect = true;
          $timeout(()=>{
            $scope.connect = false;
          }, 3000);
        } else {
          $scope.incorrect = true;
          $timeout(()=>{
            $scope.incorrect = false;
          }, 3000);
        }
      }
    });
  };
});
