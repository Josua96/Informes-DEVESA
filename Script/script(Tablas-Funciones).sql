--dominio de cedula para el identificador
CREATE DOMAIN cedulas CHAR(11) NOT NULL CONSTRAINT CHK_cedulas CHECK
(VALUE SIMILAR TO '[1-9]-[0-9][0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]');

--dominio de sedes:
/**
SC-> SAN CARLOS
C -> CARTAGO
L -> LIMON
IA -> INTERUNIVERSITARIA DE ALAJUELA
S -> San Jose
*/



CREATE DOMAIN DOMAIN_SEDE VARCHAR(2) NOT NULL CONSTRAINT CHK_sede CHECK
(VALUE IN('SC','C','L','IA','S'));

-- Solicitudes de cartas 

CREATE TABLE solicitudes
(
    idSolicitud SERIAL NOT NULL PRIMARY KEY,
    fechaSolicitud DATE DEFAULT(CURRENT_DATE),
    carne	VARCHAR(10) CHECK (carne SIMILAR TO ('[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]')) NOT NULL,
    tramite VARCHAR(20) CHECK (tramite IN ('CCSS','pension','regular','visa', 'CCSSResidencia')) NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT FALSE,
    fechaImpresion DATE,
    notificado BOOLEAN DEFAULT (FALSE),
    sede DOMAIN_SEDE  
);


-- Informes de las actividades de las diferentes areas.
CREATE TABLE informes
(
    idInforme SERIAL NOT NULL PRIMARY KEY,
    profesorID cedulas NOT NULL,
    area VARCHAR(3) CHECK (area IN ('DI','SE','AYR','TSR', 'TSB','PS','BI','SOD','SME','SEN','CU','DE')) NOT NULL,
    actividad VARCHAR(100) NULL,
    fechaInicio DATE NOT NULL,
    fechaFinal DATE NOT NULL,
    objetivo VARCHAR(200),
    programa VARCHAR(100),
    cantEstudiantes INT NOT NULL,
    sede DOMAIN_SEDE 
);


-- Esta es la tabla que almacena las direcciones en donde se guardan las imagenes.
CREATE TABLE imagenes
(
    placa VARCHAR(12) PRIMARY KEY NOT NULL,
    idInforme INT NOT NULL,
    CONSTRAINT FK_idInforme_imagenes FOREIGN KEY (idInforme) REFERENCES informes ON UPDATE CASCADE ON DELETE CASCADE
);
/**
--tabla para el almacenamiento de token, y verificacion del usuario
--Tipo de usuario A= administrador , E=estudiante, P=profesor, 
*/

CREATE TABLE autorizacion(
	idUsuario cedulas,
	TipoUsuario char(1),
	token char(32)UNIQUE,
	CONSTRAINT PK_idUsuario_autorizacion PRIMARY KEY(idUsuario)
);

--Estas son las funciones de la base de datos se dividen en :

--Seccion para seguridad:

--eliminar token de la tabla de autorizacion;
CREATE OR REPLACE FUNCTION sp_eliminarToken
(
	
	IN codigo CHAR(32)  --el token de acceso
)
RETURNS VOID AS
$BODY$
BEGIN 
	DELETE FROM autorizacion WHERE codigo LIKE token;
	EXCEPTION WHEN OTHERS THEN
	RAISE EXCEPTION 'Error en la consulta';

END
$BODY$
LANGUAGE plpgsql;

delete from autorizacion;
select * from solicitudes;
select * from autorizacion;
select * from informes;
select sp_eliminarToken('wer33');
select sp_almacenarToken('2-1122-1222','E','wer33');
select sp_tokenValido('2-1122-1222','E','wer33');

--almacenamiento de un token para el usuario
CREATE OR REPLACE FUNCTION sp_almacenarToken
(
	IN id CHAR(11),
	IN tipoU CHAR(1), --tipo de usuario
	IN codigo CHAR(32)  --el token de acceso
)
RETURNS VOID AS
$BODY$
BEGIN 

	IF (SELECT COUNT(*) FROM autorizacion WHERE token SIMILAR TO '%'||codigo||'%')> 0 THEN
		DELETE FROM autorizacion WHERE token SIMILAR TO '%'||codigo||'%';
	END IF;

	INSERT INTO autorizacion VALUES(id,tipoU,codigo);
	EXCEPTION WHEN OTHERS THEN
	RAISE EXCEPTION 'Error en la consulta';

END
$BODY$
LANGUAGE plpgsql;

