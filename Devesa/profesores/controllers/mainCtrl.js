angular.module('profesorModule')
    .controller('mainCtrl', function($scope,$location)
        {
            $scope.codigo=localStorage.getItem("sessionToken");
            $scope.id=localStorage.getItem("userId");
            $scope.sede=localStorage.getItem("sede");
            
            $scope.user = localStorage.getItem("user001");
            $scope.email =localStorage.getItem("password001");
            console.log($scope.user);
            console.log($scope.email);
            window.location.href =('#/profesores/inicio');
        }
    );