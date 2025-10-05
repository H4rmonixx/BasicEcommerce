<?php

require_once __DIR__ . '/../app/Core/Request.php';
use App\Core\Request;

$request = new Request();

$routers = [];

$routers[] = require __DIR__ . '/../app/Routes/web.php';
$routers[] = require __DIR__ . '/../app/Routes/api.php';

foreach ($routers as $router) {
    if ($router->dispatch($request->method(), $request->path(), $request)) {
        exit;
    }
}

http_response_code(404);
echo "404 Not Found";