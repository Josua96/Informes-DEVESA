create domain t_cedula
    char(11) not null
    constraint CHK_cedulas CHECK(VALUE similar to '[1-9]-[0-9][0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]');

create domain t_sede
    varchar(2)
    constraint CHK_sede CHECK(value IN ('SC','C','L','IA','S'));

create domain t_carne
    varchar(10) NOT NULL
    constraint CHK_carne CHECK (value SIMILAR TO ('[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'));
create domain t_tramite
    varchar(20) NOT NULL
    constraint CHK_tramite CHECK (value IN ('CCSS','pension','regular','visa', 'CCSSResidencia'));

create domain t_area
    varchar(3) NOT NULL
    constraint CHK_area CHECK (value IN ('DI','SE','AYR','TSR', 'TSB','PS','BI','SOD','SME','SEN','CU','DE'));

/************************************************
Posiblemente se requiera un índice en el atributo fecha Inicio de los infomes
CREATE INDEX informes_fechaIncio_fecha_index ON informes((fechaInicio::DATE));
*************************************************/



--------------------------------------------------- CARTAS DEVESA  -------------------------------------------------



CREATE TABLE solicitudes
(
    idSolicitud SERIAL NOT NULL PRIMARY KEY,
    fechaSolicitud TIMESTAMP DEFAULT(CURRENT_TIMESTAMP),
    carne t_carne,
    tramite t_tramite,
    estado BOOLEAN NOT NULL DEFAULT FALSE,
    fechaImpresion TIMESTAMP,
    notificado BOOLEAN DEFAULT (FALSE),
    sede t_sede
);

------------------------------------------------- INFORMES ---------------------------------------------------------

create table informes
(
    id SERIAL NOT NULL PRIMARY KEY,
    funcionarioID t_cedula,
    area t_area,
    actividad VARCHAR(400) NULL,
    fechaInicio TIMESTAMP NOT NULL,
    fechaFinal DATE NOT NULL,
    objetivo VARCHAR(400),
    programa VARCHAR(100),
    cantEstudiantes INT NOT NULL,
    sede t_sede
);

--===========================================================================
--Propósito: Mantener un registro
--===========================================================================
create table imagenes
(
    placa VARCHAR PRIMARY KEY NOT NULL,
    id_informe INT NOT NULL,
    CONSTRAINT FK_idInforme_imagenes FOREIGN KEY (id_informe) REFERENCES informes ON UPDATE CASCADE ON DELETE CASCADE
);

------------------------------------------------ SEGURIDAD ---------------------------------------------------------

--=============================================================================
--Propósito: Mantener un registro de los usuarios que tienen sesiones abiertas  
--=============================================================================
CREATE TABLE autorizacion
(
	idUsuario t_cedula,
	TipoUsuario char(1),
	token char(32)UNIQUE,
	CONSTRAINT PK_idUsuario_autorizacion PRIMARY KEY(idUsuario)
);

--- ===========================================================
--- SEGURIDAD
--- ===========================================================

-- Validacion del token

--===============================================================
--AUTHOR: Josua Carranza Pérez
--CREATE DATE: 
--DESCRIPTION: Verifica que el usuario tenga un token válido para acceder al sistema, (número de cédula,tipo de usuario,Token)
--   : true si la operación fue exitosa, de lo contrario levanta una excepción
--===============================================================
CREATE OR REPLACE FUNCTION sp_tokenValido(IN id t_cedula,IN tipoU CHAR(1),IN codigo CHAR(5))
RETURNS BOOLEAN AS
$BODY$
BEGIN
	IF (SELECT COUNT (idUsuario) FROM autorizacion WHERE idUsuario = id AND TipoUsuario = tipoU AND token =codigo) =0 THEN
		RAISE EXCEPTION 'token inválido';
	ELSE
	    RETURN TRUE;
	END IF;

END
$BODY$
LANGUAGE plpgsql;



