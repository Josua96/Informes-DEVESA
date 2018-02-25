angular.module('adminModule')
    .controller('informesCtrl', function($scope,$location,$http,idInformeEnCurso,areaInforme,Excel,peticionesAdministrador)
    {
        $scope.codigo=localStorage.getItem("sessionToken");
        $scope.id=localStorage.getItem("userId");
        $scope.sede=localStorage.getItem("sede");

        $scope.seleccionado="Dirección";
        $scope.tipoInformes = CODIGOS_AREAS;
        $scope.informesArea=[];
        $scope.opciones= AREAS;


        /** Retornar a partir de la aberviatura del area, el texto correspondiente para la misma
         * 
         * @param area (String) : Abreviatura que representa a un area
         * @returns {String: el nombre completo del area}
         */
        //funcion para 
        $scope.getTextoArea = function (area) {
            return textoInforme(area);
        };

        /** Función que da formato a una fecha
         * 
         * @param fecha (date): Fecha del informe (contiene datos de tiempo que son los que se eliminan)
         * @returns {string: la fecha con el formato correcto}
         */
        
        $scope.formatoFecha= function (fecha) {
            return fecha.slice(8,10)+"-"+fecha.slice(5,8)+fecha.slice(0,4);
        };

        /** Obtiene los informes correspondientes al area seleccionada por el usuario
         * 
         */
        $scope.mostrarInformes= function() {
            var indice = document.getElementById("selector").selectedIndex;
            if(indice===-1)
            {
                indice=0;
            }
            
            if (indice !== undefined) {
                {
                    peticionesAdministrador.obtenerInformesArea($scope.tipoInformes[indice],$scope.id,$scope.codigo,$scope.sede)
                        .then(function(response){
                            if (response.data.length > 0 ){
                                $scope.informesArea = response.data;
                            }
                            else{
                                mostrarNotificacion("No existen informes registrados para esta área",3);
                            }
                        },function (response) {
                            manageErrorResponse(response,"");
                        });
                        areaInforme.informeArea= $scope.tipoInformes[indice];
                    
                }
            }
        };


        /** Redirige al usuario a una vista en la que se despliega con mayor detalle el informe seleccionado 
         * 
         * @param indice (Int): representa la fila de la tabla que fué seleccionada
         */
        $scope.verMas=function (indice)
        {
            alert("indice "+ indice+" idInforme: "+$scope.informesArea[indice]["v_idinforme"]);
            idInformeEnCurso.numeroInforme =$scope.informesArea[indice]["v_idinforme"];
            idInformeEnCurso.departamento=$scope.informesArea[indice]["v_area"];
            window.location.href=("#/imagenesInforme");
        };

        /** Redirige al usuario a una vista en la que se descargan los informes
         *  del area seleccionada
         */
        $scope.descargar=function () {
            //validar que se haya seleccionado un area de informmes y que de ese informe se tenga aunque sea un registro
            if ((document.getElementById("selector").selectedIndex.value===undefined)&&
                (document.getElementById("tablaInforme").rows.length>0))  
            {
                window.location.href=("#/descargables");
            }
            else{
                mostrarNotificacion("Asegúrese de seleccionar un área y que esta contenga al menos un informe",1);
            }
        };
        
        $scope.mostrarInformes();
    });