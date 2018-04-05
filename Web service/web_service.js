var pg = require('pg');
var conString = "postgres://postgres:12345@localhost:5432/devesa_app";
var client;
var express = require('express');
var app = express();
var pgp = require('pg-promise')();
var cn = {host: 'localhost', port: 5432, database: 'devesa_app', user: 'postgres', password: '12345'};
var db = pgp(cn);


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "DELETE, GET, POST");
    next();
});


/******************************************************************
 Nomenclatura de mensajes de error
 		0  = el proceso no finalizó con éxito debido a alguna restricción
 		-1 = token invalido

*******************************************************************/


//===============================================================================================
//		SEGURIDAD
//===============================================================================================

/********************************************
Objetivo: validar que el usuario en cuestion posee un token valido para accesar al sistema
--Parametros
		identificacion: numero de cedula de la persona
		tipoUusario: tipo de usuario que es la persona
		token: codigo de acceso que posee el usuario

--Retorna
		true = token valido
		false = token invalido
*********************************************/
function validarToken(identificacion,tipoUsuario,token,callback){
	console.log("Parametros: identificacion= "+identificacion+" token= "+token+" tipoUsuario= "+ tipoUsuario);
	db.func('sp_TokenValido',[identificacion,tipoUsuario,token])
        .then(data => {
        	console.log("token valido");
        	callback(true);
    })
    .catch(error=> {
    	 console.log(error);
    	 console.log("token invalido");
         callback(false);
    })

}


app.delete('/eliminarToken',function(req,res)
{
	db.proc('sp_eliminarToken',[req.query.codigo])
	.then(data => {res.end(JSON.stringify(true));})
	.catch(error => {console.log("ERROR: ",error);res.end(JSON.stringify(false));});
});



app.post('/registrarToken',function(req,res)
{
	db.proc('sp_almacenarToken',[req.query.iden,req.query.tipo,req.query.codigo])
	.then(data => {res.end(JSON.stringify(true));})
	.catch(error => {console.log("ERROR: ",error);res.status(400).send({message:"Eror en registro"});})
});


//================================================================================================
//      Solicitudes de cartas
//================================================================================================

app.post('/CrearSolicitud', function(req, res) {

	validarToken(req.query.iden,"E",req.query.codigo,function(result){
    	
    	if (result===true){
    				db.proc('sp_crearSolicitud',[req.query.carnet,req.query.tramite,req.query.sede])
            		.then(data => {
            				console.log("DATA:", data);
        					console.log(data.sp_crearsolicitud);
        					res.end(JSON.stringify(data.sp_crearsolicitud));
    				})
    			
    				.catch(error=> {
            				console.log("ERROR: ",error);
        					res.status(400).send(
            				{message:0});
    				})
    	}

		else
		{
    			res.status(400).send({message:-1});
    	}
    	}
    	);

});



app.get('/ObtenerSolicitudesNoAtendidas', function(req, res) {
  
  validarToken(req.query.iden,"S",req.query.codigo,function(result){
    	
    	if (result===true){
    			
    			db.func('sp_obtenerSolicitudesNoAtendidas',[req.query.sede])
					.then(data => {
						console.log(data);
						res.end(JSON.stringify(data));
					})

    				.catch(error=> {
            			console.log("ERROR: ",error);
        				res.status(400).send(
            			{message:0});
    				})
    	}

    	else{
    			res.status(400).send(
            				{message:-1});
    	}

    	}

    	);
});



app.get('/ObtenerSolicitudesAtendidas', function(req, res) {


	validarToken(req.query.iden,"S",req.query.codigo,function(result){
    	
    	if (result===true){
    			
    			db.func('sp_obtenerSolicitudesAtendidas',[req.query.sede])
    			    .then(data => {
     		 			console.log(data);
      					res.end(JSON.stringify(data));
    				})

    				.catch(error=> {
            			console.log("ERROR: ",error);
        				res.status(400).send(
            			{message:0});
    				})
    	}

    	else{
    			res.status(400).send(
            				{message:-1});
    	}

    	}

    	);
});