--===============================================================
--AUTHOR: Josua Carranza Pérez
--CREATE DATE: 
--DESCRIPTION: Elimina un token de la tabla autorización, (Token)
--   : Si la operación falla levanta una excepción
--===============================================================

CREATE OR REPLACE FUNCTION sp_eliminarToken(IN codigo CHAR(32))
RETURNS VOID AS
$BODY$
BEGIN
	DELETE FROM autorizacion WHERE codigo = token;
END
$BODY$
LANGUAGE plpgsql;



--===============================================================
--AUTHOR: Josua Carranza Pérez
--CREATE DATE: 
--DESCRIPTION: almacena un token para un usuario en la base de datos, (número de cédula,tipo de usuario,Token)
--   : Si la operación falla levanta una excepción
--===============================================================

CREATE OR REPLACE FUNCTION sp_almacenarToken
(IN id t_cedula,IN tipoU CHAR(1), IN codigo CHAR(32))
RETURNS VOID AS
$BODY$
BEGIN
	IF (SELECT COUNT(*) FROM autorizacion WHERE token SIMILAR TO '%'||codigo||'%')> 0 THEN
		DELETE FROM autorizacion WHERE token SIMILAR TO '%'||codigo||'%';
	END IF;
	INSERT INTO autorizacion VALUES(id,tipoU,codigo);
END
$BODY$
LANGUAGE plpgsql;




--- ===========================================================
--- CARTAS
--- ===========================================================

--===============================================================
--AUTHOR: Andrey Murillo
--CREATE DATE: 
--DESCRIPTION: almacena una nueva solicitud (tabla solicitudes) con el carnet del estudiante, el tipo de trámite y la sede
--   : TRUE si el proceso fue exitoso, de lo contrario levanta una excepción.
--===============================================================

CREATE OR REPLACE FUNCTION sp_crearSolicitud(IN v_carne t_carne,IN v_tramite t_tramite,IN v_sede t_sede)
RETURNS BOOLEAN AS
$BODY$
BEGIN
		/** Definir límite de solicitudes del mismo tipo que puede realizar un estudiante */
    	IF ((SELECT COUNT(*) FROM solicitudes WHERE v_carne=carne AND v_tramite=tramite AND v_sede=sede AND estado=true)>4) THEN
    		RAISE EXCEPTION 'limite';
    	END IF;

    	IF ((SELECT COUNT(*) FROM solicitudes WHERE v_carne=carne AND v_tramite=tramite AND v_sede=sede AND estado=FALSE)) THEN
    		RAISE EXCEPTION 'registrada';
    	END IF;

    	INSERT INTO solicitudes (carne,fechaSolicitud,tramite,estado,sede) VALUES (v_carne,CURRENT_TIMESTAMP,v_tramite,FALSE,v_sede);
    	RETURN TRUE;
END;
$BODY$
LANGUAGE plpgsql;


--===============================================================
--AUTHOR: Andrey Murillo
--CREATE DATE: 
--DESCRIPTION: Obtiene las solicitudes que aún no han sido impresas (filtro por sede)
--   : Retorna un conjunto de registros (solicitudes), de lo contrario levanta una excepción.
--===============================================================
CREATE OR REPLACE FUNCTION sp_obtenerSolicitudesNoAtendidas
(
    IN v_sede t_sede,		
    OUT v_idSolicitud INT,
    OUT v_carne t_carne,
    OUT v_tramite t_tramite,   
    OUT v_estado BOOLEAN
) RETURNS SETOF record AS
$BODY$
BEGIN
	RETURN query SELECT idSolicitud, carne, tramite,estado FROM solicitudes WHERE estado = FALSE AND sede= v_sede
	              ORDER BY fechaSolicitud ASC;
END;
$BODY$
LANGUAGE plpgsql;

