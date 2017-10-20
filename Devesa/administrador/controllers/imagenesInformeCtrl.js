angular.module('adminModule')
    .controller('imagenesInformeCtrl', function($scope,$location,$http,idInformeEnCurso)
        {

            $scope.codigo=localStorage.getItem("sessionToken");
            $scope.id=localStorage.getItem("userId");


            $scope.informe;
            $scope.imagenes=[];
            //obtener informacion de un inform;e en especifico
            $scope.cargarInforme=function () {

                $http({
                    method: "GET",
                    url: "http://localhost:8081/ObtenerInformeId?id="+numeroInforme+"&iden="
                    +$scope.id+"&codigo="+$scope.codigo
                }).then(function mySucces(response) {
                    $scope.informe=response.data;
                    $scope.informe[0]["v_fechaInicio"]=revertirCadena($scope.informe[0]["v_fechaInicio"].slice(0,10));
                    $scope.informe[0]["v_fechaFinal"]=revertirCadena($scope.informe[0]["v_fechaFinal"].slice(0,10));
                    $scope.informe[0]["v_area"]=textoInforme($scope.informe[0]["v_area"]);
                }, function myError(response) {
                    mostrarNotificacion("Ocurrio un error", 1);
                });
            };
            
            $scope.cargarImagenes= function () {
                /*
                $http({
                    method: "GET",
                    url: "http://localhost:8081/ObtenerImagenesInforme?idInforme="+numeroInforme+"&iden="
                    +$scope.id+"&codigo="+$scope.codigo
                }).then(function mySucces(response) {
                    $scope.imagenes=response.data;
                    console.log(response);
                }, function myError(response) {
                    mostrarNotificacion("Ocurrio un error", 1);
                });
                */
                $scope.imagenes=["../assets/images/25d.jpg","../assets/images/A1D.jpg","../assets/images/antiopadas.jpg","../assets/images/paisaje-epuyen.jpg","../assets/images/dos.jpg"];
            }

            $scope.retroceder=function () {
                
                window.location.href="#/informes";
            }
            
            $scope.cargarInforme();
    
            
        }
    );
