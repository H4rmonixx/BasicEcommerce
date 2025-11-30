<?php

namespace App\Models;

require_once __DIR__ . '/../Core/Database.php';
use App\Core\Database;

use PDO;

class Variant {

    public $variant_id;
    public $name;

    public static function getByID(int $id) {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM Variant WHERE variant_id = ?");
        $stmt->execute([$id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$data) {
            return null;
        }

        $cat = new self();
        $cat->variant_id = $data['variant_id'];
        $cat->name = $data['name'];

        return $cat;
    }

    public static function getAllVariants(){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM Variant");
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $data;
    }

    public static function getProductsCountInVariant($id){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT Count(*) FROM `Product_Variant` WHERE variant_id = ?");
        $stmt->execute([$id]);
        
        return $stmt->fetchColumn();
    }

    public static function createVariant($data){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("INSERT INTO Variant (name) VALUES (?)");
        $stmt->execute([$data['name']]);
        
        return $pdo->lastInsertId();
    }

    public static function editVariant($id, $data){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("UPDATE Variant SET name = ? WHERE variant_id = ?");
        $stmt->execute([$data['name'], $id]);
        
        return $stmt->rowCount();
    }

    public static function deleteVariant($id){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("DELETE FROM Variant WHERE variant_id = ?");
        $stmt->execute([$id]);
        
        return $stmt->rowCount();
    }

    public static function deleteProductVariant($id){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("DELETE FROM `Product_Variant` WHERE product_variant_id = ?");
        $stmt->execute([$id]);
        
        return $stmt->rowCount();
    }

    public static function editProductVariant($id, $q, $w, $h){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("UPDATE `Product_Variant` SET quantity = ?, width = ?, height = ? WHERE product_variant_id = ?");
        $stmt->execute([$q, $w, $h, $id]);
        
        return $stmt->rowCount();
    }

    public static function addProductVariant($data){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("INSERT INTO `Product_Variant` (product_id, variant_id, quantity, width, height) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$data['product_id'], $data['variant_id'], $data['quantity'], $data['width'], $data['height']]);
        
        return $stmt->rowCount();
    }

}
