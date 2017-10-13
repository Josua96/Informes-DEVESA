angular.module('userModule')
.controller('solicitudesCtrl', function ($scope,$http)
{
    $scope.carnet="2016254066";
    $scope.tramite="";
    $scope.indiceEliminar = -1;            
    $scope.solicitudes;    
    $scope.id="2-1122-1222";
    $scope.codigo="wer33";
    
$scope.actualizarInfo =function()
{
    //format(Base64.encode($scope.carnet,true).toString())
    $http({
        method : "GET",
        url :"http://localhost:8081/ObtenerSolicitudesCarnet?carnet={0}".$scope.carnet+
            "&iden="+$scope.id+"&codigo="+$scope.codigo
        })
        .then(function mySucces(response)
        {
            $scope.solicitudes=response.data;
            $scope.solicitudes=setTextSolicitudes($scope.solicitudes);
            if ($scope.solicitudes===0)
            {
                mostrarNotificacion("Usted no tiene solicitudes pendientes",3);
            }                                
        }, 
        function myError(response) 
        {
            mostrarNotificacion("La carga de solicitudes no fué posible",1);
     });
};

    //Base64.toBase64($scope.username, true).toString()
$scope.completarEliminado = function() //elimina una solicitud 
{
console.log("indice a elimnar:" + indiceEliminar);
if(indiceEliminar != -1)   
{
$http({   //delete a student's requests by id's requests
method : "DELETE",
url :"http://localhost:8081/EliminarSolicitud?id="+$scope.solicitudes[indiceEliminar]["v_idsolicitud"]
}).then(function mySucces(response) {
$scope.actualizarInfo();
//automaticamente se elimina de la tabla
console.log("entro", response);
}, function myError(response) {
console.log("error");
$scope.myWelcome = response.statusText;
});  
}
    
    
    
indiceEliminar = -1;

}
//eliminar una fila segun el indice
$scope.eliminar= function (indice)
{   console.log("indice ",indice);
indiceEliminar = indice;
swal({ //mostrar cuadro de dialogo para confirmacion del proceso de eliminado
title: "Eliminar la solicitud?",
text: "Una vez eliminada no habrá forma de recuperarla!",
type: "warning",
showCancelButton: true,
cancelButtonText: "Cancelar",
confirmButtonClass: "btn-danger",
confirmButtonText: "Sí eliminarla!",
closeOnConfirm: true,
closeOnCancel: true
},
function(){
$scope.completarEliminado();
});
}

$scope.actualizarInfo();

});