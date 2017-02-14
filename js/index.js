var ligApp = angular.module ('ligApp', []);

ligApp.controller('indexController', function indexController($scope, $http) {
    $scope.income = []
    $scope.outcome = []
    $scope.projects = [];
    $scope.contributions = [];
    $scope.authors = {};
    $scope.events = [];
    $scope.lignode = "liskwallet.punkrock.me"
    $scope.fulig = {
        address: '13861531827625059307L',
        balance: null
    };

    $http.get ('https://' + $scope.lignode + '/api/accounts/getBalance?address=' + $scope.fulig.address).then (function (data) {
        $scope.fulig.balance = parseInt (data.data.balance) / 100000000;
    });
    $http.get('https://' + $scope.lignode + '/api/transactions?limit=10&recipientId=' + $scope.fulig.address).then(function (data) {
        console.log('Income')
        console.log(data.data.transactions.reverse())
        let tempIncome = data.data.transactions.reverse()

        tempIncome.forEach(function (e) {
            $http.get('https://' + $scope.lignode + '/api/accounts/getPublicKey?address=' + e.senderId).then(function (data) {
                if (data.status === 200) {
                    $http.get('https://' + $scope.lignode + '/api/delegates/get?publicKey=' + data.data.publicKey).then(function (data) {
                        if (data.data.success && data.status === 200) {
                            e.delegate = data.data.delegate.username
                        }
                    })
                }
            })
            $scope.income.push(e)
        }, this)
    })
    $http.get('https://' + $scope.lignode + '/api/transactions?limit=10&senderId=' + $scope.fulig.address).then(function (data) {
        console.log('Outcome')
        console.log(data.data.transactions.reverse())
        let tempOutcome = data.data.transactions.reverse()

        tempOutcome.forEach(function (e) {
            $http.get('https://' + $scope.lignode + '/api/accounts/getPublicKey?address=' + e.recipientId).then(function (data) {
                if (data.data.success && data.status === 200) {
                    $http.get('https://' + $scope.lignode + '/api/delegates/get?publicKey=' + data.data.publicKey).then(function (data) {
                        if (data.data.success && data.status === 200) {
                            e.delegate = data.data.delegate.username
                        }
                    })
                }
            })
            $scope.outcome.push(e)
        }, this)
    })
    $http.get ('data/projects.json').then (function (data) {
        $scope.projects = data.data;
    });

    $http.get ('data/events.json').then (function (data) {
        $scope.events = data.data;
    });

    $http.get ('data/authors.json').then (function (data) {
        $scope.authors = data.data;
    });

    $http.get ('data/contributions.json').then (function (data) {
        $scope.contributions = data.data;
    });

    $http.get ('data/members.json').then (function (data) {
        $scope.members = data.data;
    });
});