--validacion de un token para un usuario, junto con el tipo de usuario
CREATE OR REPLACE FUNCTION sp_tokenValido
(
	IN id CHAR(11),
	IN tipoU CHAR(1), --tipo de usuario
	IN codigo CHAR(32)  --el token de acceso
)
RETURNS BOOLEAN AS
$BODY$
BEGIN 
	IF ( SELECT COUNT (idUsuario) FROM autorizacion WHERE idUsuario LIKE id AND 
		TipoUsuario LIKE tipoU AND codigo LIKE token) =0 THEN
		RETURN FALSE;
	ELSE 
	    RETURN TRUE;
	END IF;
	
EXCEPTION WHEN OTHERS THEN
	RAISE EXCEPTION 'Error en la consulta';
END
$BODY$
LANGUAGE plpgsql;


-- Seccion de solicitudes de cartas:
CREATE OR REPLACE FUNCTION sp_crearSolicitud
(
    IN v_carne VARCHAR(10),
    IN v_tramite VARCHAR(50),
    IN v_sede VARCHAR(2)
    
) RETURNS BOOLEAN AS
$BODY$
BEGIN

	/** Definir límite de solicitudes del mismo tipo que puede realizar un estudiante */
	IF ((SELECT COUNT(*) FROM solicitudes WHERE v_carne=carne AND v_tramite=tramite AND v_sede=sede AND estado=true)>4) THEN  
		RAISE EXCEPTION 'limite';
	END IF;
	
	IF ((SELECT COUNT(*) FROM solicitudes WHERE v_carne=carne AND v_tramite=tramite AND v_sede=sede AND estado=FALSE)) THEN
		RAISE EXCEPTION 'registrada';
	END IF; 
	
	INSERT INTO solicitudes (carne,fechaSolicitud,tramite,estado,sede) VALUES (v_carne,CURRENT_DATE,v_tramite,FALSE,v_sede);
	RETURN TRUE;

END;
$BODY$
LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION sp_obtenerSolicitudesNoAtendidas
(
    IN v_sede VARCHAR(2),		
    OUT v_idSolicitud INT,
    OUT v_carne VARCHAR(10),
    OUT v_tramite VARCHAR(50)
   
) RETURNS SETOF record AS
$BODY$
BEGIN
	RETURN query SELECT idSolicitud,carne, tramite FROM solicitudes WHERE estado = FALSE AND sede LIKE v_sede
	ORDER BY fechaSolicitud ASC;
EXCEPTION WHEN OTHERS THEN
	RAISE EXCEPTION 'Error en la consulta';
END;
$BODY$
LANGUAGE plpgsql;




CREATE OR REPLACE FUNCTION sp_obtenerSolicitudesAtendidas
(
    IN v_sede VARCHAR(2),	
    OUT v_idSolicitud INT,
    OUT v_carne VARCHAR(10),
    OUT v_tramite VARCHAR(50)
    
) RETURNS SETOF record AS
$BODY$
DECLARE
	fechaActual DATE;
	
BEGIN
	fechaActual=(SELECT CURRENT_DATE);
	RETURN query SELECT idSolicitud, carne, tramite FROM solicitudes WHERE estado = TRUE AND sede LIKE v_sede AND fechaImpresion=fechaActual
	ORDER BY fechaImpresion DESC;
EXCEPTION WHEN OTHERS THEN
	RAISE EXCEPTION 'Error en la consulta';
END;
$BODY$
LANGUAGE plpgsql;


/** NOTA: Si una solicitud no ha sido impresa, el campo notificado de solicitudes es false */
CREATE OR REPLACE FUNCTION sp_obtenerSolicitudesCarnet
(
    IN v_carnet VARCHAR(10), 
    OUT v_idSolicitud INT,
    OUT v_carne VARCHAR(10),
    OUT v_tramite VARCHAR(50),
    OUT v_fechaSolicitud DATE,
    OUT v_estado BOOLEAN
) RETURNS SETOF RECORD AS
$BODY$
DECLARE

	cursorSolicitudes CURSOR FOR 
	SELECT idSolicitud,carne,tramite,fechaSolicitud,estado FROM solicitudes WHERE notificado=FALSE AND carne LIKE v_carnet
	ORDER BY fechaSolicitud ASC;
BEGIN   
	OPEN cursorSolicitudes;
	UPDATE solicitudes SET notificado=TRUE WHERE estado=true and carne=v_carnet;
	RETURN query FETCH ALL FROM cursorSolicitudes;

END;
$BODY$
LANGUAGE plpgsql;

SELECT idSolicitud,carne,tramite FROM solicitudes WHERE notificado=FALSE AND carne LIKE '2016254066';
select * from sp_obtenerSolicitudesCarnet('2016254066');
select * from solicitudes
DELETE FROM solicitudes

