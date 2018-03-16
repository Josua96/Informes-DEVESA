angular.module('profesorModule')
    .controller('nuevoCtrl', function($scope,$location,$http, datosProfesor, peticiones)
    {
        var codigo = localStorage.getItem("sessionToken");
        var idProfesor = localStorage.getItem("userId");
        var sede = localStorage.getItem("sede");
        $scope.opciones = AREAS;
        $scope.opcion ="Dirección";
        $scope.nombreSedes = sedes;
        $scope.sedeSeleccionada = $scope.nombreSedes[0];

        /**
         * Envia un informe a la base de datos
         * @param none
         *
         * */
        $scope.enviarInforme = function ()
        {
            // Tiene una lista con los nodos del html
            var datos  = document.getElementsByName("datos");
            var sedeInforme = document.getElementById("sedes").selectedIndex;
            if(noNulos([CODIGOS_AREAS[datos[0].selectedIndex], datos[1].value,datos[2].value, datos[3].value,datos[4].value,datos[5].value, datos[6].value, sedeInforme]))
            {
                var resp = peticiones.nuevoInforme(idProfesor,CODIGOS_AREAS[datos[0].selectedIndex],datos[1].value,datos[2].value,datos[4].value,datos[5].value,datos[6].value,datos[3].value,$scope.nombreSedes[sedeInforme].abreviatura,codigo);
                resp.then(
                    function(response)
                    {
                        mostrarNotificacion("El informe se generó con éxito",2);
                    },
                    function (response) 
                    {   
                        manageErrorResponse(response,"No se pudo generar el informe");
                    });
            }
            else
            {
                mostrarNotificacion("Error: asegurése de ingresar datos en cada uno de los campos requeridos",1);
            }
        };
});