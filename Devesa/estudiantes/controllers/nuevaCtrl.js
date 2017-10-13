angular.module('userModule')
    .controller('nuevaCtrl', function($scope,$location,$http) {        

   // variables globales
    $scope.carnet="2016254066";
    $scope.tramite;
    $scope.indice;
    $scope.datos;  
    $scope.solicitudes=["CCSS","regular","visa","pension", "CCSSResidencia"];
    $scope.opciones= [
                        {model : "Carnet de la CCSS", num:0},
                        {model : "Estudiante Regular", num: 1},
                        {model : "Trámite de Visa", num: 2},
                        {model:"Trámite de Pensión",num:3 },
                        {model:"CCSS con Residencia",num:4}
                     ];

    // Muestra un mensaje si ocurre algun error. 
    $scope.mostrarError=function (texto) {
        swal({ 
            title: texto,
            type: "error",
            confirmButtonColor: "#EE2049",
            timer: 3000,
            showConfirmButton: false
        });
    };

    
    //  verifica que no se haya realizado una solicitud del tipo que se esta pidiendo 
    $scope.verificar=function () {

        $http({   
            method : "GET",
            url :"http://localhost:8081/ObtenerSolicitudesCarnet?carnet="+$scope.carnet
            })
            .then(function mySucces(response)
            {
                $scope.datos=response.data;  
                var largo=$scope.datos.length;             
                
                for (i=0;i<largo;i++)
                {                
                    if (angular.equals($scope.datos[i]["v_tramite"],$scope.solicitudes[$scope.indice])===true)
                    {
                        console.log("salio", i);
                        mostrarNotificacion("No fue posible agregar la solicitud, Usted ya realizó una solicitud de este tipo",1);
                        return;
                    }
                }
                $scope.realizarSolicitud();
                return;
            
            }, function myError(response) 
              {
                mostrarNotificacion("Ocurrió un error y no fue posible agregar la solicitud",1);
              }
           );
    };

    
    //Realiza la solicitud de la carta que desea el usuario. 
    $scope.evaluarSolicitud=function (indice) 
    {
        $scope.indice = indice;
        if ($scope.indice !== undefined) 
        {
                $scope.verificar();
        }
        else 
        {
            mostrarNotificacion("Es necesario que seleccione un tipo de solicitud",1);
        }
    };

    // Finaliza el proceso de solicitud 
    $scope.realizarSolicitud=function()
    {
        $http(
        {
            method: "POST",
            url: "http://localhost:8081/CrearSolicitud?carnet=" + $scope.carnet + "&tramite=" + $scope.solicitudes[$scope.indice]
        })
        .then(function mySucces(response) 
        {
            mostrarNotificacion("La solocitud ha sido agregada",2);
        },function myError(response) 
        {
            mostrarNotificacion("Ocurrió un error y no fue posible agregar la solicitud",1);
        });
    };



});