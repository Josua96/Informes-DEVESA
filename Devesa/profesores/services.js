angular.module('profesorModule')
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






