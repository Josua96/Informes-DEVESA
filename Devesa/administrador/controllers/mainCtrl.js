angular.module('adminModule')
.controller('mainCtrl', 

function($scope,$location) 
    {       
        $scope.user = "Administrador";
        $scope.email = "correo@administrador";           
        $scope.fechaInicio;
        $scope.fechaFin;   
        window.location.href = ('#/solicitudes');
    
    
    $scope.guardarFecha = function()
    {
        console.log("Hola mundo");
    }
    }
         

);