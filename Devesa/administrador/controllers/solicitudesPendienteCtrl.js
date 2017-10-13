angular.module('adminModule')
    .controller('pendienteCtrl', function($scope,$location,$http, datosEstudiante) {                
        
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
            url :"http://localhost:8081/ObtenerSolicitudesNoAtendidas"
            }).then(function mySucces(response) 
            {
                    $scope.solicitudes=response.data;  //it does not need a conversion to json
                    $scope.solicitudes=setTextSolicitudes($scope.solicitudes);                    
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