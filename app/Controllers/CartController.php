<?php

namespace App\Controllers;

require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/LayoutEngine.php';
require_once __DIR__ . '/../Models/Product.php';
use App\Core\Request;
use App\Core\LayoutEngine;
use App\Models\Product;


class CartController {
    
    public function showCart(Request $request){

        $view = file_get_contents(__DIR__ . '/../Views/cart.html');
        echo LayoutEngine::resolveLayout($view);

        return true;
    }
    
    public function getSize(Request $request) {

        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

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
        
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        $product = $request->json();
        if($product == null){
            echo null;
            return true;
        }

        if(!Product::ifQuantityInStock($product['product_variant_id'], 1)){
            echo json_encode([false]);
            return true;
        }

        if(!isset($_SESSION["cart"])) $_SESSION["cart"] = [];

        $add = true;
        for($i=0; $i<count($_SESSION['cart']); $i++){
            if($product['product_variant_id'] == $_SESSION['cart'][$i]['product_variant_id']){
                if(!Product::ifQuantityInStock($_SESSION['cart'][$i]['product_variant_id'], $_SESSION['cart'][$i]['quantity'] + 1)){
                    echo json_encode([false]);
                    return true;
                }
                $_SESSION['cart'][$i]['quantity'] += 1;
                $add = false;
                break;
            }
        }
        if($add) array_push($_SESSION["cart"], $product);

        echo json_encode([true]);
        return true;
    }

    public function deleteFromCart(Request $request){

        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

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

        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

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

            $newQuantity = $_SESSION['cart'][$index]['quantity'] + $data['velocity'];
            if(!Product::ifQuantityInStock($_SESSION['cart'][$index]['product_variant_id'], $newQuantity)){
                echo json_encode([false]);
                return true;
            }

            $_SESSION['cart'][$index]['quantity'] = $newQuantity;
            echo json_encode([true]);
            return true;
        }

        echo json_encode([false]);
        return true;
    }

    public function loadCart(Request $request) {
        
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if(!isset($_SESSION["cart"])) $_SESSION["cart"] = [];
        $products_in_cart = $_SESSION["cart"];
        echo json_encode($products_in_cart);

        return true;
    }

}