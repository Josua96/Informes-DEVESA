angular.module('profesorModule',["ngRoute","ngResource"])
.config(['$routeProvider',function($routeProvider)
    {
        $routeProvider
            .when("/profesores/informesEnviados",{templateUrl:'sections/enviados.html',controller: 'enviadosCtrl'})
            .when("/profesores/nuevoInforme",{templateUrl:'sections/nuevo.html',controller: 'nuevoCtrl'})
            .when("/profesores/Ver-Editar",{templateUrl:'sections/editar.html',controller: 'edicionCtrl'});
    }
]);

