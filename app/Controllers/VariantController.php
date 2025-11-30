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

    public function addVariant(Request $request){
        $data = $request->json();
        if($data == null){
            echo null;
            return true;
        }

        $varid = Variant::createVariant($data);
        echo json_encode([true, $varid]);
        return true;
    }

    public function editVariant(Request $request){
        $data = $request->json();
        if($data == null){
            echo null;
            return true;
        }

        $id = $request->param("id");
        if($id == null){
            echo null;
            return true;
        }

        $result = Variant::editVariant($id, $data);
        echo json_encode([$result]);
        return true;
    }

    public function deleteVariant(Request $request){
        $id = $request->param("id");
        if($id == null){
            echo null;
            return true;
        }

        if(Variant::getProductsCountInVariant($id) > 0){
            echo json_encode([false, "Variant is used by product(s)"]);
            return true;
        }

        $result = Variant::deleteVariant($id);
        echo json_encode([$result]);
        return true;
    }

}