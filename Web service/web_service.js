/*
*     Web Service REST para la BD Devesa
*
* Autor: Edward Andrey Murillo Castro | 2015027610
* Contacto: m.edwardandrey@gmail.com, m.edwardandrey@yahoo.com, eamc96@estudiantec.cr
* Última Fecha de Modificación: 31/03/2017
*
*/



var pg = require('pg'); //postgres controller

//formato del string: "postgres://nombreUsuario:contraseña@ip:puerto/baseDeDatos"
var conString = "postgres://postgres:12345@localhost:5432/devesa_app"; //connection link
var client;
var express = require('express');
var app = express(); //restful api
var pgp = require('pg-promise')();
var base64=require('base-64');

var cn = {
    host: 'localhost',
    port: 5432,
    database: 'devesa_app',
    user: 'postgres',
    password: '12345'
};

var db = pgp(cn);




app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "DELETE, GET, POST");
    next();
})



//===============================================================================================
//		SEGURIDAD
//===============================================================================================
app.delete('/eliminarToken',function(req,res){

	db.proc('sp_eliminarToken',[req.query.codigo])
	.then(data => {
	
		res.end(JSON.stringify(true));
	})

	.catch(error => {
      		console.log("ERROR: ",error);
      		res.end(JSON.stringify("Invalid_token"));
    	})
})

app.post('/registrarToken',function(req,res){
    console.log(req.query.iden);
    console.log(req.query.tipo);
    console.log(req.query.codigo);
	db.proc('sp_almacenarToken',[req.query.iden,req.query.tipo,req.query.codigo])
	.then(data => {
	
		res.end(JSON.stringify(true));
	})

	.catch(error => {
      		console.log("ERROR: ",error);
      		res.status(400).send({message:"Eror en registro"});
    	})
})


//================================================================================================
//      Solicitudes
//================================================================================================


//Lista!
app.post('/CrearSolicitud', function(req, res) {
	//validacion de token
	db.proc('sp_TokenValido',[req.query.iden,req.query.tipo,req.query.codigo])
	.then(data => {
	  if(data.sp_tokenvalido==true) {
		 db.proc('sp_crearSolicitud',[req.query.carnet,req.query.tramite,req.query.sede])
		.then(data => {
			console.log("DATA:", data);
      console.log(data.sp_crearsolicitud);
      res.end(JSON.stringify(data.sp_crearsolicitud));
		})
		.catch(error=> {
			console.log("ERROR: ",error);
			res.end(JSON.stringify(false));
		})

		}

	else{
    		res.end(JSON.stringify("Invalid_Token"));
    		}
	})
	.catch(error => {
      		console.log("ERROR: ",error);
      		res.end(JSON.stringify("Invalid_Token"));
    	})
	
})

//Lista!
app.get('/ObtenerSolicitudesNoAtendidas', function(req, res) {
  db.proc('sp_TokenValido',[req.query.iden,"S",req.query.codigo])
	.then(data => {
	if(data.sp_tokenvalido==true) {
			db.func('sp_obtenerSolicitudesNoAtendidas',[req.query.sede])
    		.then(data => {
      			console.log(data);
      			res.end(JSON.stringify(data));
    		})
    	.catch(error => {
      			console.log("ERROR: ",error);
      			res.end(JSON.stringify(false));
    		})
		}

	else {
    		res.end(JSON.stringify("Invalid_Token"));
    		}
	})
	.catch(error => {
      		console.log("ERROR: ",error);
      		res.end(JSON.stringify("Invalid_Token"));
    	})
})

//----------------------------------------------------------
app.get('/ObtenerSolicitudesAtendidas', function(req, res) {
	db.proc('sp_TokenValido',[req.query.iden,"S",req.query.codigo])
	.then(data => {

	if(data.sp_tokenvalido==true){

		db.func('sp_obtenerSolicitudesAtendidas',[req.query.sede])
    	.then(data => {
     		 console.log(data);
      		res.end(JSON.stringify(data));
    			})
    	.catch(error => {
     		 console.log("ERROR: ",error);
    		 res.end(JSON.stringify(false));
    		})
		}

	else{
    		res.end(JSON.stringify("Invalid_Token"));
    		}
	})
		.catch(error => {
      		console.log("ERROR: ",error);
      		res.end(JSON.stringify("Invalid_Token"));
    	})

})



