/**
 * Created by Josua on 18/10/2017.
 */
angular.module('loginModule')
    .service('obtencionRegistro',['$http',function($http)
    {
        this.registraToken=function (codigo,id,tipoUsuario) {
            console.log("registro token");
            return $http({
                method : "POST",
                url :"http://localhost:8081/registrarToken?iden="+id+"&tipo="+tipoUsuario+
                +"&codigo="+codigo
            })
        };
        
        this.obtenerSolicitudes=function () {
            
        }

    }])