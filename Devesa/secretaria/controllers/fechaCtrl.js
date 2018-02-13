angular.module('secretariaModule')
.controller('fechaCtrl',function($scope,$location) 
{       

	numeroInforme=-1;
    departamento="";
    
    $scope.fechaInicio;
    $scope.fechaFin;               
    $scope.guardarFecha = function()
    {

        $scope.fechaInicio=document.getElementById("date1").value;
        $scope.fechaFin=document.getElementById("date2").value;
       
        //si no hay valores nulos
        if( noNulos([$scope.fechaInicio,$scope.fechaFin]) ==true)
        {
            setCookie($scope.fechaInicio,$scope.fechaFin);
            mostrarNotificacion("Configuración de fechas exitosa",2);
        }
        else{  //error en seleccion de fechas
            mostrarNotificacion("Ocurrió un error en la selección de fechas, no deben existir fechas sin seleccionar", 1);
            
        }
        
    
    }

});           
