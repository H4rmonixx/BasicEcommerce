<?php

namespace App\Models;

require_once __DIR__ . '/../Core/Database.php';
use App\Core\Database;

use PDO;

class Configuration {
    public $configuration_id;
    public $value;

    public static function getByID($id) {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM `Configuration` WHERE configuration_id = ?");
        $stmt->execute([$id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$data) {
            return null;
        }

        $conf = new self();
        $conf->configuration_id = $data['configuration_id'];
        $conf->value = $data['value'];

        return $conf;
    }

    public static function getConfigurationList(){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM `Configuration`");
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $data;
    }

    public static function updateValue($id, $val){
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("UPDATE `Configuration` SET value = ? WHERE configuration_id = ?");
        $stmt->execute([$val, $id]);

        $affected = $stmt->rowCount();
        
        if($affected == 0) return null;
        
        return [true];
    }

}
