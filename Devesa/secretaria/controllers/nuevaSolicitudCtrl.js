angular.module('secretariaModule')
.controller('nuevaSolicitudCtrl', function($scope,$location, datosEstudiante)
{     
    $scope.tipoSolicitud=solicitudesDisponibles[0];
    $scope.carnetEstudiante;
    $scope.tiposSolicitudes=solicitudesDisponibles;

    /** Conexion con el endpoint que provee los datos universitarios del estudiante
     * 
     */
    $scope.informacionEstudiante=function () 
    {        
    };

    /** Almacena en un factory los datos del estudiante para luego utilizarlos en la carta
     * 
     */
    $scope.cargarDatos = function()
    {    
        if (noNulos([$scope.tipoSolicitud,$scope.carnetEstudiante]) ==true){
        
        datosEstudiante.carnet=$scope.carnetEstudiante;
        var datos = $scope.tiposSolicitudes[document.getElementById("sel1").selectedIndex].abreviatura;
        datosEstudiante.tipoTramite= datos[0];
        datosEstudiante.textoResidencia= datos[1];
        
        
        // aqui se debe llenar los datos del estudiante con la base de datos de 
        //la funcion se llama aqui                        
        window.location.href =('#/carta');
        }
        else{
            mostrarNotificacion("Ocurrió un error en la indicacion de los datos, asegurése de ingresar la información requerida", 1); 
        }
    };
    
    
    function mostrar(id)
    {
        document.getElementById(id).style.display = 'block';
    }  
    function ocultar(id)
    {
        document.getElementById(id).style.display = 'none';        
    }
});