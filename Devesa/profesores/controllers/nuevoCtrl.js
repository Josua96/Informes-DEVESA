angular.module('profesorModule')
    .controller('nuevoCtrl', function($scope,$location,$http, datosProfesor)
    {
        $scope.area;
        $scope.actividad;
        $scope.fechaInicio;
        $scope.fechaFinal;
        $scope.objetivoActividad;
        $scope.programa;
        $scope.cantidadEstudiantes=0;

        // ********** Falta asignarle el valor real *******************
        $scope.sede = "SC";
        $scope.idProfesor="1234567890";
        $scope.codigo;


        $scope.opciones =[
            {area:"Dirección", codigo:'DI'},
            {area:"Secretaría", codigo:'SE'},
            {area:"Admisión y Registro", codigo:'AYR'},
            {area:"Trabajo Social Residencias", codigo:'TSR'},
            {area:"Trabajo Social Becas", codigo: 'TSB'},
            {area:"Psicología", codigo:'PS'},
            {area:"Biblioteca", codigo:'BI'},
            {area:"Deportivas", codigo:'DE'},
            {area:"Culturales", codigo:'CU'},
            {area:"Salud -> Odontología", codigo:'SOD'},
            {area:"Salud -> Médico", codigo:'SME'},
            {area:"Salud -> Enfermería", codigo:'SEN'}];

        $scope.enviarInforme = function ()
        {
            $scope.fechaActividad=document.getElementById("date2").value;
            var Codigoarea;
            $scope.fechaFinActividad =  document.getElementById("date3").value;

            if(document.getElementById("sel1").value!=="")
            {
                Codigoarea = $scope.opciones[document.getElementById("sel1").value].codigo;
                $http(
                    {
                        method: "POST",
                        url:API_ROOT+":8081/CrearInforme?profesorID="+$scope.idProfesor+"&area=" + Codigoarea +
                        "&actividad="+ $scope.actividad+"&fechaInicio="+ $scope.fechaInicio +
                        "&objetivo="+$scope.objetivoActividad +"&programa="+ $scope.programa+
                        "&cantidadEstudiantes="+ $scope.cantidadEstudiantes + "&fechaFinal="+ $scope.fechaFinal +
                        "&sede="+ $scope.sede + "&iden="+ $scope.idProfesor + "&codigo=" + $scope.codigo
                    })
                    .then(function mySucces(response)
                    {
                        console.log(response);
                        if(response["data"]==="true")
                        {
                            mostrarNotificacion("El informe a sido enviado con exito",2);
                            window.location.href =('#/profesores/informesEnviados');
                        }
                        else
                        {
                            mostrarNotificacion("Ocurrio un error verifique los datos",1);
                        }
                    },function myError(response)
                    {
                        mostrarNotificacion("Ocurrio un error verifique la conexion",1);
                    });
            }
            else
            {
                mostrarNotificacion("Seleccione un area",1);
                return ;
            }
        };
    });