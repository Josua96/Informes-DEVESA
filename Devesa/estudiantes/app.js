angular.module('userModule',["ngRoute","ngResource"])
.config(['$routeProvider',function($routeProvider)
    {
        $routeProvider.when("/students/misSolicitudes",{templateUrl:'sections/solicitudes.html',controller: 'solicitudesCtrl'})


        .when("/students/nueva",
        	{templateUrl:'sections/nueva.html',controller: 'nuevaCtrl'})
    }
]);
