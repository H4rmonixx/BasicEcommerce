<?php

namespace App\Models;

require_once __DIR__ . '/../Core/Database.php';
use App\Core\Database;

use PDO;

class Order {
    public $order_id;
    public $user_id;


    public static function getUserID(int $order_id) {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT user_id FROM `Order` WHERE order_id = ?");
        $stmt->execute([$order_id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$data) {
            return null;
        }

        return $data['user_id'];
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

    public static function createOrder($user_id, $payment){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("INSERT INTO `Order` (user_id, payment_method) VALUES (?, ?)");
        $stmt->execute([$user_id, $payment]);

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
