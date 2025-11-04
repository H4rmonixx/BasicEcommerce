<?php

require_once __DIR__ . '/../Core/Router.php';
require_once __DIR__ . '/../Controllers/HomeController.php';
require_once __DIR__ . '/../Controllers/ProductController.php';

use App\Core\Router;
use App\Controllers\HomeController;
use App\Controllers\ProductController;

$router = new Router();

$router->get('/', [HomeController::class, 'index']);

$router->get('/products', [ProductController::class, 'showProducts']);
$router->get('/products/{filters}', [ProductController::class, 'showProducts']);
$router->get('/products/{filters}/{page}', [ProductController::class, 'showProducts']);

$router->get('/product/{id}', [ProductController::class, 'showProduct']);

$router->post('/products/load', [ProductController::class, 'loadProducts']);
$router->post('/product/load/{id}', [ProductController::class, 'loadProduct']);
$router->post('/categories/load', [ProductController::class, 'loadAllCategories']);
$router->post('/sizes/load', [ProductController::class, 'loadAllSizes']);
$router->post('/pages/count', [ProductController::class, 'countPages']);

return $router;