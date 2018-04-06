angular.module('funcionarioModule')
    /**
     * Este service permite hacer las diferentes consultas
     * al web service.
     *
     * */

    .service('peticiones',['$http',function($http)
    {

       /**
        * Permite a un funcinoario crear un informe 
        * 
        * @param {number} idFuncionario 
        * @param {String} codigoArea 
        * @param {String} actividad 
        * @param {String} fechaInicio 
        * @param {String} objetivo 
        * @param {String} programa 
        * @param {number} cantidadEstudiantes 
        * @param {String} fechaFin 
        * @param {String} sede 
        * @param {String} codigo 
        */
        this.nuevoInforme=function(idFuncionario,codigoArea,actividad,fechaInicio,objetivo,programa,cantidadEstudiantes,fechaFin,sede,codigo)
        {
            return $http(
                {
                    method: "POST",
                    url:API_ROOT+":8081/CrearInforme?funcionarioID="+idFuncionario+"&area=" + codigoArea +
                    "&actividad="+ actividad+"&fechaInicio="+ fechaInicio +
                    "&objetivo="+ objetivo +"&programa="+ programa +
                    "&cantidadEstudiantes="+ cantidadEstudiantes + "&fechaFinal="+ fechaFin +
                    "&sede="+ sede + "&iden="+ idFuncionario + "&codigo=" + codigo
                })
        };

        /**
         * Permite obtener todos los informes de un determinado profesor
         * 
         * @param {String} idFuncionario 
         * @param {String} codigo 
         */

        this.informesFuncionario = function(idFuncionario,codigo)
        {
            return $http({
                method : "GET",
                url :API_ROOT+":8081/ObtenerInformesFuncionario?funcionarioID="+idFuncionario + "&iden="+ idFuncionario+"&codigo="+codigo
            })
        };

        /**
         * Permite eliminar una fotografia de base de datos (la ruta)
         * 
         * @param {number} idInforme 
         * @param {String} param 
         * @param {String} idFuncionario 
         * @param {String} codigo 
         * @param {String} tipo 
         */
        this.eliminarFoto=function (idInforme,nombreFoto,idFuncionario,codigo,tipo)
        {
            return $http({
                method : "DELETE",
                url :API_ROOT+":8081/EliminarImagen?idInforme="+idInforme+ "&nombre="+nombreFoto +
                "&iden="+idFuncionario+"&codigo="+codigo+"&tipo="+tipo
            });
        };

        /**
         * Permite obtener las rutas de las imagenes de un informe en especifico 
         * 
         * @param {number} idInforme 
         * @param {String} idFuncionario 
         * @param {String} tipo 
         * @param {String} codigo 
         */
        this.obtenermagenesInforme=function (idInforme,idFuncionario,tipo,codigo) {
            return $http(
                {
                    method : "GET",
                    url :API_ROOT+":8081/ObtenerImagenesInforme?idInforme="+ idInforme +
                    "&iden="+idFuncionario+ "&tipo="+tipo+"&codigo="+codigo
                })
        };

        /**
         * Permite registrar imagenes en la base de datos. 
         * 
         * @param {number} idInforme 
         * @param {String} nombreImagen 
         * @param {String} idFuncionario 
         * @param {String} codigo 
         * @param {String} tipo 
         */
        this.registrarImagenes=function (idInforme,nombreImagen,idFuncionario,codigo,tipo)
        {
            console.log(nombreImagen);
            return $http({method: "POST",
                url:API_ROOT+":8081/CrearImagen?idInforme="+idInforme+"&placa="+nombreImagen+
                "&iden="+ idFuncionario + "&codigo="+ codigo+"&tipo="+ tipo})
        };

        this.eliminarInforme=function (idInforme,idFuncionario,codigo)
        {
            return $http({method: "DELETE", url:API_ROOT+":8081/EliminarInforme?idInforme="+idInforme+ "&iden="+ idFuncionario + "&codigo="+ codigo});};

        /**
         * Permite modificar un informe en la base de datos. 
         * 
         * @param {String} codigoArea 
         * @param {String} actividad 
         * @param {String} fechaInicio 
         * @param {String} fechaFinal 
         * @param {String} objetivoActividad 
         * @param {String} programa 
         * @param {number} cantidadEstudiantes 
         * @param {String} idFuncionario 
         * @param {String} codigo 
         * @param {number} idInforme 
         * @param {String} sede 
         */
        this.modificarInforme=function (codigoArea,actividad,fechaInicio,fechaFinal, objetivoActividad,programa,cantidadEstudiantes,idFuncionario,codigo,idInforme,sede)
        {
            return $http(
                {
                    method: "POST",
                    url:API_ROOT+":8081/ModificarInforme?area=" + codigoArea +
                    "&actividad="+ actividad+"&fechaInicio="+ fechaInicio +
                    "&fechaFinal="+ fechaFinal + "&objetivo="+objetivoActividad
                    +"&programa="+ programa+ "&cantidadEstudiantes="+ cantidadEstudiantes +
                    "&iden="+ idFuncionario + "&codigo=" + codigo + "&id="+idInforme+"&sede="+sede
                })
        }

    }])    
    /**
     * Crea un objeto donde se guardan los datos del profesor, para mantener comunicacion entre controladores. 
     */
    .factory('datosProfesor',function()      
    {
        var factory ={};
        factory.nombre= "Nombre del profesor";
        factory.idProfesor = "1234567890";
        return factory;
    })
    /**
    *  Crea un objeto donde guarda los datos de un informe en especifico. Para comunicacion entre controladores.
    */
    .factory('datosInforme',function()
    {
        var datosInforme ={};
        datosInforme.idFuncionario;
        datosInforme.idInforme;
        datosInforme.area;
        datosInforme.actividad;
        datosInforme.fechaInicio;
        datosInforme.fechaFinal;
        datosInforme.objetivo;
        datosInforme.programa;
        datosInforme.numeroEstudiantes;
        return datosInforme;
    });






