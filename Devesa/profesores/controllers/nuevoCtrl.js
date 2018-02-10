angular.module('profesorModule')
    .controller('nuevoCtrl', function($scope,$location,$http, datosProfesor, peticiones)
    {
        var codigo = localStorage.getItem("sessionToken");
        var idProfesor = localStorage.getItem("userId");
        var sede = localStorage.getItem("sede");
        $scope.opciones = AREAS;


        // Recolecta los datos del formulario, los verifica y los envia a la BD
        $scope.enviarInforme = function ()
        {
            // Tiene una lista con los nodos del html
            var datos  = document.getElementsByName("datos");
            if(noNulos([CODIGOS_AREAS[datos[0].selectedIndex], datos[1].value,datos[2].value, datos[3].value,datos[4].value,datos[5].value, datos[6].value]))
            {
                var resp = peticiones.nuevoInforme(idProfesor,CODIGOS_AREAS[datos[0].selectedIndex],datos[1].value,datos[2].value,datos[4].value,datos[5].value,datos[6].value,datos[3].value,sede,codigo);
                resp.then
                (   function exito(response)
                    {
                        if(response.data==="true")
                        {
                            mostrarNotificacion("La solocitud ha sido agregada",2);
                        }
                        else
                        {
                            mostrarNotificacion("Ocurrió un error y no fue posible agregar la solicitud",1);
                        }
                    },
                    function error(response)
                    {
                        mostrarNotificacion("Ocurrió un error y no fue posible agregar la solicitud",1);
                    }
                );
            }
            else
            {
                mostrarNotificacion("Asegurése de ingresar datos en cada uno de los campos requeridos",1);
            }
        };
});