angular.module('secretariaModule',["ngRoute","ngResource"])
    .config(['$routeProvider',function($routeProvider)
    {
        $routeProvider.when("/solicitudes",{
            templateUrl:'sections/pendientes.html',
            controller: 'pendienteCtrl'
        })
            .when("/atendidas",{
                templateUrl:'sections/atendidas.html',
                controller:'atendidasCtrl'
            })
            .when("/nuevaSolicitud",{
                templateUrl:'sections/nueva.html',
                controller:'nuevaSolicitudCtrl'
            })
            .when("/carta",{
                templateUrl:'sections/carta.html',
                controller:'cartaCtrl'
            })
            .when("/fecha",{
                templateUrl:'sections/fecha.html',
                controller:'fechaCtrl'
            })
    }

    ]);