insert into solicitudes(fecha,carne,tramite,estado,fechaImpresion,notificado,sede) values (CURRENT_DATE,'2016254066','CCSS',TRUE,(CURRENT_DATE)+1,FALSE,'SC'),
										      (CURRENT_DATE,'2016254066','pension',TRUE,(CURRENT_DATE)+1,FALSE,'SC');

CREATE OR REPLACE FUNCTION sp_eliminarSolicitud
(
    IN v_idSolicitud INT
) RETURNS BOOLEAN AS
$BODY$
BEGIN
	DELETE FROM solicitudes WHERE idSolicitud = v_idSolicitud;
	RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
	RETURN FALSE;
END;
$BODY$
LANGUAGE plpgsql;

select CURRENT_DATE

CREATE OR REPLACE FUNCTION sp_actualizarEstado
(
    IN v_idSolicitud INT
) RETURNS BOOLEAN AS
$BODY$
BEGIN
    UPDATE solicitudes SET estado=TRUE,fechaImpresion=CURRENT_DATE WHERE idSolicitud = v_idSolicitud;
    RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
	RETURN FALSE;
END;
$BODY$
LANGUAGE plpgsql;


-- Seccion de los informes 
CREATE OR REPLACE FUNCTION sp_crearInforme
(
    IN v_profesorID CHAR(11),
    IN v_area VARCHAR(25),
    IN v_actividad VARCHAR(100),
    IN v_fechaInicio DATE,
    IN v_fechaFinal DATE,
    IN v_objetivo VARCHAR(200),
    IN v_programa VARCHAR(50),
    IN v_cantEstudiantes INT,
    IN v_sede VARCHAR(2)
) RETURNS BOOLEAN AS
$BODY$
BEGIN
    INSERT INTO informes (profesorID,area,actividad,fechaInicio,fechaFinal,objetivo,programa,cantEstudiantes,sede)
    VALUES (v_profesorID,v_area,v_actividad,v_fechaInicio,v_fechaFinal,v_objetivo,v_programa,v_cantEstudiantes,v_sede);
    RETURN TRUE;
END;
$BODY$
LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION sp_obtenerInformes_profesor
(
    IN ve_profesorID CHAR(11),
    IN v_sede VARCHAR(2),
    OUT v_idInforme INT,
    OUT v_profesorID cedulas,
    OUT v_area VARCHAR(3),
    OUT v_actividad VARCHAR(100),
    OUT v_fechaInicio DATE,
    OUT v_fechaFinal DATE,
    OUT v_objetivo VARCHAR(200),
    OUT v_programa VARCHAR(100),
    OUT v_cantEstudiantes INT
    
) RETURNS SETOF record AS
$BODY$
BEGIN
	RETURN query SELECT idInforme,profesorId,area,actividad,fechaInicio,fechaFinal,objetivo,programa,cantEstudiantes
	 FROM informes WHERE profesorID = ve_profesorID AND sede LIKE v_sede;

END;
$BODY$
LANGUAGE plpgsql;

select sp_obtenerInformes_profesor('2-1122-1222','SC')
select * from informes

CREATE OR REPLACE FUNCTION sp_obtenerinformesfechas(
IN fecha_uno date, 
IN fecha_dos date, 
IN v_sede VARCHAR(2),
OUT v_idinforme INTEGER, 
OUT v_profesorid cedulas, 
OUT v_area character varying, 
OUT v_actividad character varying, 
OUT v_fechaInicio date,
OUT v_fechaFinal date, 
OUT v_objetivo character varying, 
OUT v_programa character varying, 
OUT v_cantestudiantes INTEGER

)
  RETURNS SETOF record AS
$BODY$
 
BEGIN

  RETURN query SELECT idInforme,profesorId,area,actividad,fechaInicio,fechaFinal,objetivo,programa,cantEstudiantes
   FROM informes WHERE ((fechaInicio BETWEEN fecha_uno AND fecha_dos)OR
  (fechaFinal BETWEEN fecha_uno AND fecha_dos)) AND sede LIKE v_sede;
  EXCEPTION WHEN OTHERS THEN
	RAISE EXCEPTION 'Error en la consulta';
END;
$BODY$
  LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION sp_obtenerInformes_area
(
    IN ve_area VARCHAR(3),
    IN ve_sede VARCHAR(2),
    OUT v_idInforme INT,
    OUT v_profesorID cedulas,
    OUT v_area VARCHAR(3),
    OUT v_actividad VARCHAR(100),
    OUT v_fechaInicio DATE,
    OUT v_fechaFinal DATE,
    OUT v_objetivo VARCHAR(200),
    OUT v_programa VARCHAR(50),
    OUT v_cantEstudiantes INT  
) RETURNS SETOF record AS
$BODY$

