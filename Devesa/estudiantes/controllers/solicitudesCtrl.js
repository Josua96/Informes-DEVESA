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


    //obtiene las solicitudes realizadas por un estudiante
    $scope.cargarSolicitudes =function()
    {
        //format(Base64.encode($scope.carnet,true).toString())
        $http({
            method : "GET",
            url :API_ROOT+":8081/ObtenerSolicitudesCarnet?carnet="+$scope.carnet+
                "&iden="+$scope.id+"&codigo="+$scope.codigo
            })
            .then(function mySucces(response)
            {
                console.log("obteniendo solicitudes");
                $scope.solicitudes=response.data;
                console.log($scope.solicitudes);

                if ($scope.solicitudes.length===0)
                {
                    mostrarNotificacion("Usted no tiene solicitudes pendientes",3);
                }
                $scope.solicitudes=setTextSolicitudes($scope.solicitudes);
            },
            function myError(response)
            {
                mostrarNotificacion("La carga de solicitudes no fué posible",1);
         });
    };

    //Eliina una solicitud del sistema
    $scope.completarEliminado = function() //elimina una solicitud
    {

    if($scope.indiceEliminar != -1)
    {
    $http({   //delete a student's requests by id's requests
    method : "DELETE",
    url :API_ROOT+":8081/EliminarSolicitud?id="+$scope.solicitudes[$scope.indiceEliminar]["v_idsolicitud"]
    +"&iden="+$scope.id+"&codigo="+$scope.codigo
    }).then(function mySucces(response) {

        mostrarNotificacion("La solicitud se eliminó con éxito",2);
        //Eliminar la solicitud de la lista de solicitudes
        $scope.solicitudes.splice($scope.indiceEliminar,1);

    //automaticamente se elimina de la tabla


    console.log("entro", response);
    }, function myError(response) {
    console.log("error");
    $scope.myWelcome = response.statusText;
    });
    }

    indiceEliminar = -1;

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