angular.module('profesorModule')
    .controller('edicionCtrl', function($scope,$location,$http, datosInforme, peticiones)
    {
        $scope.informe = datosInforme;
        var codigo=localStorage.getItem("sessionToken");
        var idProfesor=localStorage.getItem("userId");
        var sede=localStorage.getItem("sede");
        $scope.opcion;
        $scope.imagenes=[];
        $scope.opciones = AREAS;

        // Permite ibicar el select en la posicion correcta
        function ubicarDepartamento()
        {
            var tam = CODIGOS_AREAS.length;
            for(var i=0 ; i<tam; i++)
            {
                if(CODIGOS_AREAS[i]===$scope.informe.area)
                {
                    $scope.opcion = AREAS[i];
                }
            }
        }
        ubicarDepartamento();


        // Permite eliminar una foto asociada a un informe tanto de la base de datos como del servidor.
        $scope.eliminarFoto = function(param)
        {
            var respuesta = peticiones.eliminarFoto($scope.informe.idInforme,param,idProfesor,codigo,'P');
            respuesta.then
            (   function exito(response)
                {
                    if(response.data==="false")
                    {
                        mostrarNotificacion("No se eliminó",1);
                    }
                    else
                    {
                        $scope.borrarImagenServidor(param);
                        $scope.cargarFotos();
                    }
                },
                function error(response)
                {
                    mostrarNotificacion("Error de conexion",1);
                }
            );
        };

        $scope.borrarImagenServidor = function (nombre)
        {
            $.ajax(
                {url:API_ROOT+':80/DEVESA/'+'eliminar.php?archivo='+nombre, type:'GET'}
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


        // Realiza la consulta a la base de datos acerca de las imagenes de cada informe y los guarda en la variable "imagenes".
        $scope.cargarFotos = function ()
        {

            var respuesta = peticiones.obtenermagenesInforme($scope.informe.idInforme,idProfesor,"P",codigo);
            respuesta.then
            (   function exito(response)
                {
                    if(response.data==="false")
                    {
                        mostrarNotificacion("Ocurrió un error y no fue posible editar el informe",1);
                    }
                    else
                    {
                        $scope.imagenes = response.data;
                        console.log($scope.imagenes);
                    }
                },
                function error(response)
                {
                    mostrarNotificacion("Ocurrió un error y no fue editar el informe",1);
                }
            );
        };



        // Permite subir fotos de las actividades.
        $scope.subirFotos = function ()
        {
            var archivos = document.getElementById("archivos");
            var archivo = archivos.files;
            var archivos = new FormData();
            var dat = new Date();
            for(i=0; i<archivo.length; i++) // Añadir configuracion de fecha - milisegundos
            {
                archivos.append('archivo'+i,archivo[i]);
            }

            $.ajax({url:API_ROOT+':80/DEVESA/subir.php', type:'POST',
                contentType:false,
                data:archivos,
                processData:false,
                cache:false
            }).done(function(msg)
            {
                if(msg !== "ERROR")
                {
                    var listaNombres = msg.split(",");
                    var longitud = listaNombres.length-1;
                    for(i=0; i<longitud; i++)
                    {
                        console.log($scope.informe.idInforme);
                        var respuesta = peticiones.registrarImagenes($scope.informe.idInforme, listaNombres[i],idProfesor, codigo,"P");
                        respuesta.then
                        (   function exito(response)
                            {
                                console.log("Exito");
                            },
                            function error(response)
                            {

                            }
                        );
                        console.log("ciclo: "+i);
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



        // Toma los datos del formulario y los escribe en la BD.
        $scope.guardarInforme = function ()
        {
            $scope.fechaActividad = document.getElementById("date2").value;
            if(noNulos([AREAS[document.getElementById("sel1").selectedIndex], $scope.informe.area, $scope.informe.actividad,  $scope.informe.fechaFinal, $scope.informe.fechaInicio,$scope.informe.objetivo, $scope.informe.programa,   $scope.informe.numeroEstudiantes])===true)
            {
                var codigoArea = CODIGOS_AREAS[document.getElementById("sel1").selectedIndex];
                var respuesta = peticiones.modificarInforme(codigoArea, $scope.informe.actividad, $scope.informe.fechaInicio, $scope.informe.fechaFinal, $scope.informe.objetivo, $scope.informe.programa, $scope.informe.numeroEstudiantes,idProfesor,codigo, $scope.informe.idInforme);
                respuesta.then
                (   function exito(response)
                    {
                        if(response.data==="false")
                        {
                            mostrarNotificacion("Ocurrió un error y no fue posible editar el informe",1);
                        }
                        else
                        {
                            $scope.subirFotos();
                        }
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
        $scope.cargarFotos();
    });