BEGIN
	
	RETURN query SELECT idInforme,profesorId,area,actividad,fechaInicio,fechaFinal,objetivo,programa,cantEstudiantes 
	FROM informes WHERE area = ve_area AND sede LIKE ve_sede;
        
END;
$BODY$
LANGUAGE plpgsql;




CREATE OR REPLACE FUNCTION sp_obtenerInforme_porId(
IN ve_idinforme INTEGER, 
OUT v_idinforme INTEGER, 
OUT v_profesorid cedulas, 
OUT v_area character varying, 
OUT v_actividad character varying, 
OUT v_fechaInicio DATE,
OUT v_fechaFinal DATE, 
OUT v_objetivo character varying, 
OUT v_programa character varying, 
OUT v_cantestudiantes INTEGER)
  RETURNS SETOF record AS
$BODY$
BEGIN
	RETURN query SELECT idInforme,profesorId,area,actividad,fechaInicio,fechaFinal,objetivo,programa,cantEstudiantes 
	FROM informes WHERE idInforme = ve_idInforme;
EXCEPTION WHEN OTHERS THEN
	RAISE EXCEPTION 'Error en la consulta';
END;
$BODY$
LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION sp_obtenerInformes
(
    IN v_sede VARCHAR(2),	
    OUT v_idInforme INT,
    OUT v_profesorID cedulas,
    OUT v_area VARCHAR(3),
    OUT v_actividad VARCHAR(100),
    OUT v_fechaInicio DATE,
    OUT v_fechaFinal DATE,
    OUT v_objetivo VARCHAR(200),
    OUT v_programa VARCHAR(50),
    OUT v_cantEstudiantes INT
    
) RETURNS SETOF record AS
$BODY$
BEGIN
	RETURN query SELECT * FROM informes WHERE sede LIKE v_sede;

END;
$BODY$
LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION sp_modificarInforme
(
    IN v_idInforme INT,
    IN v_area VARCHAR(3),
    IN v_actividad VARCHAR(100),
    IN v_fechaInicio DATE,
    IN v_fechaFinal DATE,
    IN v_objetivo VARCHAR(200),
    IN v_programa VARCHAR(50),
    IN v_cantEstudiantes INT
) RETURNS BOOLEAN AS
$BODY$
BEGIN
	UPDATE informes SET
    (area,actividad,fechaInicio,fechaFinal,objetivo,programa,cantEstudiantes) = 
    (v_area,v_actividad,v_fechaInicio,v_fechaFinal,v_objetivo,v_programa,v_cantEstudiantes) WHERE idInforme = v_idInforme;
    COMMIT;
    RETURN TRUE;
    
EXCEPTION WHEN OTHERS THEN
	RETURN FALSE;
END;
$BODY$
LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION sp_crearImagen
(
    IN v_idInforme INT,
    IN v_nombre VARCHAR(12)
) RETURNS BOOLEAN AS
$BODY$
BEGIN
	INSERT INTO imagenes VALUES (v_nombre,v_idInforme);
    RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
	RETURN FALSE;
END;
$BODY$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_obtenerImagenes_informe
(
    IN v_idInforme INT,
    OUT v_nombre VARCHAR(12)
) RETURNS SETOF VARCHAR(12) AS
$BODY$
BEGIN
	RETURN query SELECT placa FROM imagenes WHERE idInforme = v_idInforme;
EXCEPTION WHEN OTHERS THEN
	RAISE EXCEPTION 'Error en la consulta';
END;
$BODY$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_obtenerImagenes_area
(
    IN v_area VARCHAR(3),
    IN v_sede VARCHAR(2),
    OUT v_nombre VARCHAR(12)
    
) RETURNS SETOF VARCHAR(12) AS
$BODY$
BEGIN
	RETURN query SELECT imagenes.placa FROM imagenes INNER JOIN informes ON (imagenes.idInforme = informes.idInforme) WHERE area = v_area AND 
	informes.sede LIKE v_sede;
EXCEPTION WHEN OTHERS THEN
	RAISE EXCEPTION 'Error en la consulta';
END;
$BODY$
LANGUAGE plpgsql;




CREATE OR REPLACE FUNCTION sp_eliminarimagen
(
IN v_idinforme integer,
IN v_nombre character varying
)
  RETURNS boolean AS
$BODY$

BEGIN
	DELETE FROM imagenes WHERE  placa= v_nombre and idinforme= v_idInforme;
	RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
	RETURN FALSE;
END;
$BODY$
  LANGUAGE plpgsql;
