<?php

namespace App\Models;

require_once __DIR__ . '/../Core/Database.php';
use App\Core\Database;

use PDO;

class Product {
    public $product_id;
    public $category_id;
    public $name;
    public $description;
    public $price;
    public $photos;


    public static function findById(int $id) {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM user");
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$data) {
            return null;
        }

        $user = new self();
        $user->id = $data['id'];
        $user->nazwa = $data['nazwa'];
        $user->email = $data['email'];

        return $user;
    }

    public static function getTilesInfoArray($filters) {
        
        $pdo = Database::getConnection();

        $sql = "SELECT DISTINCT p.product_id as product_id, p.name as name, p.price as price FROM Product p INNER JOIN Product_Variant pv ON p.product_id = pv.product_id WHERE 1";
        $params = [];

        if(count($filters['categories']) > 0){
            $placeholders = implode(',', array_fill(0, count($filters['categories']), '?'));
            $sql .= " AND p.category_id IN ($placeholders)";
            $params = array_merge($params, $filters['categories']);
        }
        if(count($filters['sizes']) > 0){
            $placeholders = implode(',', array_fill(0, count($filters['sizes']), '?'));
            $sql .= " AND pv.variant_id IN ($placeholders)";
            $params = array_merge($params, $filters['sizes']);
        }
        if($filters['price_from'] != null){
            $sql .= " AND p.price >= ?";
            array_push($params, intval($filters['price_from']));
        }
        if($filters['price_to'] != null){
            $sql .= " AND p.price <= ?";
            array_push($params, intval($filters['price_to']));
        }
        if($filters['limit'] != null){
            $sql .= " LIMIT ".intval($filters['limit']);
        }

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        $data = [];

        while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
            $product = new self();
            $product->product_id = $row['product_id'];
            $product->name = $row['name'];
            $product->price = $row['price'];
            $product->photos = [];

            $stmt2 = $pdo->prepare("SELECT filename FROM Photo WHERE product_id = ?");
            $stmt2->execute([$row['product_id']]);
            while($row2 = $stmt2->fetch(PDO::FETCH_ASSOC)){
                $product->photos[] = $row2['filename'];
            }
            $stmt2->closeCursor();

            $data[] = $product;
        }

        return $data;
    }

    public static function getAllCategories(){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT category_id, name FROM Category");
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $data;
    }

    public static function getAllSizes(){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT variant_id, name FROM Variant");
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $data;
    }

}
