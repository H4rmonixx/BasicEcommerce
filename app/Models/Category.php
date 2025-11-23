<?php

namespace App\Models;

require_once __DIR__ . '/../Core/Database.php';
use App\Core\Database;

use PDO;

class Category {

    public $category_id;
    public $name;

    public static function getByID(int $id) {
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

}
