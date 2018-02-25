angular.module('secretariaModule')

    .service('peticiones',['$http',function($http)
    {

        //obtener las solicitudes no atendidas
        this.obtenerNoAtendidas=function (codigo,id,sede) {
             return $http({
                method : "GET",
                url : API_ROOT+":8081/ObtenerSolicitudesNoAtendidas?"+"&iden="+id+"&codigo="+codigo+"&sede="+sede
            });
        };
        
        this.obtenerAtendidas=function (codigo,id,sede) {
            return $http({
                method : "GET",
                url : API_ROOT +":8081/ObtenerSolicitudesAtendidas?"+"&iden="+id+"&codigo="+codigo
                +"&sede="+sede
            });
        };

        /**
         * 
         * @param idSolicitud
         * @param identificacion el id de la persona encargada en la secretaría de DEVESA
         * @param codigo
         * @returns {*}
         */
        this.cambiarEstado=function (idSolicitud,idUsuario,codigo) {
            return $http({
                method : "POST",
                url :API_ROOT+":8081/ActualizarEstado?id=" +idSolicitud+"&iden="
                +idUsuario+"&codigo="+codigo
            });
        };

    }])

    .factory('datosEstudiante',function()
    {
        var factory ={};
        factory.carnet = "2345678987";
        factory.estadoConsulta=false;
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
    });