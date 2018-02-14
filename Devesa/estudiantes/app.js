angular.module('userModule',["ngRoute","ngResource"])
.config(['$routeProvider',function($routeProvider)
    {
        $routeProvider.when("/students/misSolicitudes",{templateUrl:'sections/solicitudes.html',controller: 'solicitudesCtrl'})
        
    }
]);
