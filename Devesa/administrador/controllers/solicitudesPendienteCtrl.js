angular.module('adminModule')
    .controller('pendienteCtrl', function($scope,$location,$http, datosEstudiante) {

        $scope.codigo=localStorage.getItem("sessionToken");
        $scope.id=localStorage.getItem("userId");
        $scope.sede=localStorage.getItem("sede");
        
        numeroInforme=-1;
        departamento="";
        $scope.carnet;
        $scope.tramite;
        $scope.solicitudes;
        $scope.idCosulta;                
        $scope.actualizarInfo = function()
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
            //imprimir una fila (solicitud)segun el indice
        $scope.imprimir= function (indice) 
        {
            datosEstudiante.carnet = $scope.solicitudes[indice]["v_carne"];
            datosEstudiante.idConsulta = $scope.solicitudes[indice]["v_idsolicitud"];
            var datos = getTextoEspecial( $scope.solicitudes[indice]["v_tramite"]);
            datosEstudiante.tipoTramite= datos[0];
            datosEstudiante.textoResidencia= datos[1];
            window.location.href=('#/carta');
        };                
        $scope.actualizarInfo();        
});