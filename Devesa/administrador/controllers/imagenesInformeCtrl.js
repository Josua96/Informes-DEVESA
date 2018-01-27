angular.module('adminModule')
    .controller('imagenesInformeCtrl', function($q,$scope,$location,$http,idInformeEnCurso)
        {

            $scope.codigo=localStorage.getItem("sessionToken");
            $scope.id=localStorage.getItem("userId");

            $scope.informe;
            $scope.imagenes=[];


            /*se carga el nombre de quienes realizaron el informe */
            $scope.cargarInformacionPropietario=function () {

            };

            //obtener informacion de un inform;e en especifico
            $scope.cargarInforme=function () {

                $http({
                    method: "GET",
                    url: API_ROOT+":8081/ObtenerInformeId?id="+numeroInforme+"&iden="
                    +$scope.id+"&codigo="+$scope.codigo
                }).then(function mySucces(response) {
                    $scope.informe=response.data;
                    $scope.informe[0]["v_fechainicio"]=revertirCadena($scope.informe[0]["v_fechainicio"].slice(0,10));
                    $scope.informe[0]["v_fechafinal"]=revertirCadena($scope.informe[0]["v_fechafinal"].slice(0,10));
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
            };


            $scope.descargarImagenes=function () {
                var zip = new JSZip();
                var count = 0;
                var zipFilename = $scope.informe[0]["v_actividad"];
                var urls=$scope.imagenes;
                var filename;

                urls.forEach(function(url){
                    
                    // loading a file and add it in a zip file
                    JSZipUtils.getBinaryContent(url, function (err, data) {
                        if(err) {
                            throw err; // or handle the error
                        }
                        filename="Imagen" + count + retornaFormato(url);
                        zip.file(filename, data, {binary:true});
                        count++;
                        if (count == urls.length) {
                            console.log("contador " +count);
                            var zipFile = zip.generateAsync({type: "blob"})
                                .then(function(content) {
                                    console.log(content);
                                    // generar la descarga
                                    saveAs(content,zipFilename);
                                });
                        }
                    });
                });  
            };

            $scope.retroceder=function () {
                
                window.location.href="#/informes";
            };
            
            $scope.cargarInforme();
    
            
        }
    );

/**
 console.log("indice= "+indice);


 //cargar el archivo de imagen y agregarlo al zip
 JSZipUtils.getBinaryContent(url, function (err, data) {
                        if (err) {
                            mostrarNotificacion("Ocurrió un error al cargar las imágenes, la descarga no es posible", 2)
                            return;
                        }

                        zip.file(filename, data, {binary: true});

                        if (indice == limit){
                            console.log("generar zip");
                            zip.generateAsync({type:"blob"})
                                .then(function(content) {
                                    console.log(content);
                                    // generar la descarga
                                    saveAs(content,zipFilename);
                                });
                        }
                    });

 });
 **/