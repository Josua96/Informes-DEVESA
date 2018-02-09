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


--------------------------------------------------- CARTAS DEVESA  -------------------------------------------------



CREATE TABLE solicitudes
(
    idSolicitud SERIAL NOT NULL PRIMARY KEY,
    fechaSolicitud DATE DEFAULT(CURRENT_DATE),
    carne t_carne,
    tramite t_tramite,
    estado BOOLEAN NOT NULL DEFAULT FALSE,
    fechaImpresion DATE,
    notificado BOOLEAN DEFAULT (FALSE),
    sede DOMAIN_SEDE
);

------------------------------------------------- INFORMES ---------------------------------------------------------

create table informes
(
    id SERIAL NOT NULL PRIMARY KEY,
    profesorID t_cedula,
    area t_area,
    actividad VARCHAR(100) NULL,
    fechaInicio DATE NOT NULL,
    fechaFinal DATE NOT NULL,
    objetivo VARCHAR(200),
    programa VARCHAR(100),
    cantEstudiantes INT NOT NULL,
    sede t_sede
);


create table imagenes
(
    placa VARCHAR PRIMARY KEY NOT NULL,
    id_informe INT NOT NULL,
    CONSTRAINT FK_idInforme_imagenes FOREIGN KEY (id_informe) REFERENCES informes ON UPDATE CASCADE ON DELETE CASCADE
);

------------------------------------------------ SEGURIDAD ---------------------------------------------------------

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
CREATE OR REPLACE FUNCTION sp_tokenValido(IN id t_cedula,IN tipoU CHAR(1),IN codigo CHAR(5))
RETURNS BOOLEAN AS
$BODY$
BEGIN 
	IF (SELECT COUNT (idUsuario) FROM autorizacion WHERE idUsuario LIKE id AND TipoUsuario LIKE tipoU AND token LIKE codigo) =0 THEN
		RETURN FALSE;
	ELSE 
	    RETURN TRUE;
	END IF;	
	EXCEPTION WHEN OTHERS THEN RETURN FALSE;
END
$BODY$
LANGUAGE plpgsql;




CREATE OR REPLACE FUNCTION sp_eliminarToken(IN codigo CHAR(32))
RETURNS VOID AS
$BODY$
BEGIN 
	DELETE FROM autorizacion WHERE codigo LIKE token;	
END
$BODY$
LANGUAGE plpgsql;

-- Almacenamiento del token 
-- Nota: aun no se sabe el tamaño del token, se le puso 5 para las pruebas



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

    	INSERT INTO solicitudes (carne,fechaSolicitud,tramite,estado,sede) VALUES (v_carne,CURRENT_DATE,v_tramite,FALSE,v_sede);
    	RETURN TRUE;
END;
$BODY$
LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION sp_obtenerSolicitudesNoAtendidas
(
    IN v_sede t_sede,		
    OUT v_idSolicitud INT,
    OUT v_carne t_carne,
    OUT v_tramite t_tramite   
) RETURNS SETOF record AS
$BODY$
BEGIN
	RETURN query SELECT id, carne, tramite FROM solicitudes WHERE estado = FALSE AND sede LIKE v_sede
	              ORDER BY fechaSolicitud ASC;
END;
$BODY$
LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION sp_obtenerSolicitudesAtendidas
(
    IN v_sede t_sede,	
    OUT v_idSolicitud INT,
    OUT v_carne t_carne,
    OUT v_tramite t_tramite
)    
RETURNS SETOF record AS
$BODY$
 DECLARE fechaActual DATE;
BEGIN
	RETURN query SELECT id, carne, tramite FROM solicitudes WHERE estado = TRUE AND sede LIKE v_sede AND fechaImpresion = fechaActual;
END
$BODY$
LANGUAGE plpgsql;