//Lista!
app.get('/ObtenerSolicitudesCarnet', function(req, res) {	

	validarToken(req.query.iden,"E",req.query.codigo,function(result){
    	
    	if (result===true){
    			
    			db.func('sp_obtenerSolicitudesCarnet',[req.query.carnet])
    				.then(data => {
      					console.log(data);
      					res.end(JSON.stringify(data));
   	 				})

    				.catch(error=> {
            			console.log("ERROR: ",error);
        				res.status(400).send(
            			{message:0});
    				})
    	}

    	else{
    			res.status(400).send(
            				{message:-1});
    	}

    	}

    	);
});

  
//Lista!
app.delete('/EliminarSolicitud', function(req, res) {

	validarToken(req.query.iden,"E",req.query.codigo,function(result){
    	
    	if (result===true){
    			
    			db.func('sp_eliminarSolicitud',[req.query.id])
    				.then(data => {
    					console.log(data.sp_eliminarsolicitud);
    					res.end(JSON.stringify(data.sp_eliminarsolicitud));})
    				


    			.catch(error=> {
            			console.log("ERROR: ",error);
        				res.status(400).send(
            			{message:0});
    				})
    	}

    	else{
    			res.status(400).send(
            				{message:-1});
    	}

    	}

    	);
});
//Lista!
app.delete('/EliminarInforme', function(req, res) 
{
	validarToken(req.query.iden,"P",req.query.codigo,function(result){

		if (result===true)
		{
    			db.func('sp_eliminiarInforme',[req.query.idInforme])
					.then(data => 
					{
    					console.log(data.sp_eliminarInforme);
						res.end(JSON.stringify(data.sp_eliminarInforme));
					})
    				.catch(error=>
					{
            			console.log("ERROR: ",error);
        				res.status(400).send({message:0});
    				}); 
    	}
    	else{
    		res.status(400).send({message:-1});
    		}
	});
});


//Lista!
app.post('/ActualizarEstado', (req, res, next) =>{

	validarToken(req.query.iden,"S",req.query.codigo,function(result){
    	
    	if (result===true){
    			
    			db.func('sp_actualizarEstado',[req.query.id])
					.then(data => {
						console.log(data);
						res.end(JSON.stringify(data));})

    				.catch(error=> {
            			console.log("ERROR: ",error);
        				res.status(400).send(
            			{message:0});
    				})
    	}

    	else{
    			res.status(400).send(
            				{message:-1});
    	}

    	}

    	);
});

  	
//================================================================================================
//      Informes
//================================================================================================


//Lista! 

app.post('/CrearInforme', function(req, res) {

	validarToken(req.query.iden,"P",req.query.codigo,function(result){
    	
    	if (result===true){
    			
    			db.func('sp_crearInforme', [req.query.funcionarioID, req.query.area, req.query.actividad, req.query.fechaInicio, req.query.fechaFinal, req.query.objetivo, req.query.programa, req.query.cantidadEstudiantes, req.query.sede])
					.then(data => {
						console.log("DATA:", data); 
						console.log(data.sp_crearinforme); 
						res.end(JSON.stringify(data.sp_crearinforme));})

    				.catch(error=> {
            			console.log("ERROR: ",error);
        				res.status(400).send(
            			{message:0});
    				})
    	}

    	else{
    			res.status(400).send(
            				{message:-1});
    	}

    	}

    	);
});


//Lista!
app.get('/ObtenerInformesFuncionario', function(req, res) {

	validarToken(req.query.iden,"P",req.query.codigo,function(result){
    	
    	if (result===true){
    			
    			db.func('sp_obtenerInformes_funcionario',[req.query.funcionarioID])
    				.then(data =>
                	{
                        console.log(data);
      					res.end(JSON.stringify(data));
    			
    				})

    				.catch(error=> {
            			console.log("ERROR: ",error);
        				res.status(400).send(
            			{message:0});
    				})
    	}

    	else{
    			res.status(400).send(
            				{message:-1});
    	}

    	}

    	);

});


app.get('/obtenerInformesRango',function(req, res){

	validarToken(req.query.iden,"A",req.query.codigo,function(result){
    	
    	if (result===true){
    			

    			db.func('sp_obtenerInformesFechas',[req.query.fecha_uno,req.query.fecha_dos,req.query.sede])
  					.then (data=>{
    					console.log(data);
    					res.end(JSON.stringify(data));
  					})


    			.catch(error=> {
            			console.log("ERROR: ",error);
        				res.status(400).send(
            			{message:0});
    				})
    	}

    	else{
    			res.status(400).send(
            				{message:-1});
    	}

    	}

    	);
});
  

