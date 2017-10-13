angular.module('profesorModule')
.controller('edicionCtrl', function($scope,$location,$http, datosInforme) 
{
    $scope.idProfesor = datosInforme.idProfesor;

    $scope.area= datosInforme.area;
    $scope.idInforme=datosInforme.idInforme;
    $scope.actividad= datosInforme.actividad;
    $scope.fechaActividad= datosInforme.fecha;
    $scope.objetivoActividad=datosInforme.objetivo;
    $scope.programa=datosInforme.programa;
    $scope.cantidadEstudiantes=datosInforme.numeroEstudiantes;
    
    var areas = ['DI','SE','AYR','TSR','TSB','PS','BI','DE','CU','SOD','SME','SEN'];
    var i=0; 
    var tamaño = areas.length;
    for(i ; i<tamaño; i++)
    {
        if(areas[i]===$scope.area)
        {
            console.log(i);
            break;
        }
    }   
    document.getElementById("sel1").selectedIndex=i;
    
    $scope.guardarInforme = function ()
    {
        $scope.fechaActividad=document.getElementById("date2").value;        
        var Codigoarea;
        if(document.getElementById("sel1").value!=="")
        {   
            var Codigoarea = areas[document.getElementById("sel1").value];     
            $http(
            {
                method: "POST",
                url:"http://localhost:8081/ModificarInforme?profesorID="+$scope.idProfesor+"&area=" +
                    Codigoarea+"&actividad="+ $scope.actividadff+"&fecha="+ $scope.fechaActividad +
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