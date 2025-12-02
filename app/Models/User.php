<?php

namespace App\Models;

require_once __DIR__ . '/../Core/Database.php';
use App\Core\Database;

use PDO;

class User {
    public $user_id;
    public $firstname;
    public $lastname;
    public $email;
    public $phone_number;
    public $address;
    public $building;
    public $city;
    public $post_code;
    public $country;
    public $type;


    public static function getByID($id) {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM User WHERE user_id = ?");
        $stmt->execute([$id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$data) {
            return null;
        }

        $user = new self();
        $user->user_id = $data['user_id'];
        $user->firstname = $data['firstname'];
        $user->lastname = $data['lastname'];
        $user->email = $data['email'];
        $user->phone_number = $data['phone_number'];
        $user->address = $data['address'];
        $user->building = $data['building'];
        $user->city = $data['city'];
        $user->post_code = $data['post_code'];
        $user->country = $data['country'];
        $user->type = $data['type'];

        return $user;
    }

    public static function getUsersList($search) {
        $pdo = Database::getConnection();

        $stmt = $pdo->prepare('SELECT * FROM User WHERE type LIKE "ADMIN"');
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $stmt->closeCursor();

        $stmt = $pdo->prepare('SELECT * FROM User WHERE type LIKE "CUSTOMER" AND (concat(firstname, " ", lastname) LIKE :s OR email LIKE :s OR phone_number LIKE :s)');
        $stmt->bindValue(":s", "%".$search."%");
        $stmt->execute();
        $data2 = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $stmt->closeCursor();

        return array_merge($data, $data2);
    }

    public static function updateUserData($id, $data){
        $updateClause = "";
        $valuesList = [];
        $index = 1;
        foreach($data as $key => $value){
            $updateClause .= $key." = ?";
            if($index < count($data)) $updateClause .= ", ";
            else $updateClause .= " ";
            $index++;
            array_push($valuesList, $value);
        }
        array_push($valuesList, $id);

        $sql = "UPDATE User SET $updateClause WHERE user_id = ?";

        $pdo = Database::getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->execute($valuesList);
        $affected = $stmt->rowCount();

        if($affected == 0) return null;
        
        return [true];
    }

    public static function updateUserPassword($id, $data, $override = false){
        $pdo = Database::getConnection();
        if(!$override){
            $stmt = $pdo->prepare("SELECT password FROM User WHERE user_id = ?");
            $stmt->execute([$id]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            $stmt->closeCursor();

            if (!$user) {
                return null;
            }

            if(!password_verify($data['password_old'], $user['password'])){
                return [false];
            }
        }

        $stmt = $pdo->prepare("UPDATE User SET password = ? WHERE user_id = ?");
        $stmt->execute([$data['password_new'], $id]);
        $affected = $stmt->rowCount();

        if($affected == 0) return null;
        
        return [true];
    }

    public static function deleteUser($id){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("DELETE FROM User WHERE user_id = ?");
        $stmt->execute([$id]);
        $affected = $stmt->rowCount();
        
        if($affected == 0) return null;
        
        return [true];
    }

    public static function changeType($id, $type){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("UPDATE User SET type = ? WHERE user_id = ?");
        $stmt->execute([$type, $id]);
        $affected = $stmt->rowCount();
        
        if($affected == 0) return null;
        
        return [true];
    }

    public static function createGuest($data){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare(query: 'INSERT INTO User (firstname, lastname, phone_number, email, address, building, city, post_code, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([$data['personal']['firstname'], $data['personal']['lastname'], $data['personal']['phone'], $data['personal']['email'], $data['shipment']['address'], $data['shipment']['building'], $data['shipment']['city'], $data['shipment']['postcode'], $data['shipment']['country']]);
        
        return $pdo->lastInsertId();
    }

    public static function login($email, $password){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('SELECT user_id, password, type, firstname, lastname FROM User WHERE email LIKE ? AND type NOT LIKE "GUEST"');
        $stmt->execute([$email]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if(!$data){
            return null;
        }

        if(!password_verify($password, $data['password'])){
            return null;
        }

        return ["user_id" => $data['user_id'], "type" => $data['type'], "firstname" => $data['firstname'], "lastname" => $data['lastname']];
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
