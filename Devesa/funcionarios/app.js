angular.module('funcionarioModule',["ngRoute","ngResource","angularUtils.directives.dirPagination"])
    .config(['$routeProvider',function($routeProvider)
    {
        // Permite redirigir al usuario a las secciones que desee. 
        $routeProvider
            .when("/funcionarios/inicio",{templateUrl:'sections/dashboard.html',controller: 'mainCtrl'})
            .when("/funcionarios/informesEnviados",{templateUrl:'sections/enviados.html',controller: 'enviadosCtrl'})
            .when("/funcionarios/nuevoInforme",{templateUrl:'sections/nuevo.html',controller: 'nuevoCtrl'})
            .when("/funcionarios/Ver-Editar",{templateUrl:'sections/editar.html',controller: 'edicionCtrl'})
    }

    ]);

