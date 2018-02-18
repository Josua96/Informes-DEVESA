angular.module('userModule')
.controller('solicitudesCtrl', function ($scope,$http,peticionesEstudiantes)
{
    /*  Obtención de credenciales*/
    $scope.codigo=localStorage.getItem("sessionToken");
    $scope.id=localStorage.getItem("userId");

    $scope.tiposSolicitudes=solicitudesDisponibles;
    $scope.opcionesSedes=sedes;
    $scope.carnet="2016254066";
    $scope.tramite="";
    $scope.indiceEliminar = -1;            
    $scope.solicitudes;

    // Registra una nueva solicitud en el sistema
    $scope.realizarSolicitud=function()
    {
        var indiceSede=document.getElementById("sel2").selectedIndex;
        var indiceSolicitud=document.getElementById("sel1").selectedIndex;
        if (indiceSede!= undefined && indiceSolicitud!= undefined){
            peticionesEstudiantes.registrarSolicitud($scope.carnet,$scope.tiposSolicitudes[indiceSolicitud]["abreviatura"],$scope.id,
                $scope.codigo,$scope.opcionesSedes[indiceSede]["abreviatura"])
                .then(function(response){
                    mostrarNotificacion("La solicitud ha sido agregada",2);
                    $scope.cargarSolicitudes();
                },function (response) {
                    manageErrorResponse(response,"La solicitud no fue aceptada debido a " +
                        "que usted alcanzó el límite de solictudes que puede realizar para este tipo de carta"+
                        " o existe una solicitud del mismo tipo que aún no ha sido atendida");

                });
        }
        else{
            mostrarNotificacion("Es necesario que seleccione una de las sedes disponibles",1);
        }


    };


    //obtiene las solicitudes realizadas por un estudiante
    $scope.cargarSolicitudes =function()
    {
        peticionesEstudiantes.obtenerPendientes($scope.carnet,$scope.codigo,$scope.id)
            .then(function(response){
                $scope.solicitudes=response.data;
                manageSolicitudesSuccessResponse($scope.solicitudes);

            },function (response) {
                manageErrorResponse(response,"");

            });
    };

    //Eliina una solicitud del sistema
    $scope.completarEliminado = function() //elimina una solicitud
    {
        peticionesEstudiantes.eliminarSolicitud(+$scope.solicitudes[$scope.indiceEliminar]["v_idsolicitud"]
            ,$scope.id,$scope.codigo)
            .then(function(response){
                mostrarNotificacion("La solicitud se eliminó con éxito",2);
                //Eliminar la solicitud de la lista de solicitudes
                $scope.solicitudes.splice($scope.indiceEliminar,1);
            },function (response) {
                manageErrorResponse(response,"");

            });

    };
    //Funcion de petición de confirmación al usuario para el proceso de borrado
    $scope.eliminar= function (indice)
    {

    $scope.indiceEliminar = indice;
    swal({ //mostrar cuadro de dialogo para confirmacion del proceso de eliminado
    title: "Eliminar la solicitud?",
    text: "Una vez eliminada no habrá forma de recuperarla!",
    type: "warning",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonClass: "btn-danger",
    confirmButtonText: "Sí eliminarla!",
    closeOnConfirm: true,
    closeOnCancel: true
    },
    function(){
    $scope.completarEliminado();
    });
    };

    $scope.cargarSolicitudes();

    });