angular.module('secretariaModule').controller('cartaCtrl', function($scope,$location,$http, datosEstudiante,peticiones){
    
    numeroInforme=-1;
    departamento="";

    $scope.codigo=localStorage.getItem("sessionToken");
    $scope.id=localStorage.getItem("userId");

    $scope.fechas;
    $scope.mesInicio;
    $scope.mesFin;
    $scope.mesActual;
    $scope.fechaCarta;
    $scope.directora_devesa = "Noidy Salazar Arrieta";
    $scope.sede = "sede regional San Carlos";

    $scope.carnet = datosEstudiante.carnet;
    $scope.elLa = datosEstudiante.elLa;
    $scope.nombreEstudiante = datosEstudiante.nombre;
    $scope.cedulaEstudiante = datosEstudiante.cedulaEstudiante;
    $scope.AO = datosEstudiante.AO;
    $scope.periodoActual;
    $scope.tipoSolicitud = datosEstudiante.tipoTramite;
    $scope.carrera = datosEstudiante.carrera;    
    $scope.textoResidencia = datosEstudiante.textoResidencia;

    /** funcion para verificar que en las cookies exita la fecha de inicio y final de semestre
     *
     */

    $scope.verificar_fechas= function(){
        $scope.fechas =readCookie();

        if ($scope.fechas.length===0)
        {
            mostrarNotificacion("No se tiene registro de las fechas de inicio y final de semestre",1);
            window.location.href =('#/solicitudes');
        }
        else{
            var fecha=new Date();
            console.log(fecha);
            $scope.mesActual=fecha.getMonth()+1;
            $scope.mesActual=setMonth(parseInt($scope.mesActual));
            $scope.mesInicio= $scope.fechas[0].slice(5,7);
            $scope.mesFin=$scope.fechas[1].slice(5,7);
            $scope.mesInicio=setMonth(parseInt($scope.mesInicio));
            $scope.mesFin=setMonth(parseInt($scope.mesFin));
            $scope.periodoActual="el "+$scope.fechas[0].slice(8,10)+" de "+$scope.mesInicio+" del "+$scope.fechas[0].slice(0,4)
            +" hasta el "+$scope.fechas[1].slice(8,10)+" de "+$scope.mesFin+" del "+$scope.fechas[1].slice(0,4);            
            $scope.fechaCarta= "el día "+setDia(parseInt(fecha.getDate()))+" de "+$scope.mesActual+" del "+fecha.getFullYear();
        }

    };

    /*
    *  Función para cambiar el estado de una solicitud de pendiente(false) a realizada(true)
    *
    */
    function cambiarEstado(){
        //Aqui se cambia el estado de las solicitudes
        peticiones.cambiarEstado(datosEstudiante.idConsulta,$scope.id,$scope.codigo)
            .then(function(response){
                window.location.href =('#/solicitudes');
            },function (response) {
                manageErrorResponse(response,"");
            });
        };


    /** Función para redirigir al usuario a la sección de solicitudes, en caso
     *  de cancelar la impresión de la carta
     * 
     */

    /*
    ** Funcion para envar a impresión el contenido de un DIV
    ** divName(String): corresponde al id del div que contiene el texto e imagen de la carta
     */
    $scope.imprimir = function(divName)
    {
        //si la solicitud no había sido atendida, se cambia su estado
        if (datosEstudiante.estadoConsulta==false){
            cambiarEstado();
        }

        document.getElementById('botnImp').style.display = 'none';
        document.getElementById('botnCancel').style.display = 'none';
        var printContents = document.getElementById(divName).innerHTML;
        var popupWin = window.open('', '_blank', 'width=800,height=800');
        popupWin.document.open();
        popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');                
        popupWin.document.close();                              
    };
    $scope.verificar_fechas();
});