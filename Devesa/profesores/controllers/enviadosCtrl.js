angular.module('profesorModule')
    .controller('enviadosCtrl', function($scope,$location,$http, datosInforme)
    {
        $scope.misInformes;
        $scope.idProfesor = "1234567890";

        $scope.obtenerInformes = function()
        {
            $http({
                method : "GET",
                url :API_ROOT+":8081/ObtenerInformesProfesor?profesorID="+ $scope.idProfesor +
                "&iden="+ $scope.idProfesor+ "&codigo="+$scope.codigo + "&sede=" + $scope.sede
            })
                .then(function mySucces(response)
                    {
                        if(response.data!==0)
                        {
                            $scope.misInformes = response.data;
                            console.log($scope.misInformes);
                        }
                        else
                        {
                            mostrarNotificacion("No hay informes de actividades",3);
                        }
                    },
                    function myError(response)
                    {
                        mostrarNotificacion("Error de conexion",1);
                    });
        };

        $scope.editarInformes = function(indice)
        {
            var informe =$scope.misInformes[indice];
            datosInforme.idProfesor = informe["v_profesorid"];
            datosInforme.idInforme = informe["v_idinforme"];
            datosInforme.area= informe["v_area"];
            datosInforme.actividad= informe["v_actividad"];
            datosInforme.fechaInicio = informe["v_fechaInicio"].slice(0, 10);
            datosInforme.fechaFinal = informe["v_fechaFinal"].slice(0, 10);
            datosInforme.objetivo= informe["v_objetivo"];
            datosInforme.programa= informe["v_programa"];
            datosInforme.numeroEstudiantes= informe["v_cantestudiantes"];

            window.location.href =('#/profesores/Ver-Editar');
        };
        $scope.obtenerInformes();
    });