//Lista!
app.get('/ObtenerInformesArea', function(req, res) {

	validarToken(req.query.iden,"A",req.query.codigo,function(result){
    	
    	if (result===true){
    			
    			db.func('sp_obtenerInformes_area',[req.query.area,req.query.sede])
    				.then(data => {
    					console.log(data);
    					res.end(JSON.stringify(data));})

    				.catch(error=> {
            			console.log("ERROR: ",error);
        				res.status(400).send(
            			{message:0});
    				})
    	}

    	else{
    			res.status(400).send(
            				{message:-1});
    	}

    	}

    	);
});
 
//Lista!
app.get('/ObtenerInformes', function(req, res) {

	validarToken(req.query.iden,"A",req.query.codigo,function(result){
    
    	if (result===true){
    			
    			db.func('sp_obtenerInformes',[req.query.sede])
					.then(data => {
						res.end(JSON.stringify(data));})

    				.catch(error=> {
            			console.log("ERROR: ",error);
        				res.status(400).send(
            			{message:0});
    				})
    	}

    	else{
    			res.status(400).send(
            				{message:-1});
    	}

    	}

    	);
});
  

//Lista!
app.get('/ObtenerInformeId', function(req, res) {

	validarToken(req.query.iden,"A",req.query.codigo,function(result){
   
    	if (result===true){
    			
    			db.func('sp_obtenerInforme_porId',[req.query.id])
					.then(data => {
						console.log(data);
						res.end(JSON.stringify(data));})

    				.catch(error=> {
            			console.log("ERROR: ",error);
        				res.status(400).send(
            			{message:0});
    				})
    	}

    	else{
    			res.status(400).send(
            				{message:-1});
    	}

    	}

    	);
});
  

//Lista!
app.post('/ModificarInforme', (req, res, next) => {

	validarToken(req.query.iden,"P",req.query.codigo,function(result){
    	console.log("result= " + result);
    	if (result===true){
    			
    			db.func('sp_modificarInforme',[req.query.id,req.query.area, req.query.actividad, req.query.fechaInicio, req.query.fechaFinal, req.query.objetivo, req.query.programa, req.query.cantidadEstudiantes,req.query.sede])
					.then(data => {
						res.end(JSON.stringify(data));})

    				.catch(error=> {
            			console.log("ERROR: ",error);
        				res.status(400).send(
            			{message:0});
    				})
    	}

    	else{
    			res.status(400).send(
            				{message:-1});
    	}

    	}

    	);
});


//================================================================================================
//      Fotos/Archivos
//================================================================================================


//Lista!
app.post('/CrearImagen', function(req, res) {

	validarToken(req.query.iden,"P",req.query.codigo,function(result){
    	console.log("result= " + result);
    	if (result===true){
    			
    			db.func('sp_crearImagen',[req.query.idInforme,req.query.placa])
    				.then(data => {
    					console.log("imagen agregada");
     					res.end(JSON.stringify(data.sp_crearimagen));
    				
    				})

    				.catch(error=> {
            			console.log("ERROR: ",error);
        				res.status(400).send(
            			{message:0});
    				})
    	}

    	else{
    			res.status(400).send(
            				{message:-1});
    	}

    	}

    	);
});

//Lista!
app.get('/ObtenerImagenesInforme', function(req, res) {

	validarToken(req.query.iden,req.query.tipo,req.query.codigo,function(result){
    	console.log("result= " + result);
    	if (result===true){
    			
    			db.func('sp_obtenerImagenes_informe',[req.query.idInforme])
    				.then(data => {
      					console.log(data);
      					res.end(JSON.stringify(data));
    				})

    				.catch(error=> {
            			console.log("ERROR: ",error);
        				res.status(400).send(
            			{message:0});
    				})
    	}

    	else{
    			res.status(400).send(
            				{message:-1});
    	}

    	}

    	);
});

//Lista!
app.delete('/EliminarImagen', function(req, res) {

	validarToken(req.query.iden,"P",req.query.codigo,function(result){
    	console.log("result= " + result);
    	if (result===true){
    			
    			db.func('sp_eliminarImagen',[req.query.idInforme, req.query.nombre])
    				.then(data =>
					{
					console.log(data.sp_eliminarImagen);
					res.end(JSON.stringify(data.sp_eliminarImagen));
            	})

    			.catch(error=> {
            			console.log("ERROR: ",error);
        				res.status(400).send(
            			{message:0});
    				})
    	}

    	else{
    			res.status(400).send(
            				{message:-1});
    	}

    	}

    	);
});


//================================================================================================
//      Configuración e inicio del sistema
//================================================================================================



var server = app.listen(8081, function ()
{
	var host = server.address().address;
	var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});

