// initialisation de angular
let app = angular.module("myApp", ['chat']);

app.constant('config', {
    rltm: {
        service: "pubnub",
        config: {
            "publishKey": "pub-c-5b6e9b5d-efac-4a99-965f-694e482102b6",
            "subscribeKey": "sub-c-7d770952-3dc9-11e8-ab9b-2eb7c2998ea5",
            "Secret Key": "sec-c-ODEwNmI1YWUtOWNiNS00ZDFjLWJkYWQtMWFhY2Q1ZGQwZTA1"
        }
    }
});

app.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);

app.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});


app.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});





    // User id: kifran72
    // password: oFRt0ZoDg4

