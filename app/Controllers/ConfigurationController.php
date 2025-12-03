<?php

namespace App\Controllers;

require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Models/Configuration.php';
use App\Core\Request;
use App\Models\Configuration;
use finfo;


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

    public function loadConfigurationList(Request $request){
        $conf = Configuration::getConfigurationList();

        echo json_encode($conf);
        return true;
    }

    public function updateConfigurationValue(Request $request){
        $id = $request->param("configid");
        if($id == null){
            echo null;
            return true;
        }
        $data = $request->json();
        if($data == null){
            echo null;
            return true;
        }

        $conf = Configuration::updateValue($id, $data['value']);
        if($conf == null){
            echo null;
            return true;
        }
        
        echo json_encode($conf);
        return true;
    }

    public function updateBanner(Request $request){
        $file = $request->file("banner-file");
        if($file == null || $file['error'] !== UPLOAD_ERR_OK){
            echo null;
            return true;
        }
        $filename = $request->post("banner-name");
        if($filename == null){
            echo null;
            return true;
        }

        $allowedMime = ['image/png'];
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->file($file['tmp_name']);
        if (!in_array($mimeType, $allowedMime)) {
            echo json_encode([false, "PNG only allowed"]);
            return true;
        }

        $uploadDir = __DIR__ . '/../../public/assets/graphics/';
        $extensionsMap = ['image/png'  => 'png'];
        $extension = $extensionsMap[$mimeType];

        if(move_uploaded_file($file['tmp_name'], $uploadDir . $filename . "." . $extension)){
            echo json_encode([true]);
        } else {
            echo null;
        }

        return true;
    }

}