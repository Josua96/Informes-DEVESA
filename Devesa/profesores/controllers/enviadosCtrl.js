angular.module('profesorModule')
    .controller('enviadosCtrl', function($scope,$location,$http, datosInforme)
    {
        $scope.misInformes;
        $scope.codigo=localStorage.getItem("sessionToken");
        $scope.idProfesor=localStorage.getItem("userId");
        $scope.sede=localStorage.getItem("sede");
        $scope.tipo="P";

        $scope.obtenerInformes = function()
        {
            $http({
                method : "GET",
                url :API_ROOT+":8081/ObtenerInformesProfesor?profesorID="+ $scope.idProfesor +
                "&iden="+ $scope.idProfesor+ "&codigo="+$scope.codigo + "&sede=" + $scope.sede
            })
                .then(function mySucces(response)
                    {
                        console.log(response);
                        if(response.data!=="false" && response.data!==0)
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
            console.log(informe);
            datosInforme.idProfesor = informe["v_profesorid"];
            datosInforme.idInforme = informe["v_idinforme"];
            datosInforme.area= informe["v_area"];
            datosInforme.actividad= informe["v_actividad"];
            datosInforme.fechaInicio = informe["v_fechainicio"].slice(0, 10);
            datosInforme.fechaFinal = informe["v_fechafinal"].slice(0, 10);
            datosInforme.objetivo= informe["v_objetivo"];
            datosInforme.programa= informe["v_programa"];
            datosInforme.numeroEstudiantes= informe["v_cantestudiantes"];

            window.location.href =('#/profesores/Ver-Editar');
        };
        $scope.obtenerInformes();
    });