var closeSideBar=function () {
  var $window = $(window);
  if($window.width()<=1000){
    var $body = $('body');
    var $overlay = $('.overlay');
    $body.toggleClass('overlay-open');
    if ($body.hasClass('overlay-open')) { $overlay.fadeIn(); } else { $overlay.fadeOut(); }
  }};
// ===== CONSTANTES ========================================

/**
 * Meses del calendario gregoriano en español.
 * @type {string[]} Meses.
 */
const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
/**
 * URL raíz de la base de datos.
 * @type {string}
 */
const FIREBASE_PATH = "https://sideappprueba.firebaseio.com";
/**
 * Clave de encriptación.
 * @type {string}
 */
const ENCRYPTION_KEY = "AB82A2D2-B032-41A7-A87F-0AFBD55E4339";
/**
 * Última actualización local de mensajes.
 * @type {string} Identificador de elemento de almacenamiento local.
 */
const LS_LOCAL_LAST_UPDATE = "messages.localLastUpdate";
/**
 * Mensajes almacenados localmente.
 * @type {string} Identificador de elemento de almacenamiento local.
 */
const LS_LOCAL_MESSAGES = "messages.all";

/**
 * Recordar sesión.
 * @type {string} Determina si se debe recordar la sesión.
 */
const LS_REMEMBER_SESSION = "rememberSession";



const AREAS = ["Dirección", "Secretaría", "Admisión y Registro", "Trabajo Social residencias", "Trabajo Social Becas", "Psicología",
                "Biblioteca", "Deportivas", "Culturales", "Salud: Odontología", "Salud: Médico", "Salud: Enfermería"];


const CODIGOS_AREAS = ['DI','SE','AYR','TSR','TSB','PS','BI','DE','CU','SOD','SME','SEN'];

const IMAGES_STORAGE_DIRECTION= "http://localhost:8080/DEVESA/files/";

// =========================================================

/**
 * Dirección raíz del API.
 * @type {string}
 */
const API_ROOT = "http://localhost";//"http://transportec-api.azurewebsites.net";

/**
 * CONSTANTE DE SEDES EN EL SISTEMA
 */

const sedes=[
    {nombre:"Sede Regional San Carlos",abreviatura:"SC"},
    {nombre:"Sede Central Cartago",abreviatura:"SCC"},
    {nombre:"Centro académico de Limón",abreviatura:"CAL"},
    {nombre:"Centro académico de Alajuela",abreviatura:"CAA"},
    {nombre:"Centro acádemico de San José",abreviatura:"CAS"}
];

/**
 * CONSTANTE DE tpos de solicitudes en el sistema
 */

const solicitudesDisponibles= [
    {nombre: "Carnet de la CCSS", abreviatura:"CCSS"},
    {nombre: "Estudiante Regular", abreviatura: "regular"},
    {nombre: "Trámite de Visa", abreviatura: "visa"},
    {nombre:"Trámite de Pensión",abreviatura: "pension"},
    {nombre:"CCSS con Residencia",abreviatura:"CCSSResidencia"}
];

const elementosPorPagina=8;
const maxSize=7;

/**
 * Formatea una cadena de texto en base a los parámetros proporcionados.
 * Tomado de: http://stackoverflow.com/a/4256130/3288599
 * @returns {String} Cadena de texto con formato aplicado.
 */
String.prototype.format = function() {
  var formatted = this;
  for (var i = 0; i < arguments.length; i++) {
    var regexp = new RegExp('\\{' + i + '\\}', 'gi');
    formatted = formatted.replace(regexp, arguments[i]);
  }
  return formatted;
};

/**
 * Aplica formato a una fecha.
 * @param dt Fecha.
 * @returns {String} Fecha con formato aplicado.
 */
function getFormattedDate(dt) {
  return "{0} de {1} de {2}, {3}:{4} {5}".format(
    dt.getDate(), months[dt.getMonth()], dt.getFullYear(),
    dt.getHours() >= 12 ? dt.getHours() - 12 : dt.getHours(), dt.getMinutes(), dt.getHours() >= 12 ? "PM" : "AM"
  );
}

/**
 * Convierte una fecha a formato para enviar solicitud al servidor.
 * @param datetime Objeto de fecha y hora.
 * @returns {String} Fecha formateada.
 */
function dateToUrlParameter(datetime) {
    return "{0}-{1}-{2}-{3}-{4}".format(
        datetime.getFullYear(),
        datetime.getMonth() + 1,
        datetime.getDate(),
        datetime.getHours(),
        datetime.getMinutes());
}

function datetimeToUrlParameter(date, time)
{
    console.log(time);
    return "{0}-{1}".format(date, time.replace(':', '-'));
}

