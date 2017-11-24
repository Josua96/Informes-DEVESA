angular.module('adminModule')
.controller('mainCtrl', 

function($scope,$location) 
    {       
        $scope.user = "Administrador";
        $scope.email = "correo@administrador";           
        $scope.fechaInicio;
        $scope.fechaFin;   
        window.location.href = ('#/solicitudes');
        /*
         obtener token utilizado por el usuario
         */
        $scope.codigo=localStorage.getItem("sessionToken");

        $scope.borrarToken=function () {
            $http({
                method : "DELETE",
                url : API_ROOT+":8081/eliminarToken?codigo="+$scope.codigo
            }).then(function (response) {
                console.log("token_registrado");
                $scope.redirigirUsuario();
            }, function (response) {
                console.log(response.data.message);
                $scope.status ="Error de conexion";
            });
        }

    }
         

);