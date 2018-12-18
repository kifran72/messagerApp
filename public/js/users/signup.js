

app.controller('signup', function($scope, $http, $window, $timeout) {
  $scope.mail, $scope.username, $scope.password, $scope.passwordTest;
  let mail; let username; let password; let passwordTest;

  $scope.signup = function() {
    mail = $scope.mail;
    username = $scope.username;
    password = $scope.password;
    passwordTest = $scope.passwordTest;
    $scope.connect = false;
    $scope.notSame = false;

    if (mail === undefined && username === undefined && password === undefined && passwordTest === undefined) {
      $scope.connect = true;
      $timeout(()=>{
        $scope.connect = false;
      }, 3000);
    } else if (passwordTest != password) {
      $scope.password = '';
      $scope.passwordTest = '';
      $scope.notSame = true;
      $timeout(()=>{
        $scope.notSame = false;
      }, 3000);
    } else {
      $http.post('/signup', {
        mail: mail,
        username: username,
        password: password,
        passwordTest: passwordTest,
      }).then((rep) => {
        // $window.location.href = '/login';
        return console.log(rep.data);
      }).catch((err) => console.log(err));
    }
  };

  $scope.logout = () => {
    $window.location.href = '/login';
  };
});