/**
 * Genera una fecha en formato ISO8601 a partir de una fecha y una hora.
 * @param date Fecha.
 * @param time Hora.
 * @returns {String} Fecha y hora fusionada en formato ISO8601.
 */
function datetimeToISO8601(date, time) {
  return "{0}T{1}".format(date, time);
}
function signOut(){
  localStorage.removeItem("session.user");
  localStorage.removeItem("session.token");
  window.location.href = ('../index.html');
}

/*  función que busca un elemento en una lista de diccionarios (JSON)
    array: lista que contiene al elemento a buscar
    abreviatura: identificador del elemento a buscar
    clave: la clave a buscar en la lista de diccionarios
    Retorna el indice donde se encuentra el elmento, -1 si no se encuentra
*/
function searchInArray(array,abreviatura,clave){
    var size= array.length;
    for (i=0;i<size;i++){
        if (array[i][abreviatura]===clave){
            return i;
        }
    }
    return -1
}

/*************************************

 * @param index indice del elemento en la página actual
 * @param itemsPerPage cantidad de elementos que se exhiben por página
 * @param numPage númmero de la página en visualización
 * @returns {INT} indice real del elemento
 */
function getRealIndex(index, itemsPerPage, numPage){
    return (itemsPerPage*(numPage-1))+index;

}

/**
 * Buscar en el arreglo de areas que conoce el sistema, el nombre completo de un area
 *
 * @param {any} codigoArea el parametroe es un string
 * @returns el sistema retorna el nombre del area.
 */
function ubicarDepartamento(codigoArea)
{
    var tam = CODIGOS_AREAS.length;
    for(var i=0 ; i<tam; i++)
    {
        if(CODIGOS_AREAS[i]===  codigoArea)
        {
            return AREAS[i];
        }
    }
}

/**
 * Buscar en el arreglo de solicitudes que conoce el sistema, el nombre completo de una sede
 *
 * @param {codigoSede (String)} abreviatura de la sede
 * @returns el sistema retorna el nombre de la sede.
 */
function getNameSede (codigoSede){
    var tam = sedes.length;
    for(var i=0 ; i<tam; i++)
    {
        if(sedes[i].abreviatura===  codigoSede)
        {
            return sedes[i].nombre;
        }

    }
}

/**
 * Establecer en cada elemento de la lista el nombre correcto de sedes y áreas
 * @param informes (JSON): lista de informes obtenidos
 * Retorna la lista de informes con el nombre completo de las sedes y áreas
 */
function setTextInformes(informes){
    var size= informes.length;
    for (i=0; i< size; i++){
        informes[i].v_sede=getNameSede(informes[i].v_sede);
        informes[i].v_area=ubicarDepartamento(informes[i].v_area);
    }
    return informes;
}


//funcion para mostrar notificaciones al usuario, un uno es error , 2 success, 3 mensaje normal
function mostrarNotificacion(texto,num)
{
  if (num===1) 
  {
    swal({ //
      title: texto,
      type: "error",
      confirmButtonColor: "#EE2049",
      timer: 5000,
      showConfirmButton: false
    });
  }
  else if (num===2)
  {
    swal({ //
      title: texto,
      type: "success",
      confirmButtonColor: "#27F034",
      timer: 2000,
      showConfirmButton: false
    });
  }
 
  else
  {
    swal(texto);
  }

}

/**
 * Función que administra la exhibición al usuario de mensajes de errores
 * @param response: variable que contiene un codigo con el se identifica si el error es de autorización o por alguna validación
 * @param errorMessage: mensaje en caso de que el error fue debido a una validación
 */
function manageErrorResponse(response, errorMessage) {
    if (response.data.message==-1){
        mostrarNotificacion("Ocurrió un error al verificar su código de acceso, usted no posee un código válido",1);

        //esperar 5 segundos para redirigir al usuario a la página de inicio
        setTimeout(function()
            { window.location.href = ('../index.html');
        }, 5000);
        
    }
    else if (response.data.message==0){
        mostrarNotificacion(errorMessage,1);
    }
    else{
        mostrarNotificacion("Ocurrió un error asegurese de tener conexión a internet",1);
    }
}

//funcion para mostrar al usuario de manera bien escrita el tipo de carta solicitada 
function setTextSolicitudes(solicitudes ){
    var size=solicitudesDisponibles.length;
    var SolicitudesSize=solicitudes.length;
    for(i=0; i<SolicitudesSize ;i++){

        for (j=0; j<size;j++){
            if (solicitudes[i]["v_tramite"]===solicitudesDisponibles[j].abreviatura){
                solicitudes[i]["v_tramite"]=solicitudesDisponibles[j].nombre;
                break;
            }

        }

    }
    return solicitudes;
}

