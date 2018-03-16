angular.module('profesorModule')
    .controller('mainCtrl', function($scope,$location)
        {
            $scope.codigo=localStorage.getItem("sessionToken");
            $scope.id=localStorage.getItem("userId");
            $scope.sede=localStorage.getItem("sede");
            
            $scope.user = localStorage.getItem("userId");
            $scope.email = "ejemplo@email.com";
            console.log($scope.user);
            console.log($scope.email);
            window.location.href =('#/funcionarios/inicio');
        }
    );