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
            if($_SESSION['user']['type'] == 'ADMIN' || $_SESSION['user']['type'] == 'SUPERADMIN'){
                LayoutEngine::enableExtension("admin_top_bar", "adminTopBar.html", ["username" => $_SESSION['user']['firstname']." ".$_SESSION['user']['lastname']]);
            }
        }
        
        
        return $next($request);
    }
}
