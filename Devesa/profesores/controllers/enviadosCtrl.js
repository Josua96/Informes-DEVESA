angular.module('profesorModule')
    .controller('enviadosCtrl', function($scope,$location,$http, datosInforme, peticiones)
    {
        var codigo=localStorage.getItem("sessionToken");
        var idProfesor=localStorage.getItem("userId");
        var sede=localStorage.getItem("sede");
        $scope.misInformes;

        // Modifica la variable "misInformes", con los informes que ha enviado un determinado profesor.
        $scope.obtenerInformes = function()
        {
            var datos = peticiones.informesProfesor(idProfesor, codigo, sede);
            datos.then
            (
                function exito(response)
                {
                    if(response.data!=="false" && response.data!==0 &&response.data!==[])
                    {
                        $scope.misInformes = response.data;
                    }
                    else
                    {
                        mostrarNotificacion("No hay informes de actividades",3);
                    }
                },
                function error(response)
                {
                    mostrarNotificacion("Error de conexion",1);
                }
            );
        };

        // Redirige al usuario a la seccion "Editar informe", pero antes carga los datos en un factory que almacena los
        // datos temporalmente.
        $scope.editarInformes = function(indice)
        {
            var informe = $scope.misInformes[indice];
            
            datosInforme.idProfesor = informe["v_profesorid"];
            datosInforme.idInforme = informe["v_idinforme"];
            datosInforme.area = informe["v_area"];
            datosInforme.actividad = informe["v_actividad"];
            datosInforme.fechaInicio = informe["v_fechainicio"].slice(0, 10);
            datosInforme.fechaFinal = informe["v_fechafinal"].slice(0, 10);
            datosInforme.objetivo= informe["v_objetivo"];
            datosInforme.programa= informe["v_programa"];
            datosInforme.numeroEstudiantes= informe["v_cantestudiantes"];
            window.location.href = ('#/profesores/Ver-Editar');
        };
        $scope.obtenerInformes();
    });