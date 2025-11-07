<?php

require_once __DIR__ . '/../app/Core/Request.php';
require_once __DIR__ . '/../app/Core/LayoutEngine.php';
use App\Core\Request;
use App\Core\LayoutEngine;

$request = new Request();

$routers = [];

$routers[] = require __DIR__ . '/../app/Routes/web.php';
$routers[] = require __DIR__ . '/../app/Routes/api.php';

foreach ($routers as $router) {
    if ($router->dispatch($request->method(), $request->path(), $request)) {
        exit;
    }
}

// CODE 404 - REQUEST NOT FOUND
http_response_code(404);
$view = file_get_contents(__DIR__ . '/../app/Views/Errors/err404.html');
echo LayoutEngine::resolveLayout($view);