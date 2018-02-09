/**
 * Created by Josua on 17/11/2017.
 */
angular.module('userModule')

    .service('peticionesEstudiantes',['$http',function($http) {

        //obtener laa solicitudes que aun no han atendido al estudiante
        this.obtenerPendientes = function (carnet,codigo,id,sede) {
            return $http({
                method: "GET",
                url:API_ROOT+":8081/ObtenerSolicitudesCarnet?carnet="+carnet+"&iden="
                +id+"&codigo="+codigo
            });
        };

        this.registrarSolicitud = function (carnet,tramite,id,codigo,sede) {
            return $http({
                method: "POST",
                url:API_ROOT+":8081/CrearSolicitud?carnet=" + carnet + "&tramite=" +tramite+
                "&iden="+id+"&codigo="+codigo+"&sede="+sede
            });
        };
        
        this.eliminarSolicitud=function(idSolicitud,id,codigo){
            return $http({   //delete a student's requests by request' id
                method: "DELETE",
                url: API_ROOT + ":8081/EliminarSolicitud?id=" + idSolicitud
                + "&iden=" + id + "&codigo=" + codigo
            })
        }    


    }]); 