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
    public $variants;


    public static function getByID($id) {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM Product WHERE product_id = ? AND visible = 1");
        $stmt->execute([$id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$data) {
            return null;
        }

        $product = new self();
        $product->product_id = $data['product_id'];
        $product->category_id = $data['category_id'];
        $product->name = $data['name'];
        $product->description = $data['description'];
        $product->price = $data['price'];
        $product->variants = [];
        $product->photos = [];

        $stmt2 = $pdo->prepare("SELECT photo_id, filename FROM Photo WHERE product_id = ?");
        $stmt2->execute([$id]);
        while($row = $stmt2->fetch(PDO::FETCH_ASSOC)){
            $product->photos[] = $row;
        }
        $stmt2->closeCursor();

        $stmt2 = $pdo->prepare("SELECT product_variant_id, name, quantity, width, height FROM product_variant pv INNER JOIN variant v ON pv.variant_id = v.variant_id WHERE product_id = ? ORDER BY name");
        $stmt2->execute([$id]);
        while($row = $stmt2->fetch(PDO::FETCH_ASSOC)){
            $product->variants[] = $row;
        }
        $stmt2->closeCursor();

        return $product;
    }

    public static function getByVariantID($variantid) {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM Product p INNER JOIN Product_Variant pv ON p.product_id = pv.product_id WHERE pv.product_variant_id = ? AND visible = 1");
        $stmt->execute([$variantid]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$data) {
            return null;
        }

        $product = new self();
        $product->product_id = $data['product_id'];
        $product->category_id = $data['category_id'];
        $product->name = $data['name'];
        $product->description = $data['description'];
        $product->price = $data['price'];
        $product->variants = [];
        $product->photos = [];

        $stmt2 = $pdo->prepare("SELECT photo_id, filename FROM Photo WHERE product_id = ?");
        $stmt2->execute([$product->product_id]);
        while($row = $stmt2->fetch(PDO::FETCH_ASSOC)){
            $product->photos[] = $row;
        }
        $stmt2->closeCursor();

        $stmt2 = $pdo->prepare("SELECT product_variant_id, name, quantity, width, height FROM product_variant pv INNER JOIN variant v ON pv.variant_id = v.variant_id WHERE product_id = ? AND product_variant_id = ? ORDER BY name");
        $stmt2->execute([$product->product_id, $variantid]);
        if($row = $stmt2->fetch(PDO::FETCH_ASSOC)){
            $product->variants[] = $row;
        }
        $stmt2->closeCursor();

        return $product;
    }

    public static function getPhotos($id){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM Photo WHERE product_id = ?");
        $stmt->execute([$id]);
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $data;
    }

    public static function getFilteredProducts($filters) {
        
        $pdo = Database::getConnection();

        $sql = "SELECT * FROM ProductsList WHERE visible = 1";
        $params = [];

        if(count($filters['categories']) > 0){
            $placeholders = implode(',', array_fill(0, count($filters['categories']), '?'));
            $sql .= " AND category_id IN ($placeholders)";
            $params = array_merge($params, $filters['categories']);
        }
        if(count($filters['sizes']) > 0){
            $placeholders = implode(',', array_fill(0, count($filters['sizes']), '?'));
            $sql .= " AND variant_id IN ($placeholders)";
            $params = array_merge($params, $filters['sizes']);
        }
        if($filters['price_from'] != null){
            $sql .= " AND price >= ?";
            array_push($params, intval($filters['price_from']));
        }
        if($filters['price_to'] != null){
            $sql .= " AND price <= ?";
            array_push($params, intval($filters['price_to']));
        }
        if($filters['omit_id'] != null){
            $sql .= " AND product_id <> ?";
            array_push($params, intval($filters['omit_id']));
        }
        if($filters['limit'] != null){
            $sql .= " LIMIT ".intval($filters['limit']);
            if($filters['page'] != null){
                $sql .= " OFFSET ".(intval($filters['page']) - 1);
            }
        }

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        $data = [];
        $prod_ids = [];

        while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
            if(!in_array($row['product_id'], $prod_ids)){
                $prod_ids[] = $row['product_id'];

                $product = new self();
                $product->product_id = $row['product_id'];
                $product->category_id = $row['category_id'];
                $product->name = $row['name'];
                $product->price = $row['price'];
                $product->photos = [];
                $product->variants = [];

                $data[] = $product;
            }

            $index = count($prod_ids) - 1;
            if($row['product_variant_id'] != null){
                $data[$index]->variants[] =  [
                    "product_variant_id" => $row['product_variant_id'],
                    "name" => $row['variant_name'],
                    "quantity" => $row['quantity']
                ];
            }

            $stmt2 = $pdo->prepare("SELECT photo_id, filename FROM Photo WHERE product_id = ?");
            $stmt2->execute([$row['product_id']]);
            while($row2 = $stmt2->fetch(PDO::FETCH_ASSOC)){
                $data[$index]->photos[] =  $row2;
            }
            $stmt2->closeCursor();

        }

        return $data;
    }

    public static function getProductsList(){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM ProductsList");
        $stmt->execute();

        $data = [];
        $prod_ids = [];

        while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
            if(!in_array($row['product_id'], $prod_ids)){
                $prod_ids[] = $row['product_id'];

                $product = new self();
                $product->product_id = $row['product_id'];
                $product->category_id = $row['category_id'];
                $product->name = $row['name'];
                $product->price = $row['price'];
                $product->photos = [];
                $product->variants = [];

                $data[] = $product;
            }

            $index = count($prod_ids) - 1;
            if($row['product_variant_id'] != null){
                $data[$index]->variants[] =  [
                    "product_variant_id" => $row['product_variant_id'],
                    "name" => $row['variant_name'],
                    "quantity" => $row['quantity']
                ];
            }

        }

        return $data;
    }

    public static function getCount($filters){
        $pdo = Database::getConnection();

        $sql = "SELECT Count(*) FROM Product WHERE product_id IN (SELECT p.product_id FROM Product p INNER JOIN Product_Variant pv ON p.product_id = pv.product_id WHERE visible = 1";
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
        if($filters['omit_id'] != null){
            $sql .= " AND p.product_id <> ?";
            array_push($params, intval($filters['omit_id']));
        }

        $sql .= ")";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        if($filters['limit'] == null) $filters['limit'] = 8;

        $data = ["pagesCount" => (int) ($stmt->fetchColumn() / $filters['limit'] + 1)];

        return $data;
    }

    public static function updateVariantQuantity(int $variant_id, int $x) {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("UPDATE Product_Variant SET quantity = quantity + ? WHERE product_variant_id = ?");
        $stmt->execute([$x, $variant_id]);

        return true;
    }

    public static function ifQuantityInStock(int $variant_id, int $quantity){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT 1 FROM Product_Variant WHERE product_variant_id = ? AND quantity >= ?");
        $stmt->execute([$variant_id, $quantity]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if(!$data){
            return false;
        }

        return true;
    }

    public static function createProduct($data){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("INSERT INTO Product (category_id, name, price, visible) VALUES (?, ?, ?, ?)");
        $stmt->execute([$data['category_id'], $data['name'], $data['price'], $data['visible']]);
        
        return $pdo->lastInsertId();
    }

    public static function deleteProduct($id){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("DELETE FROM Product WHERE product_id = ?");
        $stmt->execute([$id]);
        
        return $stmt->rowCount();
    }

    public static function ifExists($id) {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT product_id FROM `Product` WHERE product_id = ?");
        $stmt->execute([$id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$data) {
            return false;
        }

        return true;
    }

}