--===============================================================
--AUTHOR: Andrey Murillo
--CREATE DATE: 
--DESCRIPTION: Obtener las solicitudes que han sido impresas en el día en cuestión  (filtro por sede)
--   : Retorna un conjunto de registros (solicitudes), de lo contrario levanta una excepción.
--===============================================================
CREATE OR REPLACE FUNCTION sp_obtenerSolicitudesAtendidas
(
    IN v_sede t_sede,	
    OUT v_idSolicitud INT,
    OUT v_carne t_carne,
    OUT v_tramite t_tramite,   
    OUT v_estado BOOLEAN
)    
RETURNS SETOF record AS
$BODY$
 DECLARE fechaActual DATE;
BEGIN
	fechaActual = (SELECT CURRENT_DATE);
	RETURN query SELECT idSolicitud, carne, tramite,estado FROM solicitudes WHERE estado = TRUE AND sede = v_sede AND fechaImpresion::DATE = fechaActual
	ORDER BY fechaImpresion DESC;
END
$BODY$
LANGUAGE plpgsql;



--===============================================================
--AUTHOR: Andrey Murillo
--CREATE DATE: 
--DESCRIPTION: Obtiene las solicitudes que ha realizado algún estudiante ya sea que fueron atendidas o no (por el número de carné)
--   : Un conjunto de registros de la tabla solicitudes, de lo contrario levanta una excepción.
--===============================================================

CREATE OR REPLACE FUNCTION sp_obtenerSolicitudesCarnet
(
    IN v_carnet t_carne,
    OUT v_idSolicitud INT,
    OUT v_carne t_carne,
    OUT v_tramite t_tramite,
    OUT v_fechaSolicitud TIMESTAMP,
    OUT v_estado BOOLEAN,
    OUT v_sede t_sede
) RETURNS SETOF RECORD AS
$BODY$
DECLARE

	cursorSolicitudes CURSOR FOR
	SELECT idSolicitud,carne,tramite,fechaSolicitud,estado,sede FROM solicitudes WHERE notificado=FALSE AND carne LIKE v_carnet
	ORDER BY fechaSolicitud ASC;
BEGIN
	OPEN cursorSolicitudes;
	UPDATE solicitudes SET notificado=TRUE WHERE estado=true and carne=v_carnet;
	RETURN query FETCH ALL FROM cursorSolicitudes;

END;
$BODY$
LANGUAGE plpgsql;

--===============================================================
--AUTHOR: Andrey Murillo
--CREATE DATE: 
--DESCRIPTION: Elimina una solictud de la tabla solicitudes (por id de solicitud)
--   : TRUE si el proceso fue exitoso, de lo contrario levanta una excepción.
--===============================================================

CREATE OR REPLACE FUNCTION sp_eliminarSolicitud
(
    IN v_idSolicitud INT
)
RETURNS BOOLEAN AS
$BODY$
BEGIN
	DELETE FROM solicitudes WHERE idSolicitud = v_idSolicitud;
	RETURN TRUE;
END;
$BODY$
LANGUAGE plpgsql;


--===============================================================
--AUTHOR: Andrey Murillo
--CREATE DATE: 
--DESCRIPTION: Actualiza el estado y fecha de impresión de una solictud (por id de solicitud)
--   : TRUE si el proceso fue exitoso, de lo contrario levanta una excepción.
--===============================================================

CREATE OR REPLACE FUNCTION sp_actualizarEstado
(
    IN v_idSolicitud INT
) RETURNS BOOLEAN AS
$BODY$
BEGIN
    UPDATE solicitudes SET estado = TRUE, fechaImpresion = CURRENT_TIMESTAMP WHERE idSolicitud = v_idSolicitud;
	RETURN TRUE;
	
END;
$BODY$
LANGUAGE plpgsql;



--- ===========================================================
--- INFORMES
--- ===========================================================


--===============================================================
--AUTHOR: Andrey Murillo
--CREATE DATE: 
--DESCRIPTION: Registra un nuevo informe en la tabla informes, (recibe los datos que posee un informe)
--   : TRUE si el proceso fue exitoso, de lo contrario levanta una excepción.
--===============================================================

