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


    public static function getUserAddress(int $id) {
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
        $stmt = $pdo->prepare(query: 'INSERT INTO User (firstname, lastname, phone_number, email, address, building, city, post_code, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([$data['personal']['firstname'], $data['personal']['lastname'], $data['personal']['phone'], $data['personal']['email'], $data['shipment']['address'], $data['shipment']['building'], $data['shipment']['city'], $data['shipment']['postcode'], $data['shipment']['country']]);
        
        return $pdo->lastInsertId();
    }

    public static function login($email, $password){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('SELECT user_id, password FROM User WHERE email LIKE ? AND type NOT LIKE "GUEST"');
        $stmt->execute([$email]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if(!$data){
            return null;
        }

        if(!password_verify($password, $data['password'])){
            return null;
        }

        return $data['user_id'];
    }

    public static function register($data){
        $pdo = Database::getConnection();

        $stmt = $pdo->prepare("SELECT user_id FROM User WHERE email LIKE ?");
        $stmt->execute([$data['email']]);
        $u = $stmt->fetch(PDO::FETCH_ASSOC);
        if($u){
            echo json_encode([false, "Email is already in use"]);
            return null;
        }
        $stmt->closeCursor();

        $stmt = $pdo->prepare(query: 'INSERT INTO User (firstname, lastname, phone_number, email, password, address, building, city, post_code, country, type) VALUES (:firstname, :lastname, :phone_number, :email, :password, :address, :building, :city, :post_code, :country, "CUSTOMER")');
        $stmt->execute($data);

        return $pdo->lastInsertId();
    }

}
