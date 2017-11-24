/**
 * Created by Josua on 17/11/2017.
 */
angular.module('userModule')

    .service('peticiones',['$http',function($http) {

        //obtener laa solicitudes que aun no han atendido al estudiante
        this.obtenerPendientes = function (carnet,codigo,id) {
            return $http({
                method: "GET",
                url:API_ROOT+":8081/ObtenerSolicitudesCarnet?carnet="+carnet+"&iden="
                +id+"&codigo="+codigo
            });
        };

        this.registrarSolicitud = function (carnet,tramite,id,codigo,sede,tipoUsuario) {
            return $http({
                method: "GET",
                url:API_ROOT+":8081/CrearSolicitud?carnet=" + carnet + "&tramite=" +tramite+
                "&iden="+id+"&codigo="+codigo+"&sede="+sede+"&tipo="+tipoUsuario
            });
        };
        
        this.eliminarSolicitud=function(idSolicitud,id,codigo){
            return $http({   //delete a student's requests by id's requests
                method: "DELETE",
                url: API_ROOT + ":8081/EliminarSolicitud?id=" + idSolicitud
                + "&iden=" + id + "&codigo=" + codigo
            })
        }    


    }]); 