<?php

require_once __DIR__ . '/../Core/Router.php';
require_once __DIR__ . '/../Controllers/AdminController.php';
require_once __DIR__ . '/../Middleware/AdminAuthMiddleware.php';

use App\Core\Router;
use App\Controllers\AdminController;
use App\Middleware\AdminAuthMiddleware;

$router = new Router();

$router->get('/admin', [AdminController::class, 'index'], [
    AdminAuthMiddleware::class
]);
$router->get('/admin/products', [AdminController::class, 'products'], [
    AdminAuthMiddleware::class
]);

return $router;