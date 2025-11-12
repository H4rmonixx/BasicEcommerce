<?php

namespace App\Models;

require_once __DIR__ . '/../Core/Database.php';
use App\Core\Database;

use PDO;

class User {
    public $user_id;
    public $firstname;
    public $lastname;
    public $address;
    public $city;
    public $post_code;
    public $country;


    public static function getUserAdress(int $id) {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT address, building, city, post_code, country FROM User WHERE user_id = ?");
        $stmt->execute([$id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$data) {
            return null;
        }

        $user = new self();
        $user->address = $data['address'];
        $user->building = $data['building'];
        $user->city = $data['city'];
        $user->post_code = $data['post_code'];
        $user->country = $data['country'];

        return $user;
    }

    public static function createGuest($data){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("INSERT INTO User (firstname, lastname, phone_number, email, address, building, city, post_code, country, permission_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 3)");
        $stmt->execute([$data['personal']['firstname'], $data['personal']['lastname'], $data['personal']['phone'], $data['personal']['email'], $data['shipment']['address'], $data['shipment']['building'], $data['shipment']['city'], $data['shipment']['postcode'], $data['shipment']['country']]);
        
        return $pdo->lastInsertId();
    }

}
