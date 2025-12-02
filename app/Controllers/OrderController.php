<?php

namespace App\Controllers;

require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/LayoutEngine.php';
require_once __DIR__ . '/../Core/PayU.php';
require_once __DIR__ . '/../Models/Order.php';
require_once __DIR__ . '/../Models/User.php';
require_once __DIR__ . '/../Models/Product.php';
require_once __DIR__ . '/../Models/Configuration.php';
use App\Core\Request;
use App\Core\LayoutEngine;
use App\Core\PayU;
use App\Models\Order;
use App\Models\User;
use App\Models\Product;
use App\Models\Configuration;

class OrderController {
    public function showSummary(Request $request) {

        $id = $request->param("orderid");
        if($id == null){
            return false;
        }

        if(!Order::ifExists($id)) return false;

        $view = file_get_contents(__DIR__ . '/../Views/summary.html');

        echo LayoutEngine::resolveLayout($view);

        return true;
    }

    public function loadOrder(Request $request){

        $id = $request->param("id");
        if($id == null){
            echo null;
            return true;
        }

        if(!Order::ifExists($id)){
            echo null;
            return true;
        }

        $order = Order::getByID($id);
        if($order == null){
            echo null;
            return true;
        }

        echo json_encode($order);
        return true;
    }

    public function loadOrdersList(Request $request){
        
        $data = $request->json();
        if($data == null){
            echo json_encode([]);
            return true;
        }
        $orders = Order::getOrdersList($data['search']);
        echo json_encode($orders);
        
        return true;
    }

    public function placeOrder(Request $request){
        
        $data = $request->json();
        if($data == null){
            echo null;
            return true;
        }

        //$config = __DIR__ . '../Core/config.php';
        
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if(!isset($_SESSION['cart']) && count($_SESSION['cart']) == 0){
            echo null;
            return true;
        }

        $user_id = $_SESSION['user']['user_id'] ?? null;
        if($user_id == null){
            $user_id = User::createGuest($data);
        }

        $shipping_price = Configuration::getByID("shipping_price");
        if($shipping_price == null) {
            $shipping_price = new Configuration();
            $shipping_price->value = 0.0;
        }

        $order_id = Order::createOrder($user_id, $data, $shipping_price->value);
        $cart_not_available = [];
        foreach ($_SESSION['cart'] as $product) {
            if(!Product::ifQuantityInStock($product['product_variant_id'], $product['quantity'])){
                array_push($cart_not_available, $product);
                continue;
            }
            Order::addProductToOrder($order_id, $product['product_variant_id'], $product['quantity']);
            Product::updateVariantQuantity($product['product_variant_id'], (-1) * $product['quantity']);
        }

        unset($_SESSION['cart']);
        if(count($cart_not_available) > 0) $_SESSION['cart'] = $cart_not_available;

        if($data['payment'] == 'CASH'){
            Order::updateStatus($order_id, "PAID");
            echo json_encode(["payment" => 'CASH', 'orderid' => $order_id]);
            return true;
        }

        // Payu payment
        echo json_encode(["payment" => 'PAYU', 'orderid' => $order_id]);
        return true;
    }

    public function editStatus(Request $request){
        $id = $request->param("orderid");
        if($id == null){
            echo null;
            return true;
        }
        $data = $request->json();
        if($data == null){
            echo null;
            return true;
        }

        Order::updateStatus($id, $data['status']);

        echo json_encode([true]);
        return true;
    }
    
}