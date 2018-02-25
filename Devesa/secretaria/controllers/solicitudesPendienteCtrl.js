angular.module('secretariaModule')
    .controller('pendienteCtrl', function($scope,$location,$http, datosEstudiante,peticiones) {

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

        /**
         *  obtener las solicitudes pendientes (regitros de la tabla solicitudes)
         */
        $scope.obtenerSolicitudesPendientes = function()
        {
            
            peticiones.obtenerNoAtendidas($scope.codigo,$scope.id,$scope.sede)
                .then(function(response){
                    if (response.data.length >0 ){
                        $scope.solicitudes=response.data;  //it does not need a conversion to json
                        $scope.solicitudes=setTextSolicitudes($scope.solicitudes);
                    }
                    else{
                        mostrarNotificacion("No hay solicitudes de cartas pendientes",3);
                    }
                },function (response) {
                    manageErrorResponse(response,"");

                });
            
        };


        /** Envía a impresión la solictud pendiente que fue seleccionada
         *
         * @param indiceFila indexa la fila de la tabla que es seleccionada
         */
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