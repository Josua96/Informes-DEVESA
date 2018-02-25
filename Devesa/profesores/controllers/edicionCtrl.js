angular.module('profesorModule')
    .controller('edicionCtrl', function($scope,$location,$http, datosInforme, peticiones)
    {
        $scope.informe = datosInforme;
        var codigo=localStorage.getItem("sessionToken");
        var idFuncionario=localStorage.getItem("userId");
        var sede=localStorage.getItem("sede");

        $scope.opcion;
        $scope.imagenes=[];
        $scope.opciones = AREAS;

        

        /**
         * Permite eliminarConfirmacion una imagen del la base de datos
         *
         * @param {any} nombreImagen es un String
         * @returns none
         */

        $scope.eliminarFoto = function(nombreImagen)
        {
            var respuesta = peticiones.eliminarFoto($scope.informe.idInforme,nombreImagen,idFuncionario,codigo);
            respuesta.then
            (   function exito(response)
                {
                    if(response.data==="false")
                    {
                        mostrarNotificacion("No se eliminó",1);
                    }
                    else
                    {
                        $scope.borrarImagenServidor(nombreImagen);
                        $scope.cargarFotos();
                    }
                },
                function error(response)
                {
                    mostrarNotificacion("Error de conexion",1);
                }
            );
        };


        /**
         * Permite borrar una imagen del servidor
         *
         * @param nombre es un String
         * @returns none
         */
        $scope.borrarImagenServidor = function (nombre)
        {
            $.ajax(
                {url:API_ROOT+':8080/DEVESA/eliminar.php?archivo='+nombre, type:'GET'}
            )
                .done(function(msg)
                {
                    if(msg !== "ERROR")
                    {
                        console.log("BORRADO");
                        $scope.cargarFotos();
                    }
                    else{mostrarNotificacion(msg, 1);}
                });
        };

        /**
         * Permite cargar los nombres de las imagenes
         *
         * @param  none
         * @returns none
         */
        $scope.cargarFotos = function ()
        {

            var respuesta = peticiones.obtenermagenesInforme($scope.informe.idInforme,idFuncionario,"P",codigo);
            respuesta.then
            (   function exito(response)
                {
                    $scope.imagenes= response.data;

                },
                function error(response)
                {
                    mostrarNotificacion("No hay imagenes relacionadas",1);
                }
            );
        };


        /**
         * Permite cargar archivos al servidor.
         *
         * @param none
         * @returns none
         */
        $scope.subirFotos = function ()
        {
            var archivos = document.getElementById("archivos");
            var archivo = archivos.files;
            var archivos = new FormData();
            var dat = new Date();
            for(i=0; i<archivo.length; i++)
            {
                archivos.append('archivo'+i,archivo[i]);
            }

            $.ajax({url:API_ROOT+':8080/DEVESA/subir.php', type:'POST', contentType:false, data:archivos, processData:false, cache:false}).done(
                function(msg)
                {
                    if(msg !== "ERROR")
                    {
                        var listaNombres = msg.split(",");
                        var longitud = listaNombres.length-1;
                        for(i=0; i<longitud; i++)
                        {
                            var respuesta = peticiones.registrarImagenes($scope.informe.idInforme, listaNombres[i],idFuncionario, codigo,"P");
                            respuesta.then
                            (   function exito(response) {},

                                function error(response) {}
                            );
                        }
                    }
                    else
                    {
                        mostrarNotificacion("Error al cargar la imagen", 1);
                    }
                });

                mostrarNotificacion("Guardado",2);
                window.location.href =('#/profesores/informesEnviados');
        };


        /**
         * Envia la informacion a la base de datos
         * @param none
         * @returns none
         */
        $scope.guardarInforme = function ()
        {
            $scope.fechaActividad = document.getElementById("date2").value;
            if(noNulos([AREAS[document.getElementById("sel1").selectedIndex], $scope.informe.area, $scope.informe.actividad,
                    $scope.informe.fechaFinal, $scope.informe.fechaInicio,$scope.informe.objetivo,
                    $scope.informe.programa,   $scope.informe.numeroEstudiantes])===true)
            {
                var codigoArea = CODIGOS_AREAS[document.getElementById("sel1").selectedIndex];
                var respuesta = peticiones.modificarInforme(codigoArea, $scope.informe.actividad, $scope.informe.fechaInicio, $scope.informe.fechaFinal, $scope.informe.objetivo, $scope.informe.programa, $scope.informe.numeroEstudiantes,idFuncionario,codigo, $scope.informe.idInforme);
                respuesta.then
                (   function exito(response)
                    {
                        $scope.subirFotos();

                    },
                    function error(response)
                    {
                        mostrarNotificacion("Ocurrió un error y no fue editar el informe",1);
                    }
                );
            }
            else
            {
                mostrarNotificacion("Asegurése de ingresar datos en cada uno de los campos requeridos",1);
            }
        };

        $scope.opcion = ubicarDepartamento($scope.informe.area);
        $scope.cargarFotos();

    });