//Lista!
app.get('/ObtenerSolicitudesCarnet', function(req, res) {	
  	db.proc('sp_TokenValido',[req.query.iden,"E",req.query.codigo])
  	.then(data => {
  		if(data.sp_tokenvalido==true){
  			db.func('sp_obtenerSolicitudesCarnet',[req.query.carnet])
    		.then(data => {
      			console.log(data);
      			res.end(JSON.stringify(data));
   	 		})
    		.catch(error => {
      			console.log("ERROR: ",error);
      			res.end(JSON.stringify(false));
    		})	
    	}

    	else{
    		res.end(JSON.stringify("Invalid_Token"));
    		}
    	})
    .catch(error => {
      		console.log("ERROR: ",error);
      		res.end(JSON.stringify("Invalid_Token"));
    	})
})

//Lista!
app.delete('/EliminarSolicitud', function(req, res) {
	console.log(req.query.iden);
	db.proc('sp_TokenValido',[req.query.iden,"E",req.query.codigo])
	.then(data => {
		if(data.sp_tokenvalido==true){
				db.proc('sp_eliminarSolicitud',[req.query.id])
    			.then(data => {
      				console.log(data.sp_eliminarsolicitud);
      				res.end(JSON.stringify(data.sp_eliminarsolicitud));
   					 })
    			.catch(error => {
      				console.log("ERROR: ",error);
      				res.end(JSON.stringify(false));
   				})

			}

		else{
    		res.end(JSON.stringify("Invalid_Token"));
    		}
		})
		.catch(error => {
      		console.log("ERROR: ",error);
      	  res.end(JSON.stringify("Invalid_Token"));
    	})	  
})

//Lista!
app.post('/ActualizarEstado', (req, res, next) =>{
  	db.proc('sp_TokenValido',[req.query.iden,"S",req.query.codigo])
		.then(data => {
		if(data.sp_tokenvalido==true){

			client = new pg.Client(conString);
  			client.connect();
  			client.query('UPDATE solicitudes SET estado = TRUE WHERE idSolicitud = ($1)',[req.query.id], function(err, result) {
    		if (err)
   			 {
      		console.log(err);
      		res.end(JSON.stringify(false));
      		return;
    		}
    		console.log("true");
    		client.end();
    		res.end(JSON.stringify(true));
  			});
		}

		else{
    		res.end(JSON.stringify("Invalid_Token"));
    		}
		})
		.catch(error => {
      		console.log("ERROR: ",error);
      		res.end(JSON.stringify("Invalid_Token"));
    		})
  
})


//================================================================================================
//      Informes
//================================================================================================


//Lista! 

app.post('/CrearInforme', function(req, res) {
  
	db.proc('sp_TokenValido',[req.query.iden,"P",req.query.codigo])
			.then(data => {
			if(data.sp_tokenvalido==true){

			db.proc('sp_crearInforme',
    		[req.query.profesorID,
    		req.query.area,
    		req.query.actividad,
   			req.query.fechaInicio,
        req.query.fechaFinal,
    		req.query.objetivo,
   			req.query.programa,
    		req.query.cantidadEstudiantes,
    		req.query.sede])
    		.then(data => {
      		console.log("DATA:", data);
      		console.log(data.sp_crearinforme);
      		res.end(JSON.stringify(data.sp_crearinforme));
    	})
    		.catch(error=> {
    			console.log("ERROR: ",error);
    			res.end(JSON.stringify(false));
    			})
			}

			else{
    			res.end(JSON.stringify("Invalid_Token"));
    			}
			})
		.catch(error => {
      		console.log("ERROR: ",error);
      		res.end(JSON.stringify("Invalid_Token"));
    	})
 
}) 







//Lista!
app.get('/ObtenerInformesProfesor', function(req, res) {
  db.proc('sp_TokenValido',[req.query.iden,"P",req.query.codigo])
	.then(data => {
			if(data.sp_tokenvalido==true){

				db.func('sp_obtenerInformes_profesor',[req.query.profesorID,req.query.sede])
    			.then(data => {
      			console.log(data);
      			res.end(JSON.stringify(data));
    		})
    			.catch(error => {
      			console.log("ERROR: ",error);
      			res.end(JSON.stringify(false));
    			})
			}

			else{
    			res.end(JSON.stringify("Invalid_Token"));
    			}
	})
	.catch(error => {
      		console.log("ERROR: ",error);
      		res.end(JSON.stringify("Invalid_Token"));
    }) 
})