CREATE OR REPLACE FUNCTION sp_crearInforme
(
    IN v_funcionarioID t_cedula,
    IN v_area t_area,
    IN v_actividad VARCHAR(400),
    IN v_fechaInicio DATE,
    IN v_fechaFinal DATE,
    IN v_objetivo VARCHAR(400),
    IN v_programa VARCHAR(400),
    IN v_cantEstudiantes INT,
    IN v_sede t_sede
) RETURNS BOOLEAN AS
$BODY$
DECLARE
    p_fechaInicio TIMESTAMP;

BEGIN
    p_fechaInicio= v_fechaInicio+(SELECT CURRENT_TIME);
    INSERT INTO informes (funcionarioID,area,actividad,fechaInicio,fechaFinal,objetivo,programa,cantEstudiantes,sede)
    VALUES (v_funcionarioID,v_area,v_actividad,p_fechaInicio,v_fechaFinal,v_objetivo,v_programa,v_cantEstudiantes,v_sede);
    RETURN TRUE;
END;
$BODY$
  LANGUAGE plpgsql;


--===============================================================
--AUTHOR: Andrey Murillo
--CREATE DATE: 
--DESCRIPTION: Obtiene los informes que ha realizado un funcionario (por medio del id del funcionario)
--   : Retorna un conjunto de registros de la tabla informes, de lo contrario levanta una excepción.
--===============================================================

CREATE OR REPLACE FUNCTION sp_obtenerInformes_funcionario
(
    IN ve_funcionarioID t_cedula,
    OUT v_idInforme INT,
    OUT v_funcionarioID t_cedula,
    OUT v_area t_area,
    OUT v_actividad VARCHAR(400),
    OUT v_fechaInicio TIMESTAMP,
    OUT v_fechaFinal DATE,
    OUT v_objetivo VARCHAR(400),
    OUT v_programa VARCHAR(400),
    OUT v_cantEstudiantes INT,
    OUT v_sede t_sede
    
) RETURNS SETOF record AS
$BODY$
BEGIN
	RETURN query SELECT id,funcionarioId,area,actividad,fechaInicio,fechaFinal,objetivo,programa,cantEstudiantes,sede
	 FROM informes WHERE funcionarioID = ve_funcionarioID ORDER BY fechaInicio DESC;
END;
$BODY$
  LANGUAGE plpgsql;


--===============================================================
--AUTHOR: Andrey Murillo
--CREATE DATE: 
--DESCRIPTION: obtiene los informes donde su fecha de inicio este entre el rango de fechas y que pertenezcan a la sede especificada
--   : Retorna un conjunto de registros de la tabla informe, de lo contrario levanta una excepción.
--===============================================================

CREATE OR REPLACE FUNCTION sp_obtenerinformesfechas
(
	IN fecha_uno date, 
	IN fecha_dos date, 
	IN v_sede t_sede,
	OUT v_idinforme INT, 
	OUT v_funcionarioid t_cedula, 
	OUT v_area t_area, 
	OUT v_actividad varchar(400), 
	OUT v_fechaInicio TIMESTAMP,
	OUT v_fechaFinal date, 
	OUT v_objetivo varchar(400), 
	OUT v_programa varchar(400), 
	OUT v_cantestudiantes INT
)
  RETURNS SETOF record AS
$BODY$

BEGIN

  RETURN query SELECT id,funcionarioId,area,actividad,fechaInicio,fechaFinal,objetivo,programa,cantEstudiantes
   FROM informes WHERE (fechaInicio::DATE BETWEEN fecha_uno AND fecha_dos) AND sede LIKE v_sede
   ORDER BY fechaInicio DESC;
END;
$BODY$
  LANGUAGE plpgsql;


