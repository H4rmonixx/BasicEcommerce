<?php

require_once __DIR__ . '/../Core/Router.php';
require_once __DIR__ . '/../Controllers/AdminController.php';
require_once __DIR__ . '/../Controllers/ProductController.php';
require_once __DIR__ . '/../Middleware/AdminAuthMiddleware.php';
require_once __DIR__ . '/../Middleware/APIAdminAuthMiddleware.php';

use App\Core\Router;
use App\Controllers\AdminController;
use App\Controllers\ProductController;
use App\Middleware\AdminAuthMiddleware;
use App\Middleware\APIAdminAuthMiddleware;

$router = new Router();

$router->get('/admin', [AdminController::class, 'index'], [
    AdminAuthMiddleware::class
]);
$router->get('/admin/products', [AdminController::class, 'products'], [
    AdminAuthMiddleware::class
]);

$router->post("/product/new", [ProductController::class, 'addProduct'], [
    APIAdminAuthMiddleware::class
]);
$router->post("/products/list", [ProductController::class, 'loadProductsList'], [
    APIAdminAuthMiddleware::class
]);


return $router;