/**
 *
 * @param solicitudes: arreglo que contiene las solicitudes a mostrar al usuario
 * @param message: mensaje a exhibir en caso de que el arreglo esté vacío
 * Retorna: un array
 */
function manageSolicitudesSuccessResponse(solicitudes,message) {
    if (solicitudes.length===0)
    {
        mostrarNotificacion(message,3);
        return solicitudes;
    }
    else{
        return setTextSolicitudes(solicitudes);
    }
}



//funcion para almacenar fecha inicio y fecha final del semestre en cookies
function setCookie(fechaInicio, fechaFinal) 
{        
    var expira=new Date (new Date().getTime()+(180*24*60*60*1000)); //cookies expiran seis meses despues aproximadamente
    document.cookie="fecha_inicio="+fechaInicio+"; expires="+expira.toUTCString();
    document.cookie="fecha_final="+fechaFinal+"; expires="+expira.toUTCString();
}


//obtener las fechas dde inicio y final de semestre almacenados en cookies
function readCookie()
{
  var lista=document.cookie;
  if (lista==="")
  { //si no hay cookies retornar la lista vacía
    return lista;
  }
  else
  { //si no retornar la lista con las fechas de inicio y final del semestre.
    lista= lista.split(';');
    lista[0]=lista[0].slice(13,23);
    lista[1]=lista[1].slice(13,23);
    return lista;
  }
}

function setMonth(numero){
  numero=numero-2;
  var meses=["febrero","marzo","abril","mayo","junio","julio","agosto","setiembre","octubre","Noviembre"];
  return meses[numero];
}


function setDia(dia){
  if(dia<10)
  {
    return "0"+dia.toString();
  }
  return dia.toString();
}

function getArea(num) 
{
    var areas =  ['DI','SE','AYR','TSR','TSB','PS','BI','DE','CU','SOD','SME','SEN'];
    return areas[num];
}


function getTextoEspecial(dato, datosEstudiante)
{
    console.log("Dato"+dato);
    if((dato === 0 ) || (dato === "CCSS"))
    {       
      return ["para solicitar carnet ante la C.C.S.S.", ""];
    }
    else if((dato === 4 ) || (dato === "CCSS con Residencia"))
    {         
      return ["para solicitar carnet ante la C.C.S.S.", "Además, actualmente se encuentra viviendo en las Instalaciones de las Residencias del ITCR – San Carlos – Apartado Postal No. 223-21001-Alajuela"];
    }
    else if((dato ===1) || (dato ==="Pensión"))
    {         
      return ["para realizar trámites de pensión", ""];
    }
    else if((dato ===2 )|| (dato ==="visa"))
    {    
      return ["para realizar trámites de Visa, ante la Embajada Americana",""];
    }
    else 
    {
      return "";
    }
}

//funcion que recibe el nombre de ka imagen y retorna su formato "JPG","JPEG"
function retornaFormato(nombreImagen){
    var contador=nombreImagen.length-1;
    var caracter;
    var formato;
    while(nombreImagen[contador]!=".") //recorrer la cadena hasta encontrara un punto
    {
        contador-=1;

    }
    formato=nombreImagen.slice(contador,nombreImagen.length);
    return formato;

}
//function para dar formato a la fecha que recibe por parametro
function revertirCadena(cadena){
    console.log("cadena revertida");
    return cadena.slice(8,10)+"-"+cadena.slice(5,8)+cadena.slice(0,4);
}

function textoInforme(codigoArea)
{
    var numeroAreas =CODIGOS_AREAS.length;
    for(i=0; i<numeroAreas; i++)
    {
        if(codigoArea === CODIGOS_AREAS[i])
        {
            return AREAS[i];
        }
    }
    return "Dirección";
}

//funcion que verifica si el id de un funcionario ya se registró en la lista
function estaEnLista(lista,id) {
    var largo=lista.length;
    var i=0;
    for(i=0;i <largo;i++){
        if (lista[i]["id"]===id){ //si se encuentra en la lista
            return true;
        }
    }
     return false; //no está en lista
}

// para validacion de datos no nulos, retorna false si algun elemento de la lista tiene un valor nulo
function noNulos(listaValores)
{
    console.log(listaValores);
    var limite= listaValores.length;
    var i;
    for (i=0; i <limite;i++)
    {
        if ((listaValores[i]===undefined)||(String(listaValores[i]).length===0)){ //valor nulo encontrado
            return false;
        }
    }
    return true; //no hay valores nulos
}