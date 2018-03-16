angular.module('adminModule')

    .service('peticionesAdministrador',['$http',function($http)
    {

        /**
         *
         * @param area : area  para la que se registró el informe
         * @param id: id de la persona administradora de DEVESA
         * @param codigo : código de acceso que posee la persona administradora de DEVESA
         * @param sede: sede a la que pertence la persona administradora de DEVESA
         * @returns {Resultado de la petición HTTP (conjunto de informes que pertenecen al área especificada)}
         */

        this.obtenerInformesArea=function (area,id,codigo,sede) {
                return $http({
                    method: "GET",
                    url: API_ROOT+":8081/ObtenerInformesArea?area=" +area+"&iden="
                    +id+"&codigo="+codigo+"&sede="+sede 
                });
        };

        /**
         *
         * @param idInforme: identificador que pertenece a un informe únicamente
         * @param idUsuario: id de la persona administradora de DEVESA
         * @param codigo: código de acceso que posee la persona administradora de DEVESA
         * @returns {Resultado de la petición HTTP(la información completa de un informe en específico)}
         */
        this.obtenerInformacionInforme=function (idInforme,idUsuario,codigo) {
            return $http({
                method: "GET",
                url: API_ROOT+":8081/ObtenerInformeId?id="+idInforme+"&iden="
                +idUsuario+"&codigo="+codigo
            })
        };

        /**
         *
         * @param idInforme: identificador que pertenece a un informe únicamente
         * @param idUsuario: id de la persona administradora de DEVESA
         * @param codigo:    código de acceso que posee la persona administradora de DEVESA
         * @param tipoUsuario: tipo de usuario, administrador o funcionario
         * @returns {Resultado de la petición HTTP(imágenes del informe en específico)}
         */
        this.obtenerImagenesInforme=function (idInforme,idUsuario,codigo,tipoUsuario) {
            return $http({
                method: "GET",
                url: API_ROOT + ":8081/ObtenerImagenesInforme?idInforme=" + idInforme + "&iden="
                + idUsuario + "&codigo=" + codigo + "&tipo=" + tipoUsuario
            });
        };

        /**
         *
         * @param fechaUno: representa el lado izquierdo del intervalo de búsqueda
         * @param fechaDos: representa el lado derecho del intervalor de búsqueda
         * @param idUsuario: id de la persona administradora de DEVESA
         * @param codigo:    código de acceso que posee la persona administradora de DEVESA
         * @param sede:      los informes que se obtendrán serán aquellos que pertenezcan a la sede
         *              
         * @returns {Resultado de la petición HTTP(conjunto de informes que están entre fechaUno y fechaDos)}
         */
        this.obtenerInformesEntreFechas=function (fechaUno,fechaDos,idUsuario,codigo,sede) {
            return $http({
                method: "GET",
                url: API_ROOT+":8081/ObtenerInformesRango?fecha_uno=" +fechaUno + "&fecha_dos=" +fechaDos+"&iden="
                +idUsuario+"&codigo="+codigo+"&sede="+sede
        });
        
        }

    }])

    .factory('datosEstudiante',function()
    {
        var factory ={};
        factory.carnet = "2345678987";
        factory.tipoTramite = "Tipo de solicitud";
        factory.elLa = "El";
        factory.nombre = "Jesus Andrez Alvarado";
        factory.cedulaEstudiante ="123456789";
        factory.AO = "o";
        factory.carrera= "Agronomia";
        factory.idCosulta= "0";
        factory.textoResidencia="";
        return factory;
    })

    .factory('idInformeEnCurso',function () {
        var factory={};
        factory.numeroInforme=-1;
        factory.departamento="";
        factory.indiceSeleccionado=-1;
        return factory;
    })

    .factory('areaInforme',function () {
        var factory={};
        factory.informeArea="CU";
        return factory;
    })

    /**
     * Porción de código que realiza la conversión de tabla html a un documento en excel
     */
    .factory('Excel',function ($window) {
        var uri='data:application/vnd.ms-excel;base64,',
            template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body> <span style="color: black;font-size: larger;">Informe de Actividades </span> <br>  <table>{table}</table></body></html>',
            base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));}
            format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};
        return {
            //recibe el id de la tabla de la que se va a exportar los datos a una hoja de excel,y el nombre que tendrá esa hoja
            tableToExcel:function(tableId,worksheetName){
                var tabla=document.getElementById(tableId);
                console.log(tabla.rows.length);
                var table=document.getElementById(tableId),
                    ctx={worksheet:worksheetName,table:table.innerHTML},
                    href=uri+base64(format(template,ctx));
                return href;
            }
        };
    })