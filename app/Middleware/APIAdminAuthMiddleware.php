<?php

namespace App\Middleware;

require_once __DIR__ . '/../Core/Request.php';
use App\Core\Request;

class APIAdminAuthMiddleware
{
    public function handle(Request $request, callable $next)
    {

        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if(!isset($_SESSION['user'])){
            return false;
        }
        if($_SESSION['user']['type'] != 'ADMIN'){
            return false;
        }

        return $next($request);
    }
}
