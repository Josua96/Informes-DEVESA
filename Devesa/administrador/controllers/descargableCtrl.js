/**
 * Created by Josua on 11/08/2017.
 */
angular.module('adminModule').controller('descargableCtrl', function($scope,$location,$http,areaInforme,
                                                                     $timeout,Excel,peticionesAdministrador){

    $scope.codigo=localStorage.getItem("sessionToken");
    $scope.id=localStorage.getItem("userId");
    $scope.sede=localStorage.getItem("sede");

    //variable para almacenar el area de la actividad
    $scope.area="Area "+ textoInforme(areaInforme.informeArea);
    //lista de profesores encargados de las actividades del area
    $scope.encargados=[];
    //lista de actividades del area
    $scope.actividades=[];

    /** Dar formato a las fechas
     *
     * @param fecha(Date) fecha del informe
     * @returns {string} La fecha con el formato correcto
     */
    $scope.formatoFecha=function (fecha) {
        return fecha.slice(8,10)+"-"+fecha.slice(5,8)+fecha.slice(0,4);
    };

    

    /** Genera una lista de los id de las personas que registraron informes
     *
     */
    $scope.asignarEncargados=function () {


        /*
        boceto de la funcion a implementar para cargar la informacion

        lista.forEach(
            validacion de si el funcionario no se encontraba ya en la lista //función que estará en el common
            realizar peticion
                aumentar contador
                    validacion de si ya se cargó la información de todos los funcionarios para hacer el callback
        )
         */

        var limite= $scope.actividades.length;
        var i=0;
        for(i=0;i <limite;i++){
            //si el funcionario aún no está en la lista de encargados
            if (estaEnLista($scope.encargados,$scope.actividades[i]["v_funcionarioid"])===false) {
                var diccionario={id:"0",area:"undef"}; //inicializacion del diccionario
                diccionario.id=$scope.actividades[i]["v_funcionarioid"];
                $scope.encargados.push(diccionario); //insertar el diccionario en la lista de encargados
                console.log("insercion");
            }
        }
        console.log($scope.encargados);
    };

    /** Funcion para obtener el nombre de la persona que posee el id recibido por parámetro
     *
     * @param idPersona (string): id de la persona que registró el informe
     */
    $scope.obtenerInformacionEncargado=function (idPersona) {
        
    };

    /** Obtiene los informes registrados para un area en específico
     *
     */
    $scope.obtenerInformesArea=function () {
        
        peticionesAdministrador.obtenerInformesArea(areaInforme.informeArea,$scope.id,$scope.codigo,
            $scope.sede)
            .then(function(response){
                $scope.actividades = response.data;  
                if($scope.actividades.length > 0){
                    $scope.asignarEncargados();
                }
                else{
                    mostrarNotificacion("No se encontraron informes disponibles",1);
                    window.location.href="#/informes";
                }
            },function (response) {
                manageErrorResponse(response,"");

            });
    };

    /** Obtener el nombre completo del área recibida por parametro
     *
     * @param area(String): abreviatura de alguna de las áreas que el sistema reconoce
     * @returns {(String): el texto del área correspondiente}
     */
    $scope.getTextArea=function (area) {
        return textoInforme(area);
    };


    /** Exportar una tabla a excel, y después generar la descarga
     *
     * @param idTabla (String): identificador de la tabla que va a exportarse a excel
     */
    $scope.descargar=function (idTabla) {
        //se llama a la funcion tableToExcel dentro del factory excel
        $scope.exportHref=Excel.tableToExcel('tInforme',textoInforme(areaInforme.informeArea));
        //$timeout(function(){location.href=$scope.exportHref;},100); // trigger download
        $timeout (function () {
            var link = document.createElement ('a');
            link.download = textoInforme(areaInforme.informeArea)+".xls";
            link.href = $scope.exportHref;
            link.click ();
        }, 250);
        window.location.href="#/informes";

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
            if (isConfirm) {
                $scope.descargar(); //generar el descargable
            } else {
               
                window.location.href="#/informes"; 
            }
        });
    };
    

    $scope.obtenerInformesArea();
    $scope.confirmacion();

});

