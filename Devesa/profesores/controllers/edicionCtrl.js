angular.module('profesorModule')
    .controller('edicionCtrl', function($scope,$location,$http, datosInforme, datosProfesor)
    {
        // Datos que se muestran en la interfaz

        $scope.area= datosInforme.area;
        $scope.idInforme=datosInforme.idInforme;
        $scope.actividad= datosInforme.actividad;
        $scope.fechaInicio= datosInforme.fechaInicio;
        $scope.fechaFinal = datosInforme.fechaFinal;
        $scope.objetivoActividad=datosInforme.objetivo;
        $scope.programa=datosInforme.programa;
        $scope.cantidadEstudiantes=datosInforme.numeroEstudiantes;

        // *********************** Falta asignarle valor real *************************
        $scope.tipo="p";
        $scope.codigo;
        $scope.idProfesor = datosInforme.idProfesor;



        $scope.imagenes=[];


        //Selecciona el area que viene en el infome. (Problema de interfas, esto es un parche)
        var areas = ['DI','SE','AYR','TSR','TSB','PS','BI','DE','CU','SOD','SME','SEN'];
        var i=0;
        var tam = areas.length;
        for(i ; i<tam; i++)
        {
            if(areas[i]===$scope.area)
            {
                break;
            }
        }
        document.getElementById("sel1").selectedIndex=i;


        $scope.eliminarFoto = function(param)
        {
            $http({
                method : "DELETE",
                url :API_ROOT+":8081/EliminarImagen?idInforme="+$scope.idInforme+ "&nombre="+param +
                "&iden="+$scope.idProfesor+"&codigo="+$scope.codigo+"&tipo="+$scope.tipo

            })
                .then(function mySucces(response)
                    {
                        console.log(response);
                        $scope.borrarImagenServidor(param);
                        mostrarNotificacion("Eliminado",2);
                    },
                    function myError(response)
                    {
                        mostrarNotificacion("Error de conexion",1);
                    });
        };



        $scope.borrarImagenServidor = function (nombre)
        {
            $.ajax(
                {url:'eliminar.php?archivo='+nombre, type:'GET'}
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


        $scope.cargarFotos = function ()
        {
            $http(
                {
                    method : "GET",
                    url :API_ROOT+":8081/ObtenerImagenesInforme?idInforme="+ $scope.idInforme +
                    "&iden="+$scope.idProfesor+ "&tipo="+$scope.tipo+"&codigo="+$scope.codigo
                })
                .then(function mySucces(response)
                    {
                        $scope.imagenes = [];
                        if(response.data!==0)
                        {
                            var lista = response.data;
                            var tam = lista.length;
                            for(i=0; i<tam; i++)
                            {
                                $scope.imagenes.push(response.data[i].v_nombre);
                            }
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


        // Permite subir varios archivos al mismo tiempo

        $scope.SubirFotos = function ()
        {
            var archivos = document.getElementById("archivos");
            var archivo = archivos.files;//Obtenemos los archivos seleccionados en el imput
            //Creamos una instancia del Objeto FormDara.
            var archivos = new FormData();
            /* Como son multiples archivos creamos un ciclo for que recorra la el arreglo de los archivos seleccionados en el input
            Este y añadimos cada elemento al formulario FormData en forma de arreglo, utilizando la variable i (autoincremental) como
            indice para cada archivo, si no hacemos esto, los valores del arreglo se sobre escriben*/
            var dat = new Date();
            for(i=0; i<archivo.length; i++) // Añadir configuracion de fecha - milisegundos
            {
                archivos.append('archivo'+i,archivo[i]); //Añadimos cada archivo a el arreglo con un indice direfente
            }
            /*Ejecutamos la función ajax de jQuery*/
            $.ajax({
                url:API_ROOT+':80/DEVESA/profesores/subir.php', //Url a donde la enviaremos
                type:'POST', //Metodo que usaremos
                contentType:false, //Debe estar en false para que pase el objeto sin procesar
                data:archivos, //Le pasamos el objeto que creamos con los archivos
                processData:false, //Debe estar en false para que JQuery no procese los datos a enviar
                cache:false //Para que el formulario no guarde cache
            }).done(function(msg)
            {
                if(msg !== "ERROR")
                {
                    var listaNombres = msg.split(",");
                    var longitud = listaNombres.length-1;
                    for(i=0; i<longitud; i++)
                    {
                        $http({method: "POST",url:API_ROOT+":8081/CrearImagen?idInforme="+$scope.idInforme+"&placa="+listaNombres[i]+
                        "&iden="+ $scope.idProfesor + "&codigo="+ $scope.codigo+"&tipo="+ $scope.tipo})
                            .then(function mySucces(response){},function myError(response){mostrarNotificacion("Ocurrio un error verifique la conexion",1);});
                    }
                }
                else{mostrarNotificacion(msg, 1);}
            });
            mostrarNotificacion("Guardado",2);
            window.location.href =('#/profesores/informesEnviados');
        };


        // Toma todos los datos y los sobreescribe en la BD

        $scope.guardarInforme = function ()
        {
            $scope.fechaActividad = document.getElementById("date2").value;
            if(document.getElementById("sel1").value!=="")
            {
                var Codigoarea = areas[document.getElementById("sel1").value];
                $http(
                    {
                        method: "POST",
                        url:API_ROOT+":8081/ModificarInforme?profesorID="+$scope.idProfesor+
                        "&area=" +Codigoarea+"&actividad="+ $scope.actividad+"&fecha="+
                        $scope.fechaActividad +"&objetivo="+$scope.objetivoActividad +
                        "&programa="+ $scope.programa+ "&cantidadEstudiantes="+ $scope.cantidadEstudiantes+
                        "&id="+$scope.idInforme + "&iden="+ $scope.idProfesor + "codigo=" + $scope.codigo
                    })
                    .then(
                        function mySucces(response)
                        {
                            if(response["data"]==="true")
                            {
                                $scope.SubirFotos();
                            }
                            else{mostrarNotificacion("Ocurrio un error verifique los datos",1);}
                        },
                        function myError(response){mostrarNotificacion("Ocurrio un error verifique la conexion",1);}
                    );
            }
            else
            {
                mostrarNotificacion("Seleccione un area",1);
            }
        };
        $scope.cargarFotos();
    });