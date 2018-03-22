angular.module('secretariaModule')

    .service('peticiones',['$http',function($http)
    {

        /**
         *
         * @param codigo : código de acceso de la persona asignada en la secretaría de DEVESA
         * @param id    :  identificacion de la personas asignada en la secretaría de DEVESA
         * @param sede:    Sede en la que labora la persona encargada de la secreataría de DEVESA
         * @returns {retorna las solicitudes que aún no han sido atendidas}
         */
        this.obtenerNoAtendidas=function (codigo,id,sede) {
             return $http({
                method : "GET",
                url : API_ROOT+":8081/ObtenerSolicitudesNoAtendidas?"+"&iden="+id+"&codigo="+codigo+"&sede="+sede
            });
        };
        /**
         *
         * @param codigo : código de acceso de la persona asignada en la secretaría de DEVESA
         * @param id    :  identificacion de la personas asignada en la secretaría de DEVESA
         * @param sede:    Sede en la que labora la persona encargada de la secreataría de DEVESA
         * @returns {{retorna las solicitudes que han sido atendidas durante el día}
         */
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
         * @param idUsuario: identificacion el id de la persona encargada en la secretaría de DEVESA
         * @param codigo: código de acceos de la persona asignada en la secretaría de DEVESA
         * @returns {Resultado de la petición HTTP (cambio de estado de la solicitud)}
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
    });
