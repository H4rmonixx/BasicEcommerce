<?php

namespace App\Controllers;

require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/LayoutEngine.php';
require_once __DIR__ . '/../Models/Product.php';
require_once __DIR__ . '/../Models/Cart_Entry.php';
use App\Core\Request;
use App\Core\LayoutEngine;
use App\Models\Product;
use App\Models\Cart_Entry;


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

        $cart = null;
        if(isset($_SESSION['user'])){
            $cart = Cart_Entry::getCart($_SESSION['user']['user_id']);
        } else {
            if(!isset($_SESSION["cart"])) $_SESSION["cart"] = [];
            $cart = &$_SESSION['cart'];
        }

        $size = 0;
        for($i=0; $i<count($cart); $i++){
            $size += $cart[$i]['quantity'];
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

        $cart = null;
        if(isset($_SESSION['user'])){
            $cart = Cart_Entry::getCart($_SESSION['user']['user_id']);
        } else {
            if(!isset($_SESSION["cart"])) $_SESSION["cart"] = [];
            $cart = &$_SESSION['cart'];
        }
        $add = true;
        for($i=0; $i<count($cart); $i++){
            if($product['product_variant_id'] == $cart[$i]['product_variant_id']){
                if(!Product::ifQuantityInStock($cart[$i]['product_variant_id'], $cart[$i]['quantity'] + 1)){
                    echo json_encode([false]);
                    return true;
                }
                if(isset($_SESSION['user'])){
                    Cart_Entry::changeCart($cart[$i]['cart_entry_id'], $cart[$i]['quantity'] + 1);
                } else {
                    $cart[$i]['quantity'] += 1;
                }
                $add = false;
                break;
            }
        }
        if($add){
            if(isset($_SESSION['user'])){
                if(Cart_Entry::addToCart($_SESSION['user']['user_id'], $product) <= 0){
                    echo json_encode([false]);
                    return true;
                }
            } else {
                array_push($cart, $product);
            }
        }

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

        if(isset($_SESSION['user'])){
            $cart = Cart_Entry::getCart($_SESSION['user']['user_id']);
            Cart_Entry::deleteFromCart($cart[$index]['cart_entry_id']);
            echo json_encode([true]);
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

        $cart = null;
        if(isset($_SESSION['user'])){
            $cart = Cart_Entry::getCart($_SESSION['user']['user_id']);
        } else {
            if(!isset($_SESSION["cart"])) $_SESSION["cart"] = [];
            $cart = &$_SESSION["cart"];
        }

        if(isset($cart[$index])){

            $newQuantity = $cart[$index]['quantity'] + $data['velocity'];
            if(!Product::ifQuantityInStock($cart[$index]['product_variant_id'], $newQuantity)){
                echo json_encode([false]);
                return true;
            }

            if(isset($_SESSION['user'])){
                Cart_Entry::changeCart($cart[$index]['cart_entry_id'], $newQuantity);
            } else {
                $cart[$index]['quantity'] = $newQuantity;
            }
            
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

        if(isset($_SESSION['user'])){
            $cart = Cart_Entry::getCart($_SESSION['user']['user_id']);
            echo json_encode($cart);
            return true;
        }

        if(!isset($_SESSION["cart"])) $_SESSION["cart"] = [];
        echo json_encode($_SESSION["cart"]);

        return true;
    }

    public function getCart(Request $request){
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        if(isset($_SESSION['user'])){
            $cart = Cart_Entry::getCart($_SESSION['user']['user_id']);
            return $cart;
        }

        if(!isset($_SESSION["cart"])) $_SESSION["cart"] = [];
        return $_SESSION["cart"];

    }

}