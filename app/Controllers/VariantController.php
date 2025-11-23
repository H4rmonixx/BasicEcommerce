<?php

namespace App\Controllers;

require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Models/Variant.php';
use App\Core\Request;
use App\Models\Variant;

class VariantController {

    public function loadAllVariants(Request $request){

        $variants = Variant::getAllVariants();
        echo json_encode($variants);

        return true;
    }

}