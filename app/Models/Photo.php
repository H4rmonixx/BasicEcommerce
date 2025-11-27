<?php

namespace App\Models;

require_once __DIR__ . '/../Core/Database.php';
use App\Core\Database;

use PDO;

class Photo {
    public $photo_id;
    public $product_id;
    public $filename;
    public $order_number;
    public static $fileDir = __DIR__ . '/../../public/assets/products/';


    public static function getByID($id) {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM Photo WHERE photo_id = ? ORDER BY order_number ASC");
        $stmt->execute([$id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$data) {
            return null;
        }

        $photo = new self();
        $photo->photo_id = $data['photo_id'];
        $photo->product_id = $data['product_id'];
        $photo->filename = $data['filename'];
        $photo->order_number = $data['order_number'];

        return $photo;
    }

    public static function createPhoto($product_id, $filename, $order_number){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("INSERT INTO Photo (product_id, filename, order_number) VALUES (?, ?, ?)");
        $stmt->execute([$product_id, $filename, $order_number]);
        
        return $pdo->lastInsertId();
    }

    public static function deletePhoto($id){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("DELETE FROM Photo WHERE photo_id = ?");
        $stmt->execute([$id]);
        
        return $stmt->rowCount();
    }

    public static function reorderPhoto($photo_id, $new_order){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("UPDATE Photo SET order_number = ? WHERE photo_id = ?");
        $stmt->execute([$new_order, $photo_id]);

        return true;
    }

}
