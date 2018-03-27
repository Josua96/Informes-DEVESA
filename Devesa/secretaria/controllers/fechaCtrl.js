angular.module('secretariaModule')
.controller('fechaCtrl',function($scope,$location) 
{       

	numeroInforme=-1;
    departamento="";
    
    $scope.fechaInicio;
    $scope.fechaFin;

    /** Función para almacenar las fechas iniciales y finales del semestre
     * 
     */
    $scope.guardarFecha = function()
    {

        $scope.fechaInicio=document.getElementById("date1").value;
        $scope.fechaFin=document.getElementById("date2").value;
       
        //si no hay valores nulos
        if( noNulos([$scope.fechaInicio,$scope.fechaFin]) ==true)
        {
            if ($scope.fechaInicio > $scope.fechaFin){
                mostrarNotificacion("La fecha de inicio no puede ser mayor a la fecha de fin de semestre",1)
            }
            else{
                setCookie($scope.fechaInicio,$scope.fechaFin);
                mostrarNotificacion("Configuración de fechas exitosa",2);
            }

        }
        else{  //error en seleccion de fechas
            mostrarNotificacion("Ocurrió un error en la selección de fechas, no deben existir fechas sin seleccionar", 1);
            
        }
        
    
    }

});           
