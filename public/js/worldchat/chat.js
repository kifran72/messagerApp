app.controller('worldchat', function ($scope, $http, $window) {
    $scope.message;
    $scope.username;
    $scope.messages = [];

    let username;
    let socket = io.connect('localhost:3000');

    let getMessages = (() => {
        $http.get('worldchat/getMessages').then(response => {
            if (response.data === {}) return;
            // { [ 'message', 'deuxieme message', ... ] }

            for (let i = 0; i < response.data.messages.length; i++) {
                $scope.messages.push({
                    username: response.data.messages[i].username,
                    message: response.data.messages[i].message,
                    created_at: response.data.messages[i].created_at
                })
            }
        }).catch(err => console.error(err));
    })();

    socket.on('echo', data => {

        $scope.messages.push({
            username: data.username,
            message: data.message,
            created_at: data.created_at
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

