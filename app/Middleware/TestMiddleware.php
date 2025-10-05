<?php

namespace App\Middleware;

require_once __DIR__ . '/../Core/Request.php';
use App\Core\Request;

class TestMiddleware
{
    public function handle(Request $request, callable $next)
    {

        //exit;

        // kontynuuj dalej
        return $next($request);
    }
}
