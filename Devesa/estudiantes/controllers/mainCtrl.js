
angular.module('userModule')
    .controller('mainCtrl', function($scope,$location) 
    {                
        
        /*
        obtener token utilizado por el usuario
        */
        $scope.codigo=localStorage.getItem("sessionToken");
        
        $scope.user = localStorage.getItem("user001");
        $scope.email =localStorage.getItem("password001");
        console.log($scope.user);
        console.log($scope.email);
        window.location.href =('#/students/misSolicitudes');
        /** 
         * Permite....
         * 
         * @param none
         * @returns none;
         */
        $scope.borrarToken=function () {
            $http({
                method : "DELETE",
                url :API_ROOT+":8081/eliminarToken?codigo="+$scope.codigo
            }).then(function (response) {
                console.log("token_registrado");
                $scope.redirigirUsuario();
            }, function (response) {
                console.log(response.data.message);
                $scope.status ="Error de conexion";
            });
        }
});