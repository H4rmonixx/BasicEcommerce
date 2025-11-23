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

}
