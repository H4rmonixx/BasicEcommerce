<?php

namespace App\Models;

require_once __DIR__ . '/../Core/Database.php';
use App\Core\Database;

use PDO;

class Cart_Entry {

    public $cart_entry_id;
    public $user_id;
    public $product_variant_id;
    public $quantity;

    public static function getSize($user_id) {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT Count(*) FROM `Cart_Entry` WHERE user_id = ?");
        $stmt->execute([$user_id]);
        
        return $stmt->fetchColumn();
    }

    public static function getCart($user_id){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM `Cart_Entry` WHERE user_id = ?");
        $stmt->execute([$user_id]);
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $data;
    }

}
