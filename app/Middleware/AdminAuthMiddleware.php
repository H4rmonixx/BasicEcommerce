<?php

namespace App\Middleware;

require_once __DIR__ . '/../Core/Request.php';
use App\Core\Request;

class AdminAuthMiddleware
{
    public function handle(Request $request, callable $next)
    {

        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if(!isset($_SESSION['user'])){
            header("Location: /login");
            exit;
        }
        if($_SESSION['user']['type'] != 'ADMIN' && $_SESSION['user']['type'] != 'SUPERADMIN'){
            return false;
        }

        return $next($request);
    }
}
