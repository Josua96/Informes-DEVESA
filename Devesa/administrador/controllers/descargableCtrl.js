/**
 * Created by Josua on 11/08/2017.
 */
angular.module('adminModule').controller('descargableCtrl', function($scope,$location,$http,areaInforme,$timeout,Excel){

    //variable para almacenar el area de la actividad
    $scope.area="Area "+ textoInforme(areaInforme.informeArea);
    //lista de profesores encargados de las actividades del area
    $scope.encargados=[];
    //lista de actividades del area
    $scope.actividades=[];
    $scope.revertir=function (cadena) {
        return cadena.slice(8,10)+"-"+cadena.slice(5,8)+cadena.slice(0,4);
    }


    /* agregar la fecha final*/

    $scope.asignarEncargados=function () {
        var limite= $scope.actividades.length;
        console.log("limite = "+limite);
        var i=0;
        for(i=0;i <limite;i++){
            //si el funcionario aún no está en la lista de encargados
            if (estaEnLista($scope.encargados,$scope.actividades[i]["v_profesorid"])==false) {
                var diccionario={id:"0",area:"undef"}; //inicializacion del diccionario
                diccionario.id=$scope.actividades[i]["v_profesorid"];
                $scope.encargados.push(diccionario); //insertar el diccionario en la lista de encargados
                console.log("insercion");
            }
        }
        console.log($scope.encargados);
    }
    
    //funcion para obtener el nombre de los encargados de las actividades atraves de endpoint
    $scope.obtenerEncargados=function () {
        
    }
    
    //obtener las actividades realizadas de un area en especifico
    $scope.obtenerInformesArea=function () {
        $http({
            method: "GET",
            url: "http://localhost:8081/ObtenerInformesArea?area=" +areaInforme.informeArea
        }).then(function mySucces(response) {
            $scope.actividades = response.data;  //it does not need a conversion to json
            if($scope.actividades.length > 0){
                console.log($scope.actividades);
                $scope.asignarEncargados();
            }
            else{
                mostrarNotificacion("No se encontraron informes disponibles",1);
                window.location.href="#/informes";
            }
            
        }, function myError(response) {
            mostrarNotificacion("Ocurrio un error de conexión", 1);
        });
    }

    //obtener el texto de area correctamente
    $scope.textoArea=function (texto) {
        return textoInforme(texto);
    }


    $scope.descargar=function (idTabla) {
        //se llama a la funcion tableToExcel dentro del factory excel
        $scope.exportHref=Excel.tableToExcel('tInforme',textoInforme(areaInforme.informeArea));
        //$timeout(function(){location.href=$scope.exportHref;},100); // trigger download
        $timeout (function () {
            var link = document.createElement ('a');
            link.download = textoInforme(areaInforme.informeArea)+".xls";
            link.href = $scope.exportHref;
            link.click ();
        }, 100);
        window.location.href="#/informes";

    }
    
    //pedir confirmacion para generar el descargable
    $scope.confirmacion=function () {
        
        swal({ //mostrar cuadro de dialogo para confirmacion del proceso 
                title: "¿Generar descargable?",
                text: "Confirme la petición para continuar con el proceso",
                type: "warning",
                showCancelButton: true,
                cancelButtonText: "Cancelar",
                confirmButtonClass: "btn-danger",
                confirmButtonText: "Generar",
                closeOnConfirm: true,
                closeOnCancel: true
            },function(isConfirm) {
            if (isConfirm) {
                $scope.descargar(); //generar el descargable
            } else {
               
                window.location.href="#/informes"; 
            }
        });
    }
    

    $scope.obtenerInformesArea();
    $scope.confirmacion();

});

