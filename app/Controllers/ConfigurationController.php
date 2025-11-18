<?php

namespace App\Controllers;

require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/LayoutEngine.php';
require_once __DIR__ . '/../Models/Configuration.php';
use App\Core\Request;
use App\Core\LayoutEngine;
use App\Models\Configuration;


class ConfigurationController {
    
    public function loadProperty(Request $request){

        $id = $request->param("id");
        if($id == null){
            echo null;
            return true;
        }

        $conf = Configuration::getByID($id);
        if($conf == null){
            echo null;
            return true;
        }

        echo json_encode($conf);
        return true;
    }

}