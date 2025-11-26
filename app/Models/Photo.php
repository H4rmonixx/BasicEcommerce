<?php

namespace App\Models;

require_once __DIR__ . '/../Core/Database.php';
use App\Core\Database;

use PDO;

class Photo {
    public $photo_id;
    public $product_id;
    public $filename;
    public static $fileDir = __DIR__ . '/../../public/assets/products/';


    public static function getByID(int $id) {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM Photo WHERE photo_id = ?");
        $stmt->execute([$id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$data) {
            return null;
        }

        $photo = new self();
        $photo->photo_id = $data['photo_id'];
        $photo->product_id = $data['product_id'];
        $photo->filename = $data['filename'];

        return $photo;
    }

    public static function createPhoto($product_id, $filename){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("INSERT INTO Photo (product_id, filename) VALUES (?, ?)");
        $stmt->execute([$product_id, $filename]);
        
        return $stmt->rowCount();
    }

    public static function deletePhoto($id){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("DELETE FROM Photo WHERE photo_id = ?");
        $stmt->execute([$id]);
        
        return $stmt->rowCount();
    }

}
