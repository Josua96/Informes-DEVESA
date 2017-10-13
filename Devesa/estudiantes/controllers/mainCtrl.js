
angular.module('userModule')
    .controller('mainCtrl', function($scope,$location) 
    {                
        $scope.user = localStorage.getItem("user001");
        $scope.email =localStorage.getItem("password001");
        console.log($scope.user);
        console.log($scope.email);
        window.location.href =('#/students/misSolicitudes');
});