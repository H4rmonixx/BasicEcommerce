<?php

namespace App\Models;

require_once __DIR__ . '/../Core/Database.php';
use App\Core\Database;

use PDO;

class Cart_Entry {

    public static function getSize($user_id) {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT Count(*) FROM `Cart_Entry` WHERE user_id = ?");
        $stmt->execute([$user_id]);
        
        return $stmt->fetchColumn();
    }

    public static function addToCart($user_id, $product){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("INSERT INTO `Cart_Entry` (user_id, product_variant_id, quantity) VALUES (?, ?, ?)");
        $stmt->execute([$user_id, $product['product_variant_id'], 1]);
        
        return $stmt->rowCount();
    }

    public static function changeCart($cart_entry_id, $quantity){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("UPDATE `Cart_Entry` SET quantity = ? WHERE cart_entry_id = ?");
        $stmt->execute([$quantity, $cart_entry_id]);
        
        return $stmt->rowCount();
    }

    public static function deleteFromCart($cart_entry_id){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("DELETE FROM `Cart_Entry` WHERE cart_entry_id = ?");
        $stmt->execute([$cart_entry_id]);
        
        return $stmt->rowCount();
    }

    public static function getCart($user_id): array{
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM `Cart_Entry` WHERE user_id = ? ORDER BY cart_entry_id ASC");
        $stmt->execute([$user_id]);
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $data;
    }

    public static function clearCart($user_id){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("DELETE FROM `Cart_Entry` WHERE user_id = ?");
        $stmt->execute([$user_id]);
        
        return $stmt->rowCount();
    }

    public static function setCart($user_id, $prods){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("INSERT INTO `Cart_Entry` (user_id, product_variant_id, quantity) VALUES (?, ?, ?)");

        foreach($prods as $pr){
            $stmt->execute([$user_id, $pr['product_variant_id'], $pr['quantity']]);
        }
    }

}
