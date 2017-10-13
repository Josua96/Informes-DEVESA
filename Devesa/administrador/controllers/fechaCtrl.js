angular.module('adminModule')
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
        if($scope.fechaInicio != "" && $scope.fechaFin != ""){
            setCookie($scope.fechaInicio,$scope.fechaFin);
            mostrarNotificacion("Configuración de fechas exitosa",2);
        }
        else{  //error en seleccion de fechas
            swal({
                title: " Ocurrió un error en la selección de fechas, no deben existir fechas sin seleccionar",
                type: "error",
                confirmButtonColor: "#EE2049",
                timer: 3000,
                showConfirmButton: false,
            });
        }
        
    
    }

});           
