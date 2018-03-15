angular.module('profesorModule')
    //consumo de endpoints relacionados con los profesores
    .service('peticiones',['$http',function($http)
    {


        this.nuevoInforme=function(idFuncionario,codigoArea,actividad,fechaInicio,objetivo,programa,cantidadEstudiantes,fechaFin,sede,codigo)
        {
            return $http(
                {
                    method: "POST",
                    url:API_ROOT+":8081/CrearInforme?funcionarioID="+idFuncionario+"&area=" + codigoArea +
                    "&actividad="+ actividad+"&fechaInicio="+ fechaInicio +
                    "&objetivo="+ objetivo +"&programa="+ programa +
                    "&cantidadEstudiantes="+ cantidadEstudiantes + "&fechaFinal="+ fechaFin +
                    "&sede="+ sede + "&iden="+ idFuncionario + "&codigo=" + codigo
                })
        };

        this.informesFuncionario = function(idFuncionario,codigo)
        {
            return $http({
                method : "GET",
                url :API_ROOT+":8081/ObtenerInformesFuncionario?funcionarioID="+idFuncionario + "&iden="+ idFuncionario+"&codigo="+codigo
            })
        };

        this.eliminarFoto=function (idInforme,param,idFuncionario,codigo,tipo)
        {
            return $http({
                method : "DELETE",
                url :API_ROOT+":8081/EliminarImagen?idInforme="+idInforme+ "&nombre="+param +
                "&iden="+idFuncionario+"&codigo="+codigo+"&tipo="+tipo
            });
        };

        this.obtenermagenesInforme=function (idInforme,idFuncionario,tipo,codigo) {
            return $http(
                {
                    method : "GET",
                    url :API_ROOT+":8081/ObtenerImagenesInforme?idInforme="+ idInforme +
                    "&iden="+idFuncionario+ "&tipo="+tipo+"&codigo="+codigo
                })
        };

        this.registrarImagenes=function (idInforme,nombreImagen,idFuncionario,codigo,tipo)
        {
            console.log(nombreImagen);
            return $http({method: "POST",
                url:API_ROOT+":8081/CrearImagen?idInforme="+idInforme+"&placa="+nombreImagen+
                "&iden="+ idFuncionario + "&codigo="+ codigo+"&tipo="+ tipo})
        };

        this.modificarInforme=function (codigoArea,actividad,fechaInicio,fechaFinal, objetivoActividad,programa,cantidadEstudiantes,idFuncionario,codigo,idInforme,sede)
        {
            return $http(
                {
                    method: "POST",
                    url:API_ROOT+":8081/ModificarInforme?area=" + codigoArea +
                    "&actividad="+ actividad+"&fechaInicio="+ fechaInicio +
                    "&fechaFinal="+ fechaFinal + "&objetivo="+objetivoActividad
                    +"&programa="+ programa+ "&cantidadEstudiantes="+ cantidadEstudiantes +
                    "&iden="+ idFuncionario + "&codigo=" + codigo + "&id="+idInforme+"&sede="+sede
                })
        }


    }])

    .factory('datosProfesor',function()
    {
        var factory ={};
        factory.nombre= "Nombre del profesor";
        factory.idProfesor = "1234567890";
        return factory;
    })

    .factory('datosInforme',function()
    {
        var datosInforme ={};
        datosInforme.idFuncionario;
        datosInforme.idInforme;
        datosInforme.area;
        datosInforme.actividad;
        datosInforme.fechaInicio;
        datosInforme.fechaFinal;
        datosInforme.objetivo;
        datosInforme.programa;
        datosInforme.numeroEstudiantes;
        return datosInforme;
    });






