<?php

namespace App\Controllers;

require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/LayoutEngine.php';
require_once __DIR__ . '/../Models/Order.php';
require_once __DIR__ . '/../Models/User.php';
require_once __DIR__ . '/../Models/Product.php';
require_once __DIR__ . '/../Models/Configuration.php';
require_once __DIR__ . '/../Models/Cart_Entry.php';
use App\Core\Request;
use App\Core\LayoutEngine;
use App\Models\Order;
use App\Models\User;
use App\Models\Product;
use App\Models\Configuration;
use App\Models\Cart_Entry;

require_once __DIR__ . '/../Core/Mailer.php';
use App\Core\Mailer;

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
        
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        $cart = [];
        if(isset($_SESSION['user'])){
            $cart = Cart_Entry::getCart($_SESSION['user']['user_id']);
        } else {
            if(!isset($_SESSION["cart"])) $_SESSION["cart"] = [];
            $cart = &$_SESSION['cart'];
        }

        if(!isset($cart) || count($cart) == 0){
            echo null;
            return true;
        }

        $user_email = $_SESSION['user']['email'] ?? null;
        $user_id = $_SESSION['user']['user_id'] ?? null;
        if($user_id == null){
            $user_id = User::createGuest($data);
            $user_email = $data['personal']['email'];
        }

        $shipping_price = Configuration::getByID("shipping_price");
        if($shipping_price == null) {
            $shipping_price = new Configuration();
            $shipping_price->value = 0.0;
        }

        $order_id = Order::createOrder($user_id, $data, $shipping_price->value);
        $cart_not_available = [];
        $mail_order_items = "";
        foreach ($cart as $product) {
            if(!Product::ifQuantityInStock($product['product_variant_id'], $product['quantity'])){
                array_push($cart_not_available, $product);
                continue;
            }
            Order::addProductToOrder($order_id, $product['product_variant_id'], $product['quantity']);
            Product::updateVariantQuantity($product['product_variant_id'], (-1) * $product['quantity']);

            $product_data = Product::getByVariantID($product['product_variant_id']);
            $mail_order_items .= '<tr><td>'.$product_data->name.'</td><td>'.$product_data->variants[0]['name'].'</td><td>'.$product_data->price.'</td><td>'.$product['quantity'].'</td><td style="text-align: right;">'.round($product_data->price * $product['quantity'], 2).' PLN</td></tr>';
        }

        if(isset($_SESSION['user'])){
            Cart_Entry::clearCart($_SESSION['user']['user_id']);
            if(count($cart_not_available) > 0) Cart_Entry::setCart($_SESSION['user']['user_id'], $cart_not_available);
        } else {
            unset($_SESSION['cart']);
            if(count($cart_not_available) > 0) $_SESSION['cart'] = $cart_not_available;
        }

        Mailer::sendMail($user_email, "Order #".$order_id." confirmation", "orderConfirmation.html",
        [
            "ORDER_ID" => $order_id,
            "ORDER_PRODUCTS" => $data['price'] . " PLN",
            "ORDER_SHIPMENT" => $shipping_price->value . " PLN",
            "ORDER_TOTAL" => ($data['price'] + $shipping_price->value) . " PLN",
            "ORDER_ITEMS" => $mail_order_items
        ]);

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

        Mailer::sendMail($data['email'], "Order #".$data['order_id']." status changed", "orderStatusChange.html",
        [
            "ORDER_ID" => $data['order_id'],
            "ORDER_STATUS" => $data['status']
        ]);

        echo json_encode([true]);
        return true;
    }
    
}