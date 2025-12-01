<?php

namespace App\Models;

require_once __DIR__ . '/../Core/Database.php';
use App\Core\Database;

use PDO;

class Order {
    public $order_id;
    public $user_id;
    public $date;
    public $address;
    public $building;
    public $city;
    public $post_code;
    public $country;
    public $shipping_price;
    public $products_price;
    public $payu_order_id;
    public $payment_method;
    public $status;
    public $products;

    public static function getByID($order_id){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM `Order` WHERE order_id = ?");
        $stmt->execute([$order_id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$data) {
            return null;
        }
        $stmt->closeCursor();

        $order = new self();
        $order->order_id = $data['order_id'];
        $order->user_id = $data['user_id'];
        $order->date = $data['date'];
        $order->address = $data['address'];
        $order->building = $data['building'];
        $order->city = $data['city'];
        $order->post_code = $data['post_code'];
        $order->country = $data['country'];
        $order->shipping_price = $data['shipping_price'];
        $order->products_price = $data['products_price'];
        $order->payu_order_id = $data['payu_order_id'];
        $order->payment_method = $data['payment_method'];
        $order->status = $data['status'];
        $order->products = self::getOrderDetails($order_id);

        return $order;
    }

    public static function getOrderDetails($order_id){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT product_variant_id, quantity FROM `Order_Detail` WHERE order_id = ?");
        $stmt->execute([$order_id]);
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function getOrdersList($search){
        $pdo = Database::getConnection();
        $sql = 'SELECT * FROM OrdersList';
        if(strlen($search) > 0) $sql .= ' WHERE concat(firstname, " ", lastname) LIKE :s';
        $stmt = $pdo->prepare($sql);
        if(strlen($search) > 0) $stmt->bindValue(":s", "%".$search."%");
        $stmt->execute();

        $data = [];

        while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
            $row['products'] = self::getOrderDetails($row['order_id']);
            $data[] = $row;
        }

        return $data;
    }

    public static function getUserID($order_id) {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT user_id FROM `Order` WHERE order_id = ?");
        $stmt->execute([$order_id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$data) {
            return null;
        }

        return $data['user_id'];
    }

    public static function getUserOrders($user_id){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT order_id FROM `Order` WHERE user_id = ? ORDER BY date DESC");
        $stmt->execute([$user_id]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if(!$result){
            return null;
        }

        $orders = [];
        foreach($result as $orderID){
            $t = self::getByID($orderID['order_id']);
            if($t != null) array_push($orders, $t);
        }

        return $orders;
    }

    public static function ifExists(int $order_id) {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT order_id FROM `Order` WHERE order_id = ?");
        $stmt->execute([$order_id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$data) {
            return false;
        }

        return true;
    }

    public static function createOrder($user_id, $data, $shipping_price){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("INSERT INTO `Order` (user_id, address, building, city, post_code, country, shipping_price) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$user_id, $data['shipment']['address'], $data['shipment']['building'], $data['shipment']['city'], $data['shipment']['postcode'], $data['shipment']['country'], $shipping_price]);

        return $pdo->lastInsertId();
    }

    public static function addProductToOrder($order_id, $product_variant_id, $quantity){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("INSERT INTO Order_Detail (order_id, product_variant_id, quantity) VALUES (?, ?, ?)");
        $stmt->execute([$order_id, $product_variant_id, $quantity]);

        return true;
    }

    public static function updateStatus($order_id, $status){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("UPDATE `Order` SET status = ? WHERE order_id = ?");
        $stmt->execute([$status, $order_id]);

        return true;
    }

}
