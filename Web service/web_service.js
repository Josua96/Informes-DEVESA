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



//===============================================================================================
//		SEGURIDAD
//===============================================================================================

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
    //validacion de token
    db.proc('sp_TokenValido',[req.query.iden,"E",req.query.codigo])
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
        res.status(400).send(
            {message:false});
    })

    }

else{
        res.end(JSON.stringify(false));
    }
})
.catch(error => {
        console.log("ERROR: ",error);
    res.end(JSON.stringify(false));
})

});




app.get('/ObtenerSolicitudesNoAtendidas', function(req, res) {
  db.proc('sp_TokenValido',[req.query.iden,"S",req.query.codigo])
	.then(data => {
	if(data.sp_tokenvalido==true)
	{
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
	else
	{
		res.end(JSON.stringify(false));
	}
	})
	.catch(error => {
      		console.log("ERROR: ",error);
      		res.end(JSON.stringify(false));
    	})
});




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

});


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
});



//Lista!
app.delete('/EliminarSolicitud', function(req, res) {
	console.log(req.query.iden);
	db.proc('sp_TokenValido',[req.query.iden,"E",req.query.codigo])
	.then(data => {
		if(data.sp_tokenvalido==true)
		{
				db.proc('sp_eliminarSolicitud',[req.query.id])
    			.then(data => {console.log(data.sp_eliminarsolicitud);res.end(JSON.stringify(data.sp_eliminarsolicitud));})
    			.catch(error => {console.log("ERROR: ",error); res.end(JSON.stringify(false));})
		}
		else{res.end(JSON.stringify("Invalid_Token"));}
		})
		.catch(error => {console.log("ERROR: ",error);res.end(JSON.stringify("Invalid_Token"));})
});

//Lista!
app.post('/ActualizarEstado', (req, res, next) =>{
  	db.proc('sp_TokenValido',[req.query.iden,"S",req.query.codigo])
		.then(data => {
		if(data.sp_tokenvalido==true)
		{
            db.func('sp_actualizarEstado',[req.query.id])
			.then(data => {console.log(data);res.end(JSON.stringify(data));})
        	.catch(error => {console.log("ERROR: ",error);res.end(JSON.stringify(false));})
		}
		else
		{
    		res.end(JSON.stringify("Invalid_Token"));
		}
		})
		.catch(error => {console.log("ERROR: ",error);res.end(JSON.stringify("Invalid_Token"));})
})



//================================================================================================
//      Informes
//================================================================================================


//Lista! 

app.post('/CrearInforme', function(req, res) {
	db.proc('sp_TokenValido',[req.query.iden,"P",req.query.codigo])
			.then(data => {
			if(data.sp_tokenvalido==true)
			{
				db.proc('sp_crearInforme', [req.query.profesorID, req.query.area, req.query.actividad, req.query.fechaInicio, req.query.fechaFinal, req.query.objetivo, req.query.programa, req.query.cantidadEstudiantes, req.query.sede])
				.then(data => {console.log("DATA:", data); console.log(data.sp_crearinforme); res.end(JSON.stringify(data.sp_crearinforme));})
				.catch(error=> {console.log("ERROR: ",error);res.end(JSON.stringify(false));})
			}
			else{res.end(JSON.stringify("Invalid_Token"));}})
		.catch(error => {console.log("ERROR: ",error);res.end(JSON.stringify(false));})
});







//Lista!
app.get('/ObtenerInformesProfesor', function(req, res) {
  db.proc('sp_TokenValido',[req.query.iden,"P",req.query.codigo])
	.then(data => {
			if(data.sp_tokenvalido==true)
			{
				db.func('sp_obtenerInformes_profesor',[req.query.profesorID,req.query.sede])
    			.then(data =>
                {
      			res.end(JSON.stringify(data));
    		})
    			.catch(error => {
      			console.log("ERROR: ",error);
      			res.end(JSON.stringify(false));
    			})
			}
			else
			{
				res.end(JSON.stringify(false));
			}
	})
	.catch(error => {
      		console.log("ERROR: ",error);
      		res.end(JSON.stringify(false));
    })
});

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
		.catch(error => {console.log("ERROR: ",error);res.end(JSON.stringify(false));})
});

//Lista!
app.get('/ObtenerInformesArea', function(req, res) {
 
	db.proc('sp_TokenValido',[req.query.iden,"A",req.query.codigo])
		.then(data => {
			if(data.sp_tokenvalido==true)
			{
			  db.func('sp_obtenerInformes_area',[req.query.area,req.query.sede])
    			.then(data => {console.log(data);res.end(JSON.stringify(data));})
    			.catch(error => {console.log("ERROR: ",error);res.end(JSON.stringify(false));})
			}

			else{
    			res.end(JSON.stringify(false));
			}
			})

		.catch(error => {
      		console.log("ERROR: ",error);
      		res.end(JSON.stringify(false));
    	})
})

