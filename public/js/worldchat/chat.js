app.controller('worldchat', function ($scope, $http, $window) {
    $scope.message;
    $scope.messages = [];

    $scope.users = [];

    let id_user = angular.element(".userinfo")[0].id;
    let socket = io.connect('localhost:3000');

    let getMessages = (() => {
        $http.get('worldchat/getMessages').then(response => {
            if (response.data === {}) return;



            for (let i = 0; i < response.data.messages.length; i++) {
                let me = (id_user == response.data.messages[i].id_user ? true : false);

                $scope.messages.push({
                    username: response.data.messages[i].username,
                    message: response.data.messages[i].message,
                    created_at: response.data.messages[i].created_at,
                    myself: me
                })
            }

        }).catch(err => console.error(err));
    })();

    socket.on('add user', user => {

        let userCon = $scope.users.find(userInfo => userInfo.id_user === user.id_user);

        if (!userCon) {
            $scope.users.push(user);

            $scope.$apply();
        }
    });

    socket.on('remove user', user => {
        $scope.users.splice($scope.users.indexOf(user), 1);

        console.log($scope.users);

        $scope.$apply();
    });

    socket.on('echo', data => {
        let me = (id_user == data.id_user ? true : false);

        $scope.messages.push({
            username: data.username,
            message: data.message,
            created_at: data.created_at,
            myself: me
        });

        $scope.$apply();
    });

    $scope.sendMsg = () => {

        let message = $scope.message;

        $http.post('worldchat/sendMessage', { message: message }).then(response => {

            console.log(response);

        }).catch(err => console.error(err));

        angular.element("#m").val('');
    };

});


$('.hide-chat-box').click(function () {
    $('.chat-content').slideToggle();
});