/** NOTA: Si una solicitud no ha sido impresa, el campo notificado de solicitudes es false */
CREATE OR REPLACE FUNCTION sp_obtenerSolicitudesCarnet
(
    IN v_carnet t_carne,
    OUT v_idSolicitud INT,
    OUT v_carne t_carne,
    OUT v_tramite t_tramite,
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

CREATE OR REPLACE FUNCTION sp_eliminarSolicitud
(
    IN v_idSolicitud INT
)
RETURNS BOOLEAN AS
$BODY$
BEGIN
	DELETE FROM solicitudes WHERE idSolicitud = v_idSolicitud;
	RETURN TRUE;
	EXCEPTION WHEN OTHERS THEN
	RETURN FALSE;
END;
$BODY$
LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION sp_actualizarEstado
(
    IN v_idSolicitud INT
) RETURNS BOOLEAN AS
$BODY$
BEGIN
    UPDATE solicitudes SET estado = TRUE, fechaImpresion = CURRENT_DATE WHERE idSolicitud = v_idSolicitud;
	RETURN TRUE;
	EXCEPTION WHEN OTHERS THEN	
	RETURN FALSE;
END;
$BODY$
LANGUAGE plpgsql;



--- ===========================================================
--- INFORMES
--- ===========================================================


CREATE OR REPLACE FUNCTION sp_crearInforme
(
    IN v_profesorID t_cedula,
    IN v_area t_area,
    IN v_actividad VARCHAR(100),
    IN v_fechaInicio DATE,
    IN v_fechaFinal DATE,
    IN v_objetivo VARCHAR(200),
    IN v_programa VARCHAR(50),
    IN v_cantEstudiantes INT,
    IN v_sede t_sede
) RETURNS BOOLEAN AS
$BODY$
BEGIN
    INSERT INTO informes (profesorID,area,actividad,fechaInicio,fechaFinal,objetivo,programa,cantEstudiantes,sede)
    VALUES (v_profesorID,v_area,v_actividad,v_fechaInicio,v_fechaFinal,v_objetivo,v_programa,v_cantEstudiantes,v_sede);
    RETURN TRUE;
    EXCEPTION WHEN OTHERS THEN RETURN FALSE;
END;
$BODY$
  LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION sp_obtenerInformes_profesor
(
    IN ve_profesorID t_cedula,
    IN v_sede t_sede,
    OUT v_idInforme INT,
    OUT v_profesorID t_cedula,
    OUT v_area t_area,
    OUT v_actividad VARCHAR(100),
    OUT v_fechaInicio DATE,
    OUT v_fechaFinal DATE,
    OUT v_objetivo VARCHAR(200),
    OUT v_programa VARCHAR(100),
    OUT v_cantEstudiantes INT
    
) RETURNS SETOF record AS
$BODY$
BEGIN
	RETURN query SELECT id,profesorId,area,actividad,fechaInicio,fechaFinal,objetivo,programa,cantEstudiantes
	 FROM informes WHERE profesorID = ve_profesorID AND sede LIKE v_sede;
END;
$BODY$
  LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION sp_obtenerinformesfechas
(
	IN fecha_uno date, 
	IN fecha_dos date, 
	IN v_sede t_sede,
	OUT v_idinforme INT, 
	OUT v_profesorid t_cedula, 
	OUT v_area t_area, 
	OUT v_actividad varchar(100), 
	OUT v_fechaInicio date,
	OUT v_fechaFinal date, 
	OUT v_objetivo varchar(200), 
	OUT v_programa varchar(100), 
	OUT v_cantestudiantes INT
)
  RETURNS SETOF record AS
$BODY$
 
BEGIN

  RETURN query SELECT id,profesorId,area,actividad,fechaInicio,fechaFinal,objetivo,programa,cantEstudiantes
   FROM informes WHERE ((fechaInicio BETWEEN fecha_uno AND fecha_dos) OR (fechaFinal BETWEEN fecha_uno AND fecha_dos)) AND sede LIKE v_sede;
END;
$BODY$
  LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION sp_obtenerInformes_area
(
    IN ve_area VARCHAR(3),
    IN ve_sede VARCHAR(2),
    OUT v_idInforme INT,
    OUT v_profesorID t_cedula,
    OUT v_area t_area,
    OUT v_actividad VARCHAR(100),
    OUT v_fechaInicio DATE,
    OUT v_fechaFinal DATE,
    OUT v_objetivo VARCHAR(200),
    OUT v_programa VARCHAR(50),
    OUT v_cantEstudiantes INT  
) RETURNS SETOF record AS
$BODY$

BEGIN
	
	RETURN query SELECT id,profesorId,area,actividad,fechaInicio,fechaFinal,objetivo,programa,cantEstudiantes 
	FROM informes WHERE area = ve_area AND sede LIKE ve_sede;
        
END;
$BODY$
LANGUAGE plpgsql;




CREATE OR REPLACE FUNCTION sp_obtenerInforme_porId
(
	IN ve_idinforme INTEGER, 
	OUT v_idInforme INT,
	OUT v_profesorID t_cedula,
	OUT v_area VARCHAR(3),
	OUT v_actividad VARCHAR(100),
	OUT v_fechaInicio DATE,
	OUT v_fechaFinal DATE,
	OUT v_objetivo VARCHAR(200),
	OUT v_programa VARCHAR(50),
	OUT v_cantEstudiantes INT  
)
 RETURNS SETOF record AS
$BODY$
BEGIN
	RETURN query SELECT id,profesorId,area,actividad,fechaInicio,fechaFinal,objetivo,programa,cantEstudiantes 
	FROM informes WHERE idInforme = ve_idInforme;
	EXCEPTION WHEN OTHERS THEN RAISE EXCEPTION 'Error en la consulta';
END;
$BODY$
LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION sp_obtenerInformes
(
	IN v_sede t_sede,
	OUT v_idInforme INT,
	OUT v_profesorID t_cedula,
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
    IN v_area t_area,
    IN v_actividad VARCHAR(100),
    IN v_fechaInicio DATE,
    IN v_fechaFinal DATE,
    IN v_objetivo VARCHAR(200),
    IN v_programa VARCHAR(50),
    IN v_cantEstudiantes INT
) RETURNS BOOLEAN AS
$BODY$
BEGIN
	UPDATE informes SET(area,actividad,fechaInicio,fechaFinal,objetivo,programa,cantEstudiantes) = 
			   (v_area,v_actividad,v_fechaInicio,v_fechaFinal,v_objetivo,v_programa,v_cantEstudiantes) 
			   WHERE id = v_idInforme;	
	RETURN TRUE; 
	EXCEPTION WHEN OTHERS THEN RETURN FALSE;
END;
$BODY$
LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION sp_crearImagen(IN v_idInforme INT,IN v_nombre VARCHAR)
RETURNS BOOLEAN AS
$BODY$
BEGIN
	INSERT INTO imagenes(placa, id_informe) VALUES (v_nombre,v_idInforme);
	RETURN TRUE;
	EXCEPTION WHEN OTHERS THEN RETURN FALSE;
END;
$BODY$
LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION sp_obtenerImagenes_informe(IN v_idInforme INT,OUT v_nombre VARCHAR(12))
RETURNS SETOF VARCHAR(12) AS
$BODY$
BEGIN
	RETURN query SELECT placa FROM imagenes WHERE id_Informe = v_idInforme;	
END;
$BODY$
LANGUAGE plpgsql;



  

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




CREATE OR REPLACE FUNCTION sp_eliminarimagen(IN v_idinforme integer,IN v_nombre character varying)
RETURNS boolean AS
$BODY$

BEGIN
	DELETE FROM imagenes WHERE  placa= v_nombre and id_informe= v_idInforme;
	RETURN TRUE;
	EXCEPTION WHEN OTHERS THEN
	RETURN FALSE;
END;
$BODY$
  LANGUAGE plpgsql;
