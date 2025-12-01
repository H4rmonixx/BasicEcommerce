<?php

namespace App\Controllers;

require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/LayoutEngine.php';
require_once __DIR__ . '/../Models/User.php';
require_once __DIR__ . '/../Models/Order.php';
use App\Core\Request;
use App\Core\LayoutEngine;
use App\Models\User;
use App\Models\Order;

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
    
    public function loadUser(Request $request) {

        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if(!isset($_SESSION['user'])) {
            echo null;
            return true;
        }

        $user = User::getByID($_SESSION['user']['user_id']);
        echo json_encode($user);

        return true;
    }

    public function loadUsersList(Request $request){
        $data = $request->json();
        if($data == null){
            echo null;
            return true;
        }

        $users = User::getUsersList($data['search']);
        echo json_encode($users);

        return true;
    }

    public function loadUserOrders(Request $request){

        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if(!isset($_SESSION['user'])) {
            echo null;
            return true;
        }

        $orders = Order::getUserOrders($_SESSION['user']['user_id']);
        echo json_encode($orders);

        return true;
    }

    public function updateUserData(Request $request) {

        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if(!isset($_SESSION['user'])) {
            echo null;
            return true;
        }

        $data = $request->json();
        if($data == null){
            echo null;
            return true;
        }

        $result = User::updateUserData($_SESSION['user']['user_id'], $data);
        echo json_encode($result);

        return true;
    }

    public function updateUserPassword(Request $request){

        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if(!isset($_SESSION['user'])) {
            echo null;
            return true;
        }

        $data = $request->json();
        if($data == null){
            echo null;
            return true;
        }

        $result = User::updateUserPassword($_SESSION['user']['user_id'], $data);
        echo json_encode($result);

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

        $user = User::login($data['email'], $data['password']);
        if($user == null){
            echo json_encode(value: [false]);
            return true;
        }

        $_SESSION['user'] = [];
        $_SESSION['user']['user_id'] = $user['user_id'];
        $_SESSION['user']['type'] = $user['type'];
        $_SESSION['user']['firstname'] = $user['firstname'];
        $_SESSION['user']['lastname'] = $user['lastname'];

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