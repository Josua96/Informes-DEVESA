angular.module('profesorModule')
.controller('nuevoCtrl', function($scope,$location,$http) 
{
    $scope.idProfesor="1234567890";
    $scope.area;
    $scope.actividad;
    $scope.fechaActividad;
    $scope.objetivoActividad;
    $scope.programa;
    $scope.cantidadEstudiantes;
    
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
    if(document.getElementById("sel1").value!=="")
    {   
        Codigoarea = $scope.opciones[document.getElementById("sel1").value].codigo;     
        $http(
        {
            method: "POST",
            url:"http://localhost:8081/CrearInforme?profesorID="+$scope.idProfesor+"&area=" +
                Codigoarea+"&actividad="+ $scope.actividad+"&fecha="+ $scope.fechaActividad +
                "&objetivo="+$scope.objetivoActividad +"&programa="+ $scope.programa+ "&cantidadEstudiantes="+ $scope.cantidadEstudiantes
        })
        .then(function mySucces(response) 
        {
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