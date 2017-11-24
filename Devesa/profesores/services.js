angular.module('profesorModule')

    //consumo de endpoints relacionados con los profesores
    .service('peticiones',['$http',function($http)
    {
        //endpoint de realizacion de un nuevo informe para un profesor
        this.nuevoInforme=function (idProfesor,CodigoArea,actividad,fechaInicio,objetivo,programa,cantidadEstudiantes,fechaFin,sede,codigo) {
            return $http(
                {
                    method: "POST",
                    url:API_ROOT+":8081/CrearInforme?profesorID="+idProfesor+"&area=" + CodigoArea +
                    "&actividad="+ actividad+"&fechaInicio="+ fechaInicio +
                    "&objetivo="+ objetivo +"&programa="+ programa +
                    "&cantidadEstudiantes="+ cantidadEstudiantes + "&fechaFinal="+ fechaFin +
                    "&sede="+ sede + "&iden="+ idProfesor + "&codigo=" + codigo
                })
        };

        
        this.eliminarFoto=function (idInforme,param,idProfesor,codigo,tipo) {
            return $http({
                method : "DELETE",
                url :API_ROOT+":8081/EliminarImagen?idInforme="+idInforme+ "&nombre="+param +
                "&iden="+idProfesor+"&codigo="+codigo+"&tipo="+tipo

            })
        };

        this.obtenermagenesInforme=function (idInforme,idProfesor,tipo,codigo) {
            return $http(
                {
                    method : "GET",
                    url :API_ROOT+":8081/ObtenerImagenesInforme?idInforme="+ idInforme +
                    "&iden="+idProfesor+ "&tipo="+tipo+"&codigo="+codigo
                })
        };

        this.registrarImagenes=function (idInforme,nombreImagen,idProfesor,codigo,tipo) {
            return $http({method: "POST",
                url:API_ROOT+":8081/CrearImagen?idInforme="+idInforme+"&placa="+nombreImagen+
                "&iden="+ idProfesor + "&codigo="+ codigo+"&tipo="+ tipo})
        };

        this.modificarInforme=function (codigoArea,actividad,fechaInicio,fechaFinal,
                                        objetivoActividad,programa,cantidadEstudiantes,idProfesor,codigo,idInforme) {
            return $http(
                {
                    method: "POST",
                    url:API_ROOT+":8081/ModificarInforme?area=" + CodigoArea +
                    "&actividad="+ actividad+"&fechaInicio="+ fechaInicio +
                    "&fechaFinal="+ fechaFinal + "&objetivo="+objetivoActividad
                    +"&programa="+ programa+ "&cantidadEstudiantes="+ cantidadEstudiantes +
                    "&iden="+ idProfesor + "&codigo=" + codigo + "&id="+idInforme
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
        datosInforme.idProfesor;
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






