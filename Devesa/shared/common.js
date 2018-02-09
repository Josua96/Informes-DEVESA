var closeSideBar=function () {
  var $window = $(window);
  console.log($window.width());
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

function datetimeToUrlParameter(date, time) {
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

//funcion para mostrar al usuario de manera bien escrita el tipo de carta solicitada 
function setTextSolicitudes(solicitudes ){
    var size= solicitudes.length;
    for(i=0; i<size;i++){
      if (solicitudes[i]["v_tramite"]==="regular"){
        solicitudes[i]["v_tramite"]="Estudiante Regular";
      }
      else if(solicitudes[i]["v_tramite"]==="pension"){
        solicitudes[i]["v_tramite"]="Pensión";
      }
      else if (solicitudes[i]["v_tramite"]==="visa"){
        solicitudes[i]["v_tramite"]="Visa";
      }
      else if (solicitudes[i]["v_tramite"]==="CCSSResidencia"){
        solicitudes[i]["v_tramite"]="CCSS con Residencia";
      }
    }
    return solicitudes;
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
    var areas = ['DI','SE','AYR','TS','PS','BI','DE','CU','SOD','SME','SEN'];
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

function textoInforme(informe) {
    if (informe==="DI"){
        console.log("asa");
        return "Dirección";
    }
    else if (informe==="SE"){
        return "Secretaría";
    }
    else if (informe==="AYR"){
        return "Admisión y Registro";
    }
    else if (informe==="TS"){
        return "Trabajo Social";
    }
    else if (informe==="PS"){
        return "Psicología";
    }
    else if (informe==="BI"){
        return "Biblioteca";
    }
    else if (informe==="SOD"){
        return "Salud: Odontología";
    }
    else if (informe==="SME"){
        return "Salud: Médico";
    }
    else if (informe==="SEN"){
        return "Salud: Enfermería";
    }
    else if (informe==="CU"){
        return "Culturales";
    }
    else{
        return "Deportivas";
    }
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
function noNulos(listaValores) {
    var limite= listaValores.length;
    var i;
    for (i=0; i <limite;i++){
        if ((listaValores[i]==undefined)||(String(listaValores[i]).length==0)){ //valor nulo encontrado
            return false;
        }
    }
    return true; //no hay valores nulos
}