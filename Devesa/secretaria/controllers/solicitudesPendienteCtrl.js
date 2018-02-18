angular.module('secretariaModule')
    .controller('pendienteCtrl', function($scope,$location,$http, datosEstudiante) {

        $scope.codigo=localStorage.getItem("sessionToken");
        $scope.id=localStorage.getItem("userId");
        $scope.sede=localStorage.getItem("sede");
        $scope.paginaActual=1;
        $scope.cantidadElementos=elementosPorPagina;
        $scope.maximoElementos= maxSize;

        numeroInforme=-1;
        departamento="";
        $scope.carnet;
        $scope.tramite;
        $scope.solicitudes;
        $scope.idCosulta;
        /*
        Objetivo: obtener las solicitudes pendientes
         */
        $scope.obtenerSolicitudesPendientes = function()
        {
            $http({
            method : "GET",
            url : API_ROOT+":8081/ObtenerSolicitudesNoAtendidas?"+"&iden="+$scope.id+"&codigo="+$scope.codigo +"&sede="+$scope.sede
            }).then(function mySucces(response)
            {
                if(response.data !== "false" && response.data!==[] && response.data!== 0 && response.data !== false )
                {
                    $scope.solicitudes=response.data;  //it does not need a conversion to json
                    $scope.solicitudes=setTextSolicitudes($scope.solicitudes);
                }
                else
                {
                    mostrarNotificacion("No hay solicitudes de cartas pendientes",3);
                }


            }, function myError(response)
            {              
                    mostrarNotificacion("Ocurrio un error",1);
                    $scope.myWelcome = response.statusText;
            });
        };

        /*********************************
        Objetivio: imprimir alguna de las solicitudes pendientes
         Parametros:
            indice= indexa la fila de la tabla que es seleccionada
         *********************************/
        $scope.imprimir= function (indiceFila)
        {
            //el indice real, la posicion en la que se encuentra el elemento dentro del arreglo
            var indice= getRealIndex(indiceFila,$scope.cantidadElementos,$scope.paginaActual);
            datosEstudiante.carnet = $scope.solicitudes[indice]["v_carne"];
            datosEstudiante.idConsulta = $scope.solicitudes[indice]["v_idsolicitud"];
            datosEstudiante.estadoConsulta= $scope.solicitudes[indice]["v_estado"];
            var datos = getTextoEspecial( $scope.solicitudes[indice]["v_tramite"]);
            datosEstudiante.tipoTramite= datos[0];
            datosEstudiante.textoResidencia= datos[1];
            window.location.href=('#/carta');
        };                
        $scope.obtenerSolicitudesPendientes();
});