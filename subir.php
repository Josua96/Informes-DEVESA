<?php
    $ruta = 'files/';
    $respuesta="";              
    $nombre  = "";
    foreach ($_FILES as $key)
    {
        if($key['error'] == UPLOAD_ERR_OK )
        {
            $nombre  = gettimeofday(true).".".pathinfo($key['name'], PATHINFO_EXTENSION );
            $rutaOrigen = $key['tmp_name'];
            $rutaDestino = $ruta.$nombre;
            move_uploaded_file($rutaOrigen, $rutaDestino);
        }
        if ($key['error']=='')
        {
            $respuesta .= $nombre.",";
        }
        if ($key['error']!='')
        {
            $respuesta = "ERROR";
        }
    }
    echo $respuesta;   
?>