--===============================================================
--AUTHOR: Andrey Murillo
--CREATE DATE: 
--DESCRIPTION: Obtiene los informes que corresponden al área y la sede especificada por parámetro
--   : Retorna un cnjunto de registros de la tabla informes, de lo contrario levanta una excepción.
--===============================================================

CREATE OR REPLACE FUNCTION sp_obtenerInformes_area
(
    IN ve_area VARCHAR(3),
    IN ve_sede VARCHAR(2),
    OUT v_idInforme INT,
    OUT v_funcionarioID t_cedula,
    OUT v_area t_area,
    OUT v_actividad VARCHAR(400),
    OUT v_fechaInicio TIMESTAMP,
    OUT v_fechaFinal DATE,
    OUT v_objetivo VARCHAR(400),
    OUT v_programa VARCHAR(400),
    OUT v_cantEstudiantes INT  
) RETURNS SETOF record AS
$BODY$

BEGIN
	
	RETURN query SELECT id,funcionarioId,area,actividad,fechaInicio,fechaFinal,objetivo,programa,cantEstudiantes 
	FROM informes WHERE area = ve_area AND sede LIKE ve_sede
	ORDER BY fechaInicio DESC;
        
END;
$BODY$
LANGUAGE plpgsql;



--===============================================================
--AUTHOR: Andrey Murillo
--CREATE DATE: 
--DESCRIPTION: Obtiene todos los datos del informe que posee el id especificada por parámetro
--   : Retorna un registro de la tabla informes, de lo contrario levanta una excepción.
--===============================================================

CREATE OR REPLACE FUNCTION sp_obtenerInforme_porId
(
	IN ve_idinforme INTEGER, 
	OUT v_idInforme INT,
	OUT v_funcionarioID t_cedula,
	OUT v_area t_area,
	OUT v_actividad VARCHAR(400),
	OUT v_fechaInicio TIMESTAMP,
	OUT v_fechaFinal DATE,
	OUT v_objetivo VARCHAR(400),
	OUT v_programa VARCHAR(400),
	OUT v_cantEstudiantes INT  
)
 RETURNS SETOF record AS
$BODY$
BEGIN
	RETURN query SELECT id,funcionarioId,area,actividad,fechaInicio,fechaFinal,objetivo,programa,cantEstudiantes 
	FROM informes WHERE id = ve_idInforme;
END;
$BODY$
LANGUAGE plpgsql;

--===============================================================
--AUTHOR: Andrey Murillo
--CREATE DATE: 
--DESCRIPTION: Obtiene todos los registros de la tabla informes
--   : Un conjunto de registros de la tabla informes, de lo contrario levanta una excepción.
--===============================================================

CREATE OR REPLACE FUNCTION sp_obtenerInformes
(
	IN ve_sede t_sede,
	OUT v_idInforme INT,
	OUT v_funcionarioID t_cedula,
	OUT v_area VARCHAR(3),
	OUT v_actividad VARCHAR(400),
	OUT v_fechaInicio TIMESTAMP,
	OUT v_fechaFinal DATE,
	OUT v_objetivo VARCHAR(400),
	OUT v_programa VARCHAR(400),
	OUT v_cantEstudiantes INT,
	OUT v_sede t_sede  
    
) RETURNS SETOF record AS
$BODY$
BEGIN
	RETURN query SELECT * FROM informes WHERE sede LIKE v_sede
	ORDER BY fechaInicio DESC;
END;
$BODY$
LANGUAGE plpgsql;


--===============================================================
--AUTHOR: Andrey Murillo
--CREATE DATE: 
--DESCRIPTION: Modifica los datos del informe que posee el id especificado
--   : TRUE si el proceso fue exitoso, de lo contrario levanta una excepción.
--===============================================================

CREATE OR REPLACE FUNCTION sp_modificarInforme
(
    IN v_idInforme INT,
    IN v_area t_area,
    IN v_actividad VARCHAR(400),
    IN v_fechaInicio DATE,
    IN v_fechaFinal DATE,
    IN v_objetivo VARCHAR(400),
    IN v_programa VARCHAR(400),
    IN v_cantEstudiantes INT,
    IN v_sede t_sede
) RETURNS BOOLEAN AS
$BODY$
DECLARE 
    p_fechaInicio TIMESTAMP;

