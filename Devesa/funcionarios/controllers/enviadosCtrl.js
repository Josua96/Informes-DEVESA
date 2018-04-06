angular.module('funcionarioModule')
    .controller('enviadosCtrl', function($scope,$location,$http, datosInforme, peticiones)
    {
        var codigo=localStorage.getItem("sessionToken");
        var idFuncionario=localStorage.getItem("userId");
        var sede=localStorage.getItem("sede");
        $scope.misInformes;

        $scope.paginaActual=1;
        $scope.cantidadElementos=elementosPorPagina;
        $scope.maximoElementos= maxSize;

        
        /**
         * Realiza un request y modifica la varable "misInformes", con los informes que ha enviado 
         * un determinado profesor.
         *
         * @param none
         * @returns none
         */

        $scope.obtenerInformes = function()
        {
            var datos = peticiones.informesFuncionario(idFuncionario, codigo);

            datos.then
            (
                function exito(response)
                {
                    if(response.data.length > 0)
                    {
                        console.log(response);
                        $scope.misInformes = setTextInformes(response.data);
                        console.log($scope.misInformes);
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

        /**
         * Permite eliminar un informe, pero antes le pide la confirmacion al usuarion.
         *
         * @param {number} ind  // recive un indice
         * */

        $scope.eliminarConfirmacion= function (ind)
        {
            swal({ //mostrar cuadro de dialogo para confirmacion del proceso de eliminado
                    title: "Eliminar informe?",
                    text: "Una vez eliminado no habrá forma de recuperarlo!",
                    type: "warning",
                    showCancelButton: true,
                    cancelButtonText: "Cancelar",
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "Continuar",
                    closeOnConfirm: true,
                    closeOnCancel: true
                },
                function()
                {
                    var indice= getRealIndex(ind,$scope.cantidadElementos,$scope.paginaActual);

                    peticiones.eliminarInforme($scope.misInformes[indice]["v_idinforme"],idFuncionario,codigo)
                        .then(function(response){
                            $scope.misInformes.splice(indice,1);
                            mostrarNotificacion("Eliminado",2);
                        },function (response) {

                            manageErrorResponse(response,"Ocurrio un error");
                        });
                });
        };

        /**         
         * Redirige al usuario a la seccion "Editar informe", pero antes carga los datos en un factory que almacena los
         * datos temporalmente. Se necesita conocer el informe que se quiere editar por eso debe proporcionarce el indice. 
         * 
         * @param {number} indiceFila 
         * @return 
         */
        $scope.editarInformes = function(indiceFila)
        {
            //el indice real, la posicion en la que se encuentra el elemento dentro del arreglo
            var indice= getRealIndex(indiceFila,$scope.cantidadElementos,$scope.paginaActual);
            var informe = $scope.misInformes[indice];

            datosInforme.idFuncionario = informe["v_funcionarioid"];
            datosInforme.idInforme = informe["v_idinforme"];
            datosInforme.area = informe["v_area"];
            datosInforme.actividad = informe["v_actividad"];
            datosInforme.fechaInicio = informe["v_fechainicio"].slice(0, 10);
            datosInforme.fechaFinal = informe["v_fechafinal"].slice(0, 10);
            datosInforme.objetivo= informe["v_objetivo"];
            datosInforme.programa= informe["v_programa"];
            datosInforme.numeroEstudiantes= informe["v_cantestudiantes"];
            datosInforme.sede = informe["v_sede"];
            window.location.href = ('#/funcionarios/Ver-Editar');
        };
        $scope.obtenerInformes();
    });