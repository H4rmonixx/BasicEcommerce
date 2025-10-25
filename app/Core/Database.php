<?php

namespace App\Core;

use PDO;
use PDOException;

class Database {
    private static $pdo = null;

    public static function getConnection(): PDO
    {
        if (self::$pdo === null) {
            $config = require __DIR__ . '/config.php';
            $db = $config['db'];

            try {
                self::$pdo = new PDO("mysql:host={$db['host']};dbname={$db['name']}", $db['user'], $db['pass']);
            } catch (PDOException $e) {
                die("Error while connecting to database!" . $e->getMessage());
            }
        }

        return self::$pdo;
    }
}
