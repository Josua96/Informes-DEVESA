angular.module('adminModule',["ngRoute","ngResource","ui.calendar"])
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
                .when("/informes",{
                templateUrl:"sections/informes.html",
                controller:'informesCtrl'
                })

                .when("/imagenesInforme",{
                templateUrl:"sections/imagenesInforme.html",
                controller:'imagenesInformeCtrl'
                })

                .when("/descargables",{
                templateUrl:"sections/descargable.html",
                controller:'descargableCtrl'
                })
                .when("/descargablesTotalAreas",{
                templateUrl:"sections/descargableTotalAreas.html",
                controller:'descargableTotalAreasCtrl'
                })
            
                .when("/fecha",{
                    templateUrl:'sections/fecha.html',
                    controller:'fechaCtrl'
                })
    }
]);