BEGIN
	p_fechaInicio = v_fechaInicio+(SELECT CURRENT_TIME);
	UPDATE informes SET(area,actividad,fechaInicio,fechaFinal,objetivo,programa,cantEstudiantes,sede) = 
			   (v_area,v_actividad,p_fechaInicio,v_fechaFinal,v_objetivo,v_programa,v_cantEstudiantes, v_sede) 
			   WHERE id = v_idInforme;	
	RETURN TRUE; 
	
END;
$BODY$
LANGUAGE plpgsql;

--===============================================================
--AUTHOR: Andrey Murillo
--CREATE DATE: 
--DESCRIPTION: Genera un nuevo registro en la tabla imagenes, asocia la dirección de una imagen al informe que posee el id recibido por parámetro
--   : TRUE si el proceso fue exitoso, de lo contrario levanta una excepción.
--===============================================================
CREATE OR REPLACE FUNCTION sp_crearImagen(IN v_idInforme INT,IN v_nombre VARCHAR)
RETURNS BOOLEAN AS
$BODY$
BEGIN
	INSERT INTO imagenes(placa, id_informe) VALUES (v_nombre,v_idInforme);
	RETURN TRUE;
	
END;
$BODY$
LANGUAGE plpgsql;


--===============================================================
--AUTHOR: Andrey Murillo
--CREATE DATE: 
--DESCRIPTION: Obtiene la dirección de las imágenes que se asocian al informe que posee el id recibido por parámetro
--   : Retorna un conjunto de registro de la tabla imágenes, de lo contrario levanta una excepción.
--===============================================================

CREATE OR REPLACE FUNCTION sp_obtenerImagenes_informe(IN v_idInforme INT,OUT v_nombre VARCHAR(12))
RETURNS SETOF VARCHAR(12) AS
$BODY$
BEGIN
	RETURN query SELECT placa FROM imagenes WHERE id_Informe = v_idInforme;	
END;
$BODY$
LANGUAGE plpgsql;


--===============================================================
--AUTHOR: Andrey Murillo
--CREATE DATE: 
--DESCRIPTION: Ontiene las imágenes de los informes que pertenecen al área especificada por parámetro y registrados en una sede en específico
--   : Retorna un conjunto de registro de la tabla imágenes , de lo contrario levanta una excepción.
--===============================================================

CREATE OR REPLACE FUNCTION sp_obtenerImagenes_area(IN v_area t_area,IN v_sede t_sede,OUT v_nombre VARCHAR(12)) 
RETURNS SETOF VARCHAR(12) AS
$BODY$
BEGIN
	RETURN query SELECT imagenes.placa FROM 
			imagenes INNER JOIN informes 
			ON imagenes.idInforme = informes.idInforme
			WHERE area = v_area AND informes.sede LIKE v_sede;
	EXCEPTION WHEN OTHERS THEN
	RAISE EXCEPTION 'Error en la consulta';
END;
$BODY$
LANGUAGE plpgsql;


--===============================================================
--AUTHOR: Andrey Murillo
--CREATE DATE: 
--DESCRIPTION: Elimina la imagen que posee el nombre especificado por parámetro y se asocia con el id de informe especificado 
--   : TRUE si el proceso fue exitoso, de lo contrario levanta una excepción.
--===============================================================

CREATE OR REPLACE FUNCTION sp_eliminarimagen(IN v_idinforme integer,IN v_nombre character varying)
RETURNS boolean AS
$BODY$

BEGIN
	DELETE FROM imagenes WHERE  placa= v_nombre and id_informe= v_idInforme;
	RETURN TRUE;

END;
$BODY$
LANGUAGE plpgsql;
