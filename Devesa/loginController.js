var app = angular.module('loginModule',["ngRoute","ngResource"]);
app.controller('loginController', function($scope, $http)
{

    localStorage.removeItem("sessionToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userType");
    localStorage.removeItem("sede");
    /* PARA PRUEBAS USAMOS ESE USUARIO,CON ESE ID Y ESE TOKEN*/
    $scope.username = "alguien";
    $scope.password = "";
    $scope.id="2-1122-1222";
    $scope.codigo="wer33";
    $scope.carnet="2016254066";
    //$scope.codigo="wer3";
    $scope.sede="SC";
    $scope.sol="CCSS";
    localStorage.setItem("sessionToken", $scope.codigo);
    localStorage.setItem("userId",$scope.id);
    localStorage.setItem("userType","E");
    localStorage.setItem("sede","SC");
    
    $scope.tipoUsuario=localStorage.getItem("userType");


    $scope.redirigirUsuario=function () {
        if($scope.username==="e")
        {
            console.log("datos");
            console.log($scope.user);
            console.log($scope.password);

            localStorage.setItem("user001", $scope.username);
            localStorage.setItem("password001", $scope.password);

            window.location.href = ('estudiantes/MainView.html');//'{0}/MainView.html'.format(userData.userType == "Admin" ? "" : "users"));
        }
        else if($scope.username === "p")
        {
            window.location.href = ('profesores/MainView.html');
        }
        else
        {
            window.location.href = ('administrador/MainView.html');//'{0}/MainView.html'.format(userData.userType == "Admin" ? "" : "users"));
        }
    };

    $scope.doLogin = function () 
    {
        /*
        $http({
        method: "GET",
        url: API_ROOT+'/user/login/web?username={0}&password={1}'
        .format(Base64.toBase64($scope.username, true).toString(), Base64.toBase64($scope.password, true).toString())
        }).then(function mySucces(response) {
        console.log(response.data);
        console.log((API_ROOT + '/user/login/web?username={0}&password={1}')
        .format(Base64.toBase64($scope.username, true).toString(), Base64.toBase64($scope.password, true).toString()))
        var meta = response.data.metadata;



        if (meta.operationResult == 'Ok') {

        var content = response.data.content;
        console.log(content);
        var userData = content.user;
        console.log(userData);
        saveSession(content);

        window.location.href = ('{0}/MainView.html'.format(userData.userType == "Admin" ? "admin" : "users"));
        } else {
        alert("Credenciales incorrectas");
        }
        });*/
        console.log("se va a registrar token");
        console.log($scope.tipoUsuario);
        console.log($scope.codigo);
        console.log($scope.id);

        /* CON ESTA PETICION SE REGISTRARIA EL TOKEN DE UN USUARIO  */
        return $http({
            method : "POST",
            url :"http://localhost:8081/registrarToken?iden="+$scope.id+"&tipo="+$scope.tipoUsuario+
            "&codigo="+$scope.codigo
        }).then(function (response) {
                console.log("token_registrado");
                $scope.redirigirUsuario();
            }, function (response) {
                console.log(response.data.message);
                $scope.status ="Error de conexion";
            });



    };

    
    function saveSession(json) 
    {
        localStorage.setItem("session.token", json.session.token);
        localStorage.setItem("session.owner", JSON.stringify(json.user));
        console.log("Sesión guardada.");
    }
});