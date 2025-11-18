<?php

namespace App\Middleware;

require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/LayoutEngine.php';
use App\Core\Request;
use App\Core\LayoutEngine;

class AdminTopbarMiddleware
{
    public function handle(Request $request, callable $next)
    {

        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if(isset($_SESSION['user'])){
            if($_SESSION['user']['type'] == 'ADMIN'){
                // extension admin top bar
            }
        }
        
        
        return $next($request);
    }
}
