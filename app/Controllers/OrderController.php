<?php

namespace App\Controllers;

require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/LayoutEngine.php';
require_once __DIR__ . '/../Core/PayU.php';
require_once __DIR__ . '/../Models/Order.php';
require_once __DIR__ . '/../Models/User.php';
use App\Core\Request;
use App\Core\LayoutEngine;
use App\Core\PayU;
use App\Models\Order;
use App\Models\User;

class OrderController {
    public function showSummary(Request $request) {

        $id = $request->param("orderid");
        if($id == null){
            return false;
        }

        if(!Order::ifExists($id)) return false;

        $userid = Order::getUserID($id);
        if($userid != null){
            session_start();
            if(!isset($_SESSION['user'])) return false;
            if($userid != $_SESSION['user']['user_id']) return false;
        }

        $view = file_get_contents(__DIR__ . '/../Views/summary.html');

        echo LayoutEngine::resolveLayout($view);

        return true;
    }

    public function placeOrder(Request $request){
        
        $data = $request->json();
        if($data == null){
            echo null;
            return true;
        }

        //$config = __DIR__ . '../Core/config.php';
        
        session_start();

        if(!isset($_SESSION['cart']) && count($_SESSION['cart']) == 0){
            echo null;
            return true;
        }

        $user_id = $_SESSION['user']['user_id'] ?? null;
        if($user_id == null){
            $user_id = User::createGuest($data);
        }

        $order_id = Order::createOrder($user_id, $data['payment']);
        foreach ($_SESSION['cart'] as $product) {
            Order::addProductToOrder($order_id, $product['product_variant_id'], $product['quantity']);
        }

        if($data['payment'] == 'CASH'){
            echo json_encode(["payment" => 'CASH']);
            Order::updateStatus($order_id, "PAID");
            return true;
        }

        return true;
    }
    
}