app.get('/obtenerInformesRango',function(req, res){
  
	db.proc('sp_TokenValido',[req.query.iden,"A",req.query.codigo])
		.then(data => {
			if(data.sp_tokenvalido==true){

				db.func('sp_obtenerInformesFechas',[req.query.fecha_uno,req.query.fecha_dos,req.query.sede])
  				.then (data=>{
    				console.log(data);
    				res.end(JSON.stringify(data));
  					})
  				.catch(error=>{
    				console.log("ERROR: ",error);
            res.end(JSON.stringify(false));
  				})

			}


			else{
    			res.end(JSON.stringify("Invalid_Token"));
    		}

			})
		.catch(error => {
      		console.log("ERROR: ",error);
      		res.end(JSON.stringify("Invalid_Token"));
    		})
})

//Lista!
app.get('/ObtenerInformesArea', function(req, res) {
 
	db.proc('sp_TokenValido',[req.query.iden,"A",req.query.codigo])
		.then(data => {
			if(data.sp_tokenvalido==true){

			  db.func('sp_obtenerInformes_area',[req.query.area,req.query.sede])
    			.then(data => {
      			console.log(data);
      			res.end(JSON.stringify(data));
    			})
    			.catch(error => {
      			console.log("ERROR: ",error);
      		  res.end(JSON.stringify(false));
    			})

			}

			else{
    		res.end(JSON.stringify("Invalid_Token"));
    		}
			})

		.catch(error => {
      		console.log("ERROR: ",error);
      		res.end(JSON.stringify("Invalid_Token"));
    	})
})

//Lista!
app.get('/ObtenerInformes', function(req, res) {
  

	db.proc('sp_TokenValido',[req.query.iden,"A",req.query.codigo])
		.then(data => {
			if(data.sp_tokenvalido==true){

				db.func('sp_obtenerInformes',[req.query.sede])
    				.then(data => {
      					console.log(data);
      					res.end(JSON.stringify(data));
    			})
    				.catch(error => {
      					console.log("ERROR: ",error);
      					res.end(JSON.stringify(false));

    					})
			}

			else{
    			res.end(JSON.stringify("Invalid_Token"));
    			}
				})
		.catch(error => {
      		console.log("ERROR: ",error);
      		res.end(JSON.stringify("Invalid_Token"));
    	}) 
})






//Lista!
app.get('/ObtenerInformeId', function(req, res) {
  	
  	db.proc('sp_TokenValido',[req.query.iden,"A",req.query.codigo])
		.then(data => {
			if(data.sp_tokenvalido==true){

				db.func('sp_obtenerInforme_porId',[req.query.id])
    				.then(data => {
      					console.log(data);
      					res.end(JSON.stringify(data));
    					})
    				.catch(error => {
      					console.log("ERROR: ",error);
      					res.end(JSON.stringify(false));
    					})

				}

			else{
    			res.end(JSON.stringify("Invalid_Token"));
    			}
			})
		.catch(error => {
      		console.log("ERROR: ",error);
      		res.end(JSON.stringify("Invalid_Token"));
    			})

})


//
//Lista!
app.post('/ModificarInforme', (req, res, next) => {
  
	db.proc('sp_TokenValido',[req.query.iden,"P",req.query.codigo])
		.then(data => {
			if(data.sp_tokenvalido==true){

					 client = new pg.Client(conString);
 					 client.connect();
  					 client.query('UPDATE informes SET' +
    				 '(area,actividad,fechaInicio,fechaFinal,objetivo,programa,cantEstudiantes)' +
    				' =($1,$2,$3,$4,$5,$6,$7) WHERE idInforme = $8; ',
    				[req.query.area,
   					 req.query.actividad,
    				 req.query.fechaInicio,
             req.query.fechaFinal,
    				 req.query.objetivo,
    				 req.query.programa,
   					 req.query.cantidadEstudiantes,
    				 req.query.id],
    				function(err, result) {
    				if (err)
    					{
      					console.log(err);
      					res.end(JSON.stringify(false));
      					return;
    					}
    					console.log("true");
    					client.end();
    					res.end(JSON.stringify(true));
  						});


					}

			else{
    			res.end(JSON.stringify("Invalid_Token"));
    			}
			})
		.catch(error => {
      			console.log("ERROR: ",error);
      			res.end(JSON.stringify("Invalid_Token"));
    		})

})






//================================================================================================
//      Fotos/Archivos
//================================================================================================


//Lista!
app.post('/CrearImagen', function(req, res) {
  	db.proc('sp_TokenValido',[req.query.iden,req.query.tipo,req.query.codigo])
			.then(data => {
				if(data.sp_tokenvalido==true){

					db.proc('sp_crearImagen',[req.query.idInforme,req.query.placa])
    					.then(data => {
      						console.log("DATA:", data);
      						console.log(data.sp_crearimagen);
     						res.end(JSON.stringify(data.sp_crearimagen));
    					})
    					.catch(error=> {
      						console.log("ERROR: ",error);
      						res.end(JSON.stringify(false));
    					})
					}

				else{
    					res.end(JSON.stringify("Invalid_Token"));
    					}
				})
			.catch(error => {
      				console.log("ERROR: ",error);
      				res.end(JSON.stringify("Invalid_Token"));
    			})
})

//Lista!
app.get('/ObtenerImagenesInforme', function(req, res) {
  
	db.proc('sp_TokenValido',[req.query.iden,"A",req.query.codigo])
		.then(data => {
			if(data.sp_tokenvalido==true){

				db.func('sp_obtenerImagenes_informe',[req.query.idInforme])
    				.then(data => {
      					console.log(data);
      					res.end(JSON.stringify(data));
    				})
    				.catch(error => {
      					console.log("ERROR: ",error);
      					res.end(JSON.stringify(false));
    				})

				}

			else{
    				res.end(JSON.stringify("Invalid_Token"));
    		}

			})
		.catch(error => {
      			console.log("ERROR: ",error);
      			res.end(JSON.stringify("Invalid_Token"));
    		})
 
})

//Lista!
app.get('/ObtenerImagenesArea', function(req, res) {

	db.proc('sp_TokenValido',[req.query.iden,"A",req.query.codigo])
		.then(data => {
			if(data.sp_tokenvalido==true){

				db.func('sp_obtenerImagenes_area',[req.query.area,req.query.sede])
    				.then(data => {
     					 console.log(data);
      					res.end(JSON.stringify(data));
    				})
    				.catch(error => {
      					console.log("ERROR: ",error);
                res.end(JSON.stringify(false));
   					 })

					}

			else{
    				res.end(JSON.stringify("Invalid_Token"));
    		}
					})
		.catch(error => {
      			console.log("ERROR: ",error);
      			res.end(JSON.stringify("Invalid_Token"));
    		})  
})



//================================================================================================
//      Configuración e inicio del sistema
//================================================================================================


var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})






// solicitudes
// 	**AgregarSolicitud (datos)
// 	**ObtenerSolicitud (identificador)
//  **eliminarSolicitud (identificador)
// 	**ObtenerSolicitudesNoAtendidas
// 	ObtenerSolicitudesAtendidas ?
// 	**ActualizarEstado (identificador)


// informes
// 	**AgregarInforme (datos)
// 	**ObtenerInforme (profesor | area | identificador) [obtenerlo para modificarlo, por lo que requiere el idInforme]
// 	**ObtenerInformes () [sin parámetros]
//  **ActualizarInforme (idInforme)


//[Comentario***] puede requerirse el endpoint obtenerInforme y obtenerSolicitud (por id)

//Las funciones ObtenerInforme y ObtenerInformes son básicamente la misma con diferentes parámetros y con diferentes nombres
//(debido a que el parámetro es del mismo tipo para la mayoría de los casos)

//Asumiendo que sólo se mantendrán registrados los informes de un semestres el procedimiento para obtener todos será un 'select *'

// 	**ObtenerImagenes (idInforme | area)
// 	**ModificarInforme
// 	*EliminarInforme


//Procedimientos almacenados realizados (faltan pruebas con datos)