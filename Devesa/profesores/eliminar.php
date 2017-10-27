<?php
    $variable = $_GET['archivo'];
    if(variable!= '')
    {
        unlink("files/".$variable);
    }
    else
    {
        echo "ERROR";
    }
?>