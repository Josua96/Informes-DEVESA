angular.module('userModule')
    .controller('nuevaCtrl', function($scope,$location,$http,peticionesEstudiantes) {

    /* OBTENCION DE CREDENCIALES */
    $scope.codigo=localStorage.getItem("sessionToken");
    $scope.id=localStorage.getItem("userId");
    $scope.tipoUsuario=localStorage.getItem("userType");

   // variables globales
    $scope.carnet="2016254066";
    $scope.tramite;
    $scope.indice;
    $scope.datos;
    $scope.solicitudes=solicitudesDisponibles;
    $scope.opcionesSedes=sedes;


    // Registra una nueva solicitud en el sistema
    $scope.realizaSolicitud=function()
    {
        var indiceSede=document.getElementById("sel2").selectedIndex;
        var indiceSolicitud=document.getElementById("sel1").selectedIndex;
        if (indiceSede!= undefined && indiceSolicitud!= undefined){
            peticionesEstudiantes.registrarSolicitud($scope.carnet,$scope.solicitudes[indiceSolicitud]["abreviatura"],$scope.id,
                $scope.codigo,$scope.opcionesSedes[indiceSede]["abreviatura"])
                .then(function(response){
                    mostrarNotificacion("La solicitud ha sido agregada",2);
                },function (response) {
                    if (response.data.message===false){
                        mostrarNotificacion("La solicitud no fue aceptada debido a " +
                            "que usted alcanzó el límite de solictudes que puede realizar para este tipo de carta"+
                            " o existe una solicitud del mismo tipo que aún no ha sido atendida",1);
                    }
                    
                    else{
                        mostrarNotificacion("Surgió un problema para obtener la conexión con el servidor",1);
                    }

                });
        }
        else{
            mostrarNotificacion("Es necesario que seleccione una de las sedes disponibles",1);
        }


    };



});