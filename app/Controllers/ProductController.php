<?php

namespace App\Controllers;

require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/LayoutEngine.php';
use App\Core\Request;
use App\Core\LayoutEngine;

class ProductController {
    public function showProductsList(Request $request) {

        $view = file_get_contents(__DIR__ . '/../Views/products.html');
        echo LayoutEngine::resolveLayout($view);

        return true;
    }

    public function test(Request $request) {
        echo $request->param('id');

        return true;
    }

    public function loadProductsList(Request $request){
        require_once __DIR__ . '/../Core/db.php';

        $filters = $request->json();
        if($filters == null){
            echo json_encode($data_from_db_example);
            exit();
        }

        $returned_products = [];
        for($i=0; $i<count($data_from_db_example); $i++){
            $product = $data_from_db_example[$i];

            if(count($filters["omit_ids"])>0){
                if(in_array($product["id"], $filters["omit_ids"])) continue;
            }

            if(count($filters["categories"])>0){
                if(!in_array($product["category"], $filters["categories"])) continue;
            }

            if(count($filters["sizes"]) > 0){
                $add_prod = false;
                foreach($product["sizes_available"] as $size_available){
                    if(in_array($size_available, $filters["sizes"])){
                        $add_prod=true;
                        break;
                    }
                }
                if(!$add_prod) continue;
            }

            if($filters["price_from"] != null){
                if($product["price"] < $filters["price_from"]) continue;
            }
            if($filters["price_to"] != null){
                if($product["price"] > $filters["price_to"]) continue;
            }

            $needed_data = [
                "name" => $product["name"],
                "price" => $product["price"],
                "photos" => $product["photos"],
                "id" => $product["id"]
            ];

            array_push($returned_products, $needed_data);
        }

        echo json_encode($returned_products);
        
        return true;
    }
}