angular.module('adminModule')
    .controller('informesCtrl', function($scope,$location,$http,idInformeEnCurso,areaInforme,Excel,$timeout)
    {
        $scope.codigo=localStorage.getItem("sessionToken");
        $scope.id=localStorage.getItem("userId");
        $scope.sede=localStorage.getItem("sede");

        $scope.seleccionado="Dirección";
        $scope.tipoInformes = CODIGOS_AREAS;
        $scope.informesArea=[];
        $scope.opciones= AREAS;


        //funcion para retornar a partir de la aberviatura del area, el texto correspondiente para la misma
        $scope.texto = function (text) {
            return textoInforme(text);
        };

        //funcion que da formato a una fecha;
        $scope.revertir = function (cadena) {
            return cadena.slice(8,10)+"-"+cadena.slice(5,8)+cadena.slice(0,4);
        };
        $scope.mostrarInformes= function() {
            var indice = document.getElementById("selector").selectedIndex;
            if(indice===-1)
            {
                indice=0;
            }
            console.log("indice"+indice);
            if (indice !== undefined) {
                {
                    $http({
                        method: "GET",
                        url: API_ROOT+":8081/ObtenerInformesArea?area=" + $scope.tipoInformes[indice]+"&iden="
                        +$scope.id+"&codigo="+$scope.codigo+"&sede="+$scope.sede
                    }).then(function mySucces(response) {
                        $scope.informesArea = response.data;  //it does not need a conversion to json
                        console.log($scope.informesArea);
                    }, function myError(response) {
                        mostrarNotificacion("Ocurrio un error", 1);
                    });
                    areaInforme.informeArea= $scope.tipoInformes[indice];
                }
            }
        };




        $scope.verMas=function (indice)
        {
            numeroInforme =$scope.informesArea[indice]["v_idinforme"];
            departamento=$scope.informesArea[indice]["v_area"];
            window.location.href=("#/imagenesInforme");
        };

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