//Lista!
app.get('/ObtenerInformes', function(req, res) {
  

	db.proc('sp_TokenValido',[req.query.iden,"A",req.query.codigo])
		.then(data => {
			if(data.sp_tokenvalido==true)
			{
				db.func('sp_obtenerInformes',[req.query.sede])
				.then(data => {res.end(JSON.stringify(data));})
				.catch(error => {console.log("ERROR: ",error);res.end(JSON.stringify(false));})
			}
			else
			{
    			res.end(JSON.stringify("Invalid_Token"));
			}
				})
		.catch(error => {console.log("ERROR: ",error);res.end(JSON.stringify(false));
    	}) 
})






//Lista!
app.get('/ObtenerInformeId', function(req, res) {
  	
  	db.proc('sp_TokenValido',[req.query.iden,"A",req.query.codigo])
		.then(data => {
			if(data.sp_tokenvalido==true)
			{
				db.func('sp_obtenerInforme_porId',[req.query.id])
				.then(data => {console.log(data);res.end(JSON.stringify(data));})
				.catch(error => {console.log("ERROR: ",error);res.end(JSON.stringify(false));})
			}
			else{
    				res.end(JSON.stringify("Invalid_Token"));
    			}
			})
		.catch(error => {
      		console.log("ERROR: ",error);
      		res.end(JSON.stringify(false));
    			})

})


//
//Lista!
app.post('/ModificarInforme', (req, res, next) => {
	db.proc('sp_TokenValido',[req.query.iden,"P",req.query.codigo])
		.then(data => {
			if(data.sp_tokenvalido==true)
			{
                db.func('sp_modificarInforme',[req.query.id,req.query.area, req.query.actividad, req.query.fechaInicio, req.query.fechaFinal, req.query.objetivo, req.query.programa, req.query.cantidadEstudiantes])
				.then(data => {res.end(JSON.stringify(data));})
				.catch(error => {console.log("ERROR2: ",error);res.end(JSON.stringify(false));})
			}
			else{res.end(JSON.stringify(false));}
		})
		.catch(error => {console.log("ERROR1: ",error);res.end(JSON.stringify(false));})
})









//================================================================================================
//      Fotos/Archivos
//================================================================================================


//Lista!
app.post('/CrearImagen', function(req, res) {

  	db.proc('sp_TokenValido',[req.query.iden,req.query.tipo,req.query.codigo])
			.then(data => {
                console.log(req.query.tipo);
			    console.log(data);
				if(data.sp_tokenvalido===true)
				{
				    console.log(req.query.idInforme+"  "+req.query.placa);
					db.proc('sp_crearImagen',[req.query.idInforme,req.query.placa])
    					.then(data => {
     						res.end(JSON.stringify(data.sp_crearimagen));
    					})
    					.catch(error=>
                        {
      						console.log("ERROR: ",error);
      						res.end(JSON.stringify(false));
    					});
				}
				else
                {
				    res.end(JSON.stringify(false));
                }
            })
			.catch(error => {console.log("ERROR: ",error); res.end(JSON.stringify(false)); });
});

//Lista!

app.get('/ObtenerImagenesInforme', function(req, res) {
	db.proc('sp_TokenValido',[req.query.iden,req.query.tipo,req.query.codigo])
		.then(data => {
			if(data.sp_tokenvalido==true)
			{
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
    				res.end(JSON.stringify(false));
    		}
			})
		.catch(error => {
      			console.log("ERROR: ",error);
      			res.end(JSON.stringify(false));
    		});
});

//Lista!
app.delete('/EliminarImagen', function(req, res) {

	db.proc('sp_TokenValido',[req.query.iden,req.query.tipo,req.query.codigo])
		.then(data => {
			if(data.sp_tokenvalido==true)
			{
                db.proc('sp_eliminarImagen',[req.query.idInforme, req.query.nombre]).then(data =>
				{
					console.log(data.sp_eliminarImagen);
					res.end(JSON.stringify(data.sp_eliminarImagen));
            	})
            .catch(error => {
                console.log("ERROR: ",error);
            });
			}
			else
				{
    				res.end(JSON.stringify(false));
				}
					})
		.catch(error => {
      			console.log("ERROR: ",error);
      			res.end(JSON.stringify(false));
    		});
});





//================================================================================================
//      Configuración e inicio del sistema
//================================================================================================


var server = app.listen(8081, function ()
{
	var host = server.address().address;
	var port = server.address().port;
	var ip = server.address().ip;
  console.log("Example app listening at http://%s:%s", host, port, ip);
});

