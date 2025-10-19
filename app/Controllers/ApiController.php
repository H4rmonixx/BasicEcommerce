<?php

namespace App\Controllers;

require_once __DIR__ . '/../Core/Request.php';
use App\Core\Request;


class ApiController {
    public function loadLatestProducts(Request $request): bool {

        require_once __DIR__ . '/../Core/db.php';

        $filters = $request->json();
        if($filters == null){
            echo json_encode($data_from_db_example);
            exit();
        }

        // filters mechanism only for page template
        // when database implemented, filters would work via sql queries
        $returned_products = [];
        for($i=0; $i<count($data_from_db_example); $i++){
            $product = $data_from_db_example[$i];

            if(count($filters["omit_ids"])>0){
                if(in_array($product["id"], $filters["omit_ids"])) continue;
            }

            if(count($filters["categories"])>0){
                if(!in_array($product["category"], $filters["categories"])) continue;
            }

            $filters_size = $filters["size"];
            if($product["category"] == "tps" && count($filters_size["tops"])>0){
                $add_prod = false;
                foreach($product["sizes_available"] as $size_available){
                    if(in_array($size_available, $filters_size["tops"])){
                        $add_prod=true;
                        break;
                    }
                }
                if(!$add_prod) continue;
            }
            if($product["category"] == "pnts" && count($filters_size["pants"])>0){
                $add_prod = false;
                foreach($product["sizes_available"] as $size_available){
                    if(in_array($size_available, $filters_size["pants"])){
                        $add_prod=true;
                        break;
                    }
                }
                if(!$add_prod) continue;
            }
            if($product["category"] == "ftwr" && count($filters_size["footwear"])>0){
                $add_prod = false;
                foreach($product["sizes_available"] as $size_available){
                    if(in_array($size_available, $filters_size["footwear"])){
                        $add_prod=true;
                        break;
                    }
                }
                if(!$add_prod) continue;
            }

            $filters_price = $filters["price"];
            if($filters_price["from"] != "none"){
                if($product["price"] < $filters_price["from"]) continue;
            }
            if($filters_price["to"] != "none"){
                if($product["price"] > $filters_price["to"]) continue;
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
    
    public function loadAllProducts(Request $request) : bool {
        
        
    }

    public function loadCartSize(Request $request) : bool {

        session_start();

        if(!isset($_SESSION["cart"])) $_SESSION["cart"] = [];

        $size = 0;
        for($i=0; $i<count($_SESSION["cart"]); $i++){
            $size += $_SESSION["cart"][$i]->quantity;
        }

        echo $size;

        return true;
    }

}