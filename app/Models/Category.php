<?php

namespace App\Models;

require_once __DIR__ . '/../Core/Database.php';
use App\Core\Database;

use PDO;

class Category {

    public $category_id;
    public $name;

    public static function getByID($id) {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM Category WHERE category_id = ?");
        $stmt->execute([$id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$data) {
            return null;
        }

        $cat = new self();
        $cat->category_id = $data['category_id'];
        $cat->name = $data['name'];

        return $cat;
    }

    public static function getAllCategories(){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM Category");
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $data;
    }

    public static function getProductsCountInCategory($id){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT Count(*) FROM Product WHERE category_id = ?");
        $stmt->execute([$id]);
        
        return $stmt->fetchColumn();
    }

    public static function createCategory($data){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("INSERT INTO Category (name) VALUES (?)");
        $stmt->execute([$data['name']]);
        
        return $pdo->lastInsertId();
    }

    public static function editCategory($id, $data){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("UPDATE Category SET name = ? WHERE category_id = ?");
        $stmt->execute([$data['name'], $id]);
        
        return $stmt->rowCount();
    }

    public static function deleteCategory($id){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("DELETE FROM Category WHERE category_id = ?");
        $stmt->execute([$id]);
        
        return $stmt->rowCount();
    }

}
