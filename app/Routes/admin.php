<?php

require_once __DIR__ . '/../Core/Router.php';
require_once __DIR__ . '/../Controllers/AdminController.php';
require_once __DIR__ . '/../Controllers/ProductController.php';
require_once __DIR__ . '/../Controllers/CategoryController.php';
require_once __DIR__ . '/../Middleware/AdminAuthMiddleware.php';
require_once __DIR__ . '/../Middleware/APIAdminAuthMiddleware.php';

use App\Core\Router;
use App\Controllers\AdminController;
use App\Controllers\CategoryController;
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
$router->get('/admin/product/{id}', [AdminController::class, 'product'], [
    AdminAuthMiddleware::class
]);
$router->get('/admin/categories', [AdminController::class, 'categories'], [
    AdminAuthMiddleware::class
]);



$router->post("/product/new", [ProductController::class, 'addProduct'], [
    APIAdminAuthMiddleware::class
]);
$router->post("/product/photo/new", [ProductController::class, 'addPhoto'], [
    APIAdminAuthMiddleware::class
]);
$router->post("/product/photo/delete/{id}", [ProductController::class, 'deletePhoto'], [
    APIAdminAuthMiddleware::class
]);
$router->post("/category/new", [CategoryController::class, 'addCategory'], [
    APIAdminAuthMiddleware::class
]);
$router->post("/category/edit/{id}", [CategoryController::class, 'editCategory'], [
    APIAdminAuthMiddleware::class
]);
$router->post("/products/list", [ProductController::class, 'loadProductsList'], [
    APIAdminAuthMiddleware::class
]);


return $router;