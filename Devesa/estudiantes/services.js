/**
 * Created by Josua on 17/11/2017.
 */
angular.module('userModule')

    .service('peticionesEstudiantes',['$http',function($http) {

        /**
         *
         * @param carnet: número de carnet del estudiante
         * @param codigo: código de acceso que el estudiante posee
         * @param id:   id del estudiante
         * @returns {Resultado de la petición HTTP (conjunto de solicitudes pendientes)}
         */
        //obtener laa solicitudes que aun no han atendido al estudiante
        this.obtenerPendientes = function (carnet,codigo,id) {
            return $http({
                method: "GET",
                url:API_ROOT+":8081/ObtenerSolicitudesCarnet?carnet="+carnet+"&iden="
                +id+"&codigo="+codigo
            });
        };

        /**
         *
         * @param carnet : número de carnet del estudiante
         * @param tramite:  tipo de carta que fue solicitada
         * @param id:       identificaciónd el estudiante que registra la solicitud
         * @param codigo:   código de acceso que posee el estudiante
         * @param sede:     La sede que especifica el estudiante para la carta
         * @returns {retorna el resultado de la petición HTTP (si fue exitoso el proceso de registro de la solicitud)}
         */
        this.registrarSolicitud = function (carnet,tramite,id,codigo,sede) {
            return $http({
                method: "POST",
                url:API_ROOT+":8081/CrearSolicitud?carnet=" + carnet + "&tramite=" +tramite+
                "&iden="+id+"&codigo="+codigo+"&sede="+sede
            });
        };

        /**
         * 
         * @param idSolicitud: id aasociado a una solicitud del estudiante 
         * @param id    :  identificación del estudiante
         * @param codigo:   código de acceso que posee el usuario
         * @returns {El resultado de la petición HTTP (si el proceso de borrado fue exitoso)}
         */
        this.eliminarSolicitud=function(idSolicitud,id,codigo){
            return $http({   //delete a student's requests by request' id
                method: "DELETE",
                url: API_ROOT + ":8081/EliminarSolicitud?id=" + idSolicitud
                + "&iden=" + id + "&codigo=" + codigo
            })
        }    


    }]); 