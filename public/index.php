<?php

require_once __DIR__ . '/../app/Core/Request.php';
require_once __DIR__ . '/../app/Controllers/ErrorController.php';
require_once __DIR__ . '/../app/Middleware/AdminTopbarMiddleware.php';
use App\Core\Request;
use App\Controllers\ErrorController;
use App\Middleware\AdminTopbarMiddleware;

$request = new Request();

$routers = [];

$routers[] = require __DIR__ . '/../app/Routes/web.php';
$routers[] = require __DIR__ . '/../app/Routes/api.php';

foreach ($routers as $router) {
    if ($router->dispatch($request->method(), $request->path(), $request)) {
        exit;
    }
}

// ERRORS HANDLER
function callHandler($handler, $request){
    if (is_callable($handler)) {
        return $handler($request);
    }

    if (is_array($handler)) {
        [$class, $method] = $handler;
        $controller = new $class();
        return $controller->$method($request);
    }
}

$pipeline = array_reduce(
    array_reverse([AdminTopbarMiddleware::class]),
    fn($next, $middleware) => function($request) use ($middleware, $next) {
        $m = new $middleware();
        return $m->handle($request, $next);
    },
    fn($request) => callHandler([ErrorController::class, 'show'], $request)
);

$pipeline($request);