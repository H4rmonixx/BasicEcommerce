<?php

namespace App\Controllers;

require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/LayoutEngine.php';
require_once __DIR__ . '/../Models/User.php';
use App\Core\Request;
use App\Core\LayoutEngine;
use App\Models\User;

class UserController {
    public function getUserAddress(Request $request) {

        session_start();

        if(!isset($_SESSION['user'])) {
            echo null;
            return true;
        }

        $user = User::getUserAdress($_SESSION['user']['user_id']);
        echo json_encode($user);

        return true;
    }
    
}