<?php

namespace App\Controllers;

require_once __DIR__ . '/../Core/Request.php';
use App\Core\Request;


class CartController {
    
    public function getSize(Request $request) : bool {

        session_start();

        if(!isset($_SESSION["cart"])) $_SESSION["cart"] = [];

        $size = 0;
        for($i=0; $i<count($_SESSION["cart"]); $i++){
            $prod = $_SESSION["cart"][$i];
            $size += $prod['quantity'];
        }

        echo $size;

        return true;
    }

    public function addToCart(Request $request) {
        
        session_start();

        $product = $request->json();
        if($product == null){
            echo "Error";
            return true;
        }

        if(!isset($_SESSION["cart"])) $_SESSION["cart"] = [];
        $products_in_cart = $_SESSION["cart"];

        $add = true;
        for($i=0; $i<count($products_in_cart); $i++){
            $x = $products_in_cart[$i];
            if($product['product_variant_id'] == $x['product_variant_id']){
                $x['quantity'] += 1;
                $add = false;
                break;
            }
        }
        if($add) array_push($_SESSION["cart"], $product);

        echo "Success";
        return true;
    }

}