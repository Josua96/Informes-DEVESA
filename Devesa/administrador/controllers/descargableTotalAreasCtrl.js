/**
 * Created by Josua on 08/09/2017.
 */
/**
 * Created by Josua on 11/08/2017.
 */
angular.module('adminModule').controller('descargableTotalAreasCtrl', function($scope,$location,$http,areaInforme,$timeout,Excel){

    $scope.codigo=localStorage.getItem("sessionToken");
    $scope.id=localStorage.getItem("userId");
    $scope.sede=localStorage.getItem("sede");
    
    //areas a recorrer
    $scope.areas=["DI","SE","AYR","TS","PS","BI","SOD","SME","SEN","CU","DE"];
    //lista de profesores encargados de las actividades del area
    $scope.encargados=[];
    //lista de actividades del area
    $scope.actividades=[];
    $scope.desde=""; //fecha de inidcio para busqueda de los informes
    $scope.hasta=""; //fecha final para busqueda de los informes
    
    $scope.revertir=function (cadena) {
        return cadena.slice(8,10)+"-"+cadena.slice(5,8)+cadena.slice(0,4);
    };

    //funcion para agregar id's  de quien realiza los informes a diccionarios de la forma {idFuncionario: area}
    //el id de un funcionario solo se almacenará una vez
    $scope.asignarEncargados=function () {
        var limite= $scope.actividades.length;

        var i=0;
        for(i=0;i <limite;i++){
            //si el funcionario aún no está en la lista de encargados
            if (estaEnLista($scope.encargados,$scope.actividades[i]["v_profesorid"])==false) {
                var diccionario={id:"0",area:"undef"}; //inicializacion del diccionario
                diccionario.id=$scope.actividades[i]["v_profesorid"];
                diccionario.area=$scope.actividades[i]["v_area"];
                $scope.encargados.push(diccionario); //insertar el diccionario en la lista de encargados
            }
        }
        console.log($scope.encargados);
    };

    //funcion para obtener el nombre de un encargado por medio de su id
    $scope.obtenerInformacionEncargado=function (idFuncionario) {
        
    };

    //obtener las actividades realizadas de un area en especifico
    $scope.obtenerInformesPorFechas=function () {
        //verificar que se hayan seleccionado las dos fechas
        $scope.desde=document.getElementById("date1").value; //obtener fechas seleccionadas
        $scope.hasta=document.getElementById("date2").value;
        
        //verificar que no existan datos nulos
        if (noNulos([$scope.desde,$scope.hasta]) == true)
        {
            $http({
                method: "GET",
                url: API_ROOT+":8081/ObtenerInformesRango?fecha_uno=" + $scope.desde + "&fecha_dos=" + $scope.hasta+"&iden="
                +$scope.id+"&codigo="+$scope.codigo+"&sede="+$scope.sede
            }).then(function mySucces(response) {
                $scope.actividades = response.data;  
                console.log('actividades');
                console.log($scope.actividades);
                console.log('largo de ativivdades '+$scope.actividades.length);
                if ($scope.actividades.length > 0) { // validacion de que existan informes a mostrar
                    console.log('entre con legnth');
                    $scope.asignarEncargados(); //ir a asignar encargados a la lista de diccionarios de id's de encargados
                    $scope.confirmacion(); //solicitar confirmación para generar el descargable
                }
                else {
                    mostrarNotificacion("No se encontraron informes disponibles en ese rango de fechas", 1);

                }
            }, function myError(response) {
                mostrarNotificacion("Ocurrio un error", 1);
            });
         }
        else{
            mostrarNotificacion("Debe especificar el rango de fechas para buscar los informes", 1);
        }
    };

    //obtener el texto de area correctamente
    $scope.textoArea=function (texto) {
        return textoInforme(texto);
    };


    $scope.descargar=function (idTabla) {
        //se llama a la funcion tableToExcel dentro del factory excel
        $scope.exportHref=Excel.tableToExcel('tInforme',"Informes "+$scope.desde+" "+$scope.hasta);
        //$timeout(function(){location.href=$scope.exportHref;},100); // trigger download
        $timeout (function () {
            var link = document.createElement ('a');
            link.download ="Informes "+$scope.desde+" "+$scope.hasta+".xls";
            link.href = $scope.exportHref;
            link.click ();
        }, 100);
        mostrarNotificacion("La hoja de excel ha sido generada correctamente",2)

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
            if (isConfirm) { //si se confirma la generacion del descargable

                $scope.descargar(); //generar el descargable
            } else {

                window.location.href="#/informes";
            }
        });
    }
    
    
});