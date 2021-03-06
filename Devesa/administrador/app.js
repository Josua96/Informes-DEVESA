angular.module('adminModule',["ngRoute","ngResource","ui.calendar","angularUtils.directives.dirPagination"])
.config(['$routeProvider',function($routeProvider)
    {
        $routeProvider.when("/informes",{
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
    }
]);
