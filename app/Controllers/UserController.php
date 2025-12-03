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

require_once __DIR__ . '/../Core/Mailer.php';
use App\Core\Mailer;

class UserController {
    
    public function showLogin(Request $request){
        
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if(isset($_SESSION['user'])){
            header("Location: /account");
            exit;
        }

        $view = file_get_contents(__DIR__ . '/../Views/login.html');
        echo LayoutEngine::resolveLayout($view);

        return true;
    }

    public function showResetLogin(Request $request){
        
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if(isset($_SESSION['user'])){
            header("Location: /account");
            exit;
        }

        $view = file_get_contents(__DIR__ . '/../Views/loginreset.html');
        echo LayoutEngine::resolveLayout($view);

        return true;
    }

    public function showResetLoginPanel(Request $request){
        
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if(isset($_SESSION['user'])){
            header("Location: /account");
            exit;
        }

        $view = file_get_contents(__DIR__ . '/../Views/loginresetpanel.html');
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

    public function resetPasswordSetup(Request $request){
        $data = $request->json();
        if($data == null){
            echo null;
            return true;
        }

        $user = User::getByEmail($data['email']);
        if($user == null){
            echo json_encode([false, "User does not exist"]);
            return true;
        }

        $uniqueName = "";
        do{
            $uniqueName = bin2hex(random_bytes(8)) . '_' . uniqid();
        } while(User::ifResetExists($uniqueName));

        $result = User::setupReset($uniqueName, $user->user_id);
        if($result > 0){
            Mailer::sendMail($data['email'], "Password reset link", "general.html", [
                "MESSAGE_CONTENT" => '<div><a href="harmonixx.smallhost.pl/login/reset/'.$uniqueName.'">Click this link to reset your password!</a></div><div style="margin-top: 20px;">If you did not send request for password reset, just ignore this message.</div>'
            ]);
        }
        
        echo json_encode([$result, "Error occurred"]);
        return true;
    }

    public function resetPasswordTry(Request $request){
        $data = $request->json();
        if($data == null){
            echo null;
            return true;
        }

        if(!User::ifResetExists($data['id'])){
            echo json_encode([false, "Wrong reset id"]);
            return true;
        }

        $reset = User::getResetByID($data['id']);
        if($reset == null){
            echo json_encode([false, "Wrong reset id"]);
            return true;
        }
        
        $result = User::updateUserPassword($reset['user_id'], $data, true);
        if(!$result[0]){
            echo null;
            return true;
        }

        User::deleteReset($data['id']);

        echo json_encode([true]);
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
        if($result == null){
            echo null;
            return true;
        }

        echo json_encode($result);
        return true;
    }

    public function updateUserDataSuper(Request $request) {

        $id = $request->param("userid");
        if($id == null){
            echo null;
            return true;
        }
        $data = $request->json();
        if($data == null){
            echo null;
            return true;
        }

        $result = User::updateUserData($id, $data);
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
        if($result == null){
            echo null;
            return true;
        }
        if($result[0]){
            Mailer::sendMail($_SESSION['user']['email'], "Password changed", "passwordChange.html", ["EMAIL" => $_SESSION['user']['email'], "DATETIME" => date('Y-m-d'), "FULLNAME" => $_SESSION['user']['firstname'] . " " . $_SESSION['user']['lastname']]);
        }
        echo json_encode($result);
        return true;
    }

    public function updateUserPasswordSuper(Request $request){

        $id = $request->param("userid");
        if($id == null){
            echo null;
            return true;
        }
        $data = $request->json();
        if($data == null){
            echo null;
            return true;
        }

        $result = User::updateUserPassword($id, $data, true);
        echo json_encode($result);

        return true;
    }

    public function deleteUser(Request $request){
        $id = $request->param("userid");
        if($id == null){
            echo null;
            return true;
        }
        $data = $request->json();
        if($data == null){
            echo null;
            return true;
        }

        $result = User::deleteUser($id);

        if($result[0]){
            Mailer::sendMail($data['user_email'], "Account deleted", "general.html", ["MESSAGE_CONTENT" => "Your account has been deleted."]);
        }

        echo json_encode($result);
        return true;

    }

    public function updateUserType(Request $request){
        $id = $request->param("userid");
        if($id == null){
            echo null;
            return true;
        }
        $data = $request->json();
        if($data == null){
            echo null;
            return true;
        }

        $result = User::changeType($id, $data['type']);
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
        $_SESSION['user']['email'] = $user['email'];
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
        $_SESSION['user']['email'] = $data['email'];
        $_SESSION['user']['type'] = $data['type'];
        $_SESSION['user']['firstname'] = $data['firstname'];
        $_SESSION['user']['lastname'] = $data['lastname'];

        Mailer::sendMail($_SESSION['user']['email'], "Welcome to H.R.M.X!", "registerWelcome.html", ["FULLNAME" => $_SESSION['user']['firstname'] . " " . $_SESSION['user']['lastname']]);

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