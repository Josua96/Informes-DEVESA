angular.module('secretariaModule')
    .controller('atendidasCtrl', function($scope,$location,$http, datosEstudiante,peticiones) {

        $scope.codigo=localStorage.getItem("sessionToken");
        $scope.id=localStorage.getItem("userId");
        $scope.sede=localStorage.getItem("sede");

        $scope.paginaActual;
        $scope.cantidadElementos=elementosPorPagina;
        $scope.maximoElementos= maxSize;
        
    	numeroInforme=-1;
    	departamento="";
        $scope.carnet;
        $scope.tramite;
        $scope.solicitudes;   
        $scope.idCosulta;

        /** Obtiene las solicitudes que se han impreso en el día en cuestión (día actual)
         * 
         */
        $scope.obtenerSolicitudesAtendidas = function()
            {
                peticiones.obtenerAtendidas($scope.codigo,$scope.id,$scope.sede)
                    .then(function(response){
                        if (response.data.length > 0 ){
                            $scope.solicitudes=response.data; 
                            $scope.solicitudes=setTextSolicitudes($scope.solicitudes);
                            $scope.paginaActual=1;
                        }
                        else{
                            mostrarNotificacion("Hoy no se ha impreso ninguna carta",3);
                            $scope.paginaActual=0;
                        }
                    },function (response) {
                        manageErrorResponse(response,"");

                    });
               
            };
        
        
        /** imprimir la solicitud atendida que es seleccionada
         * 
         * @param indiceFila: indexa la fila de la tabla que es seleccionada
         */
        $scope.imprimir= function (indiceFila)
        {
            //el indice real, la posicion en la que se encuentra el elemento dentro del arreglo
            var indice= getRealIndex(indiceFila,$scope.cantidadElementos,$scope.paginaActual);
            datosEstudiante.carnet = $scope.solicitudes[indice]["v_carne"];
            datosEstudiante.idConsulta = $scope.solicitudes[indice]["v_idsolicitud"];
            datosEstudiante.estadoConsulta= $scope.solicitudes[indice]["v_estado"];
            var datos = getTextoEspecial($scope.solicitudes[indice]["v_tramite"]);
            datosEstudiante.tipoTramite= datos[0];
            datosEstudiante.textoResidencia= datos[1];         
            window.location.href=('#/carta');
        };                
        $scope.obtenerSolicitudesAtendidas();        
});