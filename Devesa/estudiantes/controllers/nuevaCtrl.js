angular.module('userModule')
    .controller('nuevaCtrl', function($scope,$location,$http) {

    /* OBTENCION DE CREDENCIALES */
    $scope.codigo=localStorage.getItem("sessionToken");
    $scope.id=localStorage.getItem("userId");
    $scope.tipoUsuario=localStorage.getItem("userType");
    $scope.sede=localStorage.getItem("sede");

   // variables globales
    $scope.carnet="2016254066";
    $scope.tramite;
    $scope.indice;
    $scope.datos;  
    $scope.solicitudes=solicitudesDisponibles
    $scope.opciones= sedes;

    //  verifica que no se haya realizado una solicitud del tipo que se esta pidiendo 
    $scope.verificar=function () {

        $http({   
            method : "GET",
            url :API_ROOT+":8081/ObtenerSolicitudesCarnet?carnet="+$scope.carnet+"&iden="
            +$scope.id+"&codigo="+$scope.codigo
            })
            .then(function mySucces(response)
            {
                $scope.datos=response.data;  
                var largo=$scope.datos.length;             
                
                for (i=0;i<largo;i++)
                {                
                    if (angular.equals($scope.datos[i]["v_tramite"],$scope.solicitudes[$scope.indice])===true)
                    {
                        console.log("salio", i);
                        mostrarNotificacion("No fue posible agregar la solicitud, Usted ya realizó una solicitud de este tipo",1);
                        return;
                    }
                }
                $scope.realizarSolicitud();
                return;
            
            }, function myError(response) 
              {
                mostrarNotificacion("Ocurrió un error y no fue posible agregar la solicitud",1);
              }
           );
    };

    
    //Realiza la solicitud de la carta que desea el usuario. 
    $scope.evaluarSolicitud=function (indice) 
    {
        
        $scope.indice = indice;
        if ($scope.indice !== undefined) 
        {
                $scope.verificar();
        }
        else 
        {
            mostrarNotificacion("Es necesario que seleccione un tipo de solicitud",1);
        }
    };

    // Finaliza el proceso de solicitud 
    $scope.realizarSolicitud=function()
    {
        $http(
        {
            method: "POST",
            url: API_ROOT+":8081/CrearSolicitud?carnet=" + $scope.carnet + "&tramite=" + $scope.solicitudes[$scope.indice]+
            "&iden="+$scope.id+"&codigo="+$scope.codigo+"&sede="+$scope.sede+"&tipo="+$scope.tipoUsuario
        })
        .then(function mySucces(response) 
        {
            mostrarNotificacion("La solocitud ha sido agregada",2);
        },function myError(response) 
        {
            mostrarNotificacion("Ocurrió un error y no fue posible agregar la solicitud",1);
        });
    };



});