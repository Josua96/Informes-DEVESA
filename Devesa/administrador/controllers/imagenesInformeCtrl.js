angular.module('adminModule')
    .controller('imagenesInformeCtrl', function($q,$scope,$location,$http,idInformeEnCurso,peticionesAdministrador)
        {

            $scope.codigo=localStorage.getItem("sessionToken");
            $scope.id=localStorage.getItem("userId");
            $scope.tipoUsuario=localStorage.getItem("userType");

            $scope.informe;
            $scope.imagenes=[];
            


            /** Obtiene el nombre de la persona que posee el id especificado
             *  @param idPersona (String): identificación de la persona
             */
            $scope.cargarInformacionPropietario=function (idPersona) {

            };

            /** Obtiene la información completa de un informe en especifico
             *  
             */
            $scope.cargarInforme=function () {
                alert("numero de informe "+ idInformeEnCurso.numeroInforme);
                peticionesAdministrador.obtenerInformacionInforme(idInformeEnCurso.numeroInforme,$scope.id,$scope.codigo)
                    .then(function(response){
                        $scope.informe=response.data;
                        console.log($scope.informe);
                        $scope.informe[0]["v_fechainicio"]=revertirCadena($scope.informe[0]["v_fechainicio"].slice(0,10));
                        $scope.informe[0]["v_fechafinal"]=revertirCadena($scope.informe[0]["v_fechafinal"].slice(0,10));
                        $scope.informe[0]["v_area"]=textoInforme($scope.informe[0]["v_area"]);
                        
                    },function (response) {
                        manageErrorResponse(response,"");
                    });
                
            };

            /** Obtiene de la base de datos las imagenes que corresponden al informe
             * 
             */
            $scope.cargarImagenes= function () {

                
                peticionesAdministrador.obtenerImagenesInforme(idInformeEnCurso.numeroInforme,$scope.id,$scope.codigo,$scope.tipoUsuario)
                    .then(function(response){
                        if (response.data.length >0 ){
                            $scope.imagenes=response.data;
                        }
                        else{
                            mostrarNotificacion("No existen imagenes asociadas a este informe",3);
                        }
                    },function (response) {
                        manageErrorResponse(response,"");

                    });
            };

            /** Descarga las imágenes que contiene el arreglo de imágenes
             * 
             */
            $scope.descargarImagenes=function () {
                var zip = new JSZip();
                var count = 0;
                var zipFilename = $scope.informe[0]["v_actividad"];
                var urls=$scope.imagenes;
                var filename;
                var imageName;
                urls.forEach(function(url){

                    imageName=IMAGES_STORAGE_DIRECTION+ url.v_nombre;
                    // cargar el archiv de imagen y agregarlo al zip
                    JSZipUtils.getBinaryContent(imageName, function (err, data) {
                        if(err) {
                            throw err; // manejar el error
                        }

                        filename="Imagen" + count + retornaFormato(imageName);
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

            /** Redireccionar al usuario a la vista de informes
             * 
             */
            $scope.retroceder=function () {
                
                window.location.href="#/informes";
            };
            
            $scope.cargarInforme();
    
            
        }
    );

