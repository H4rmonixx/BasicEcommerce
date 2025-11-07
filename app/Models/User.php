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

}
