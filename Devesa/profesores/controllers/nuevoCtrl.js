angular.module('profesorModule')
    .controller('nuevoCtrl', function($scope,$location,$http, datosProfesor)
    {
        $scope.area;
        $scope.actividad;
        $scope.objetivoActividad;
        $scope.programa;
        $scope.cantidadEstudiantes=0;

        // ********** Falta asignarle el valor real *******************
        $scope.codigo=localStorage.getItem("sessionToken");
        $scope.idProfesor=localStorage.getItem("userId");
        $scope.sede=localStorage.getItem("sede");
        $scope.tipo="P";


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
            $scope.fechaFinActividad =  document.getElementById("date3").value;
            var Codigoarea;

            //verificar que ninguna entrada tenga un valor nulo
            if  ( noNulos([document.getElementById("sel1").value,$scope.fechaActividad,$scope.fechaFinActividad,
                $scope.area,$scope.actividad,$scope.objetivoActividad,$scope.programa,$scope.cantidadEstudiantes]
                    )==true)
            {
                Codigoarea = $scope.opciones[document.getElementById("sel1").value].codigo;

                console.log("Probando ");
                $http(
                    {
                        method: "POST",
                        url:API_ROOT+":8081/CrearInforme?profesorID="+$scope.idProfesor+"&area=" + Codigoarea +
                        "&actividad="+ $scope.actividad+"&fechaInicio="+ $scope.fechaActividad +
                        "&objetivo="+$scope.objetivoActividad +"&programa="+ $scope.programa+
                        "&cantidadEstudiantes="+ $scope.cantidadEstudiantes + "&fechaFinal="+ $scope.fechaFinActividad +
                        "&sede="+ $scope.sede + "&iden="+ $scope.idProfesor + "&codigo=" + $scope.codigo
                    })
                    .then(function mySucces(response)
                    {
                        console.log(response);
                        if(response["data"]==="true")
                        {
                            mostrarNotificacion("El informe a sido enviado con exito",2);
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
                mostrarNotificacion("Asegurése de ingresar datos en cada uno de los campos requeridos",1);
            }
        };
    });