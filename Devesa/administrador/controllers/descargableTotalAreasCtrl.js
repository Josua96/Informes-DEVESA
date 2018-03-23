/**
 * Created by Josua on 08/09/2017.
 */
/**
 * Created by Josua on 11/08/2017.
 */
angular.module('adminModule').controller('descargableTotalAreasCtrl', function($scope,$location,$http,areaInforme,
                                                                               $timeout,Excel,peticionesAdministrador){

    $scope.codigo=localStorage.getItem("sessionToken");
    $scope.id=localStorage.getItem("userId");
    $scope.sede=localStorage.getItem("sede");
    
    //areas a recorrer
    $scope.areas=CODIGOS_AREAS;
    //lista de funcionarios encargados de las actividades del area
    $scope.encargados=[];
    //lista de actividades del area
    $scope.actividades=[];
    $scope.desde=""; //fecha de inicio para busqueda de los informes
    $scope.hasta=""; //fecha final para busqueda de los informes


    /** Da formato a la fecha del informe
     *
     * @param fecha (DATE): fecha del informe
     * @returns {string} fecha con formato
     */
    $scope.formatearFecha=function (fecha) {
        return fecha.slice(8,10)+"-"+fecha.slice(5,8)+fecha.slice(0,4);
    };


    /** Función para ligar a quienes realizaron informes con el área del informe
     *  Diccionarios de forma {idFuncionario: id , area: area a la que se relaciona}
     *
     */
    $scope.asignarEncargados=function () {
        var limite= $scope.actividades.length;

        var i=0;
        for(i=0;i <limite;i++){
            //si el funcionario aún no está en la lista de encargados
            if (estaEnLista($scope.encargados,$scope.actividades[i]["v_funcionarioid"])==false) {
                var diccionario={id:"0",area:"undef"}; //inicializacion del diccionario
                diccionario.id=$scope.actividades[i]["v_funcionarioid"];
                diccionario.area=$scope.actividades[i]["v_area"];
                $scope.encargados.push(diccionario); //insertar el diccionario en la lista de encargados
            }
        }
        console.log($scope.encargados);
    };

    
    /** Obtener el nombre de un encargado por medio de su id
     *
     * @param idFuncionario (String): id del funcionario
     */
    $scope.obtenerInformacionEncargado=function (idFuncionario) {
        
    };

    /** Obtener los informes registrados entre el rango de fechas especificado por el usuario
     * 
     */
    $scope.obtenerInformesPorFechas=function () {
        //verificar que se hayan seleccionado las dos fechas
        $scope.desde=document.getElementById("date1").value; //obtener fechas seleccionadas
        $scope.hasta=document.getElementById("date2").value;
        
        //verificar que no existan datos nulos
        if (noNulos([$scope.desde,$scope.hasta]) == true)
        {
            if ($scope.desde < $scope.hasta) {
                peticionesAdministrador.obtenerInformesEntreFechas($scope.desde, $scope.hasta, $scope.id, $scope.codigo,
                    $scope.sede)
                    .then(function (response) {
                        $scope.actividades = response.data;
                        if ($scope.actividades.length > 0) { // si existen informes a mostrar
                            $scope.asignarEncargados(); //ir a asignar encargados a la lista de diccionarios de id's de encargados
                            $scope.confirmacion(); //solicitar confirmación para generar el descargable
                        }
                        else {
                            mostrarNotificacion("No se encontraron informes disponibles en ese rango de fechas", 1);

                        }
                    }, function (response) {
                        manageErrorResponse(response, "");

                    });
            }
            else{
                mostrarNotificacion("Error en el rango de fechas, la primera fecha debe ser menor que la segunda",1)
            }
         }
        else{
            mostrarNotificacion("Debe especificar el rango de fechas para buscar los informes", 1);
        }
    };

    /** Obtener el nombre completo del área recibida por parametro
     * 
     * @param area(String): abreviatura de alguna de las áreas que el sistema reconoce 
     * @returns {(String): el texto del área correspondiente}
     */
    $scope.textoArea=function (area) {
        return textoInforme(area);
    };

    /** Exporta la tabla de informes a excel, luego genera la descarga
     * 
     * @param idTabla (String): identificador de la tabla que será convertida a Excel
     */
    $scope.descargar=function (idTabla) {
        //se llama a la funcion tableToExcel dentro del factory excel
        $scope.exportHref=Excel.tableToExcel('tInforme',"Informes "+$scope.desde+" "+$scope.hasta);
        //$timeout(function(){location.href=$scope.exportHref;},100); // trigger download
        $timeout (function () {
            var link = document.createElement ('a');
            link.download ="Informes "+$scope.desde+" "+$scope.hasta+".xls";
            link.href = $scope.exportHref;
            link.click ();
        }, 250);
        mostrarNotificacion("La hoja de excel ha sido generada correctamente",2)

    };

    /** Solicita al usuario que confirme la descarga
     * 
     */
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