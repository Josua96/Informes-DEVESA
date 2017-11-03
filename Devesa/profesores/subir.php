<?php
    $ruta = './files/';           //Ruta en donde almacenaremos los archivos
    $mensage="";                  //esultado de las operaciones.
    foreach ($_FILES as $key)
    {
        if($key['error'] == UPLOAD_ERR_OK ) //Si el archivo se paso correctamente Continuamos
        {
            $NombreOriginal1 = gettimeofday(true).$key['name'];//Obtenemos el nombre original del archivo
            $NombreOriginal  = gettimeofday(true).".".pathinfo($key['name'], PATHINFO_EXTENSION );
            $temporal = $key['tmp_name']; //Obtenemos la ruta Original del archivo
            $Destino = $ruta.$NombreOriginal;	//Creamos una ruta de destino con la variable ruta y el nombre original del archivo
            move_uploaded_file($temporal, $Destino); //Movemos el archivo temporal a la ruta especificada
        }
        if ($key['error']=='') //Si no existio ningun error, retornamos un mensaje por cada archivo subido
        {
            $mensage .=$NombreOriginal.",";
        }
        if ($key['error']!='')//Si existio algún error retornamos un el error por cada archivo.
        {
            $mensage = "ERROR";
        }
    }
    echo $mensage;     // Regresamos los mensajes generados al cliente
?>