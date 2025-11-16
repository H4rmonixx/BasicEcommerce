<?php

namespace App\Controllers;

require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/LayoutEngine.php';
require_once __DIR__ . '/../Models/User.php';
use App\Core\Request;
use App\Core\LayoutEngine;
use App\Models\User;

class UserController {
    
    public function showLogin(Request $request){
        
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        unset($_SESSION['user']);

        if(isset($_SESSION['user'])){
            header("Location: /account");
            exit;
        }

        $view = file_get_contents(__DIR__ . '/../Views/login.html');

        echo LayoutEngine::resolveLayout($view);

        return true;
    }

    public function showAccount(Request $request){
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        $view = file_get_contents(__DIR__ . '/../Views/account.html');

        echo LayoutEngine::resolveLayout($view);

        return true;
    }
    
    public function getUserAddress(Request $request) {

        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if(!isset($_SESSION['user'])) {
            echo null;
            return true;
        }

        $user = User::getUserAddress($_SESSION['user']['user_id']);
        echo json_encode($user);

        return true;
    }

    public function login(Request $request){

        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        $data = $request->json();
        if($data == null){
            echo null;
            return true;
        }

        $userid = User::login($data['email'], $data['password']);
        if($userid == null){
            echo json_encode(value: [false]);
            return true;
        }

        $_SESSION['user'] = [];
        $_SESSION['user']['user_id'] = $userid;

        echo json_encode([true]);
        return true;
    }

    public function register(Request $request){

        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        $data = $request->json();
        if($data == null){
            echo null;
            return true;
        }

        $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);

        $userid = User::register($data);
        if($userid == null){
            return true;
        }

        $_SESSION['user'] = [];
        $_SESSION['user']['user_id'] = $userid;

        echo json_encode([true]);
        return true;
    }

    public function logout(Request $request){
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        unset($_SESSION['user']);
        echo json_encode([true]);
        return true;
    }
    
}