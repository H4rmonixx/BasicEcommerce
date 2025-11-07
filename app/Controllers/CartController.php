<?php

namespace App\Controllers;

require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/LayoutEngine.php';
use App\Core\Request;
use App\Core\LayoutEngine;


class CartController {
    
    public function showCart(Request $request){

        $view = file_get_contents(__DIR__ . '/../Views/cart.html');
        echo LayoutEngine::resolveLayout($view);

        return true;
    }
    
    public function getSize(Request $request) {

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

        $add = true;
        for($i=0; $i<count($_SESSION['cart']); $i++){
            if($product['product_variant_id'] == $_SESSION['cart'][$i]['product_variant_id']){
                $_SESSION['cart'][$i]['quantity'] += 1;
                $add = false;
                break;
            }
        }
        if($add) array_push($_SESSION["cart"], $product);

        echo "Success";
        return true;
    }

    public function deleteFromCart(Request $request){

        session_start();

        $index = $request->param("index");
        if($index == null){
            echo json_encode(null);
            return true;
        }

        if(!isset($_SESSION["cart"])) $_SESSION["cart"] = [];
        if(isset($_SESSION['cart'][$index])){
            unset($_SESSION['cart'][$index]);
            $_SESSION['cart'] = array_values($_SESSION['cart']);
        }

        echo json_encode([true]);
        return true;
    }

    public function changeCart(Request $request){

        session_start();

        $index = $request->param("index");
        if($index == null){
            echo json_encode(null);
            return true;
        }

        $data = $request->json();
        if($data == null){
            echo json_encode(null);
            return true;
        }

        if(!isset($_SESSION["cart"])) $_SESSION["cart"] = [];
        if(isset($_SESSION['cart'][$index])){
            $_SESSION['cart'][$index]['quantity'] += $data['velocity'];
        }

        echo json_encode([true]);
        return true;
    }

    public function loadCart(Request $request) {
        
        session_start();

        if(!isset($_SESSION["cart"])) $_SESSION["cart"] = [];
        $products_in_cart = $_SESSION["cart"];
        echo json_encode($products_in_cart);

        return true;
    }

}