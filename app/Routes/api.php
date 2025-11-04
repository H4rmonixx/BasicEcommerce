<?php

require_once __DIR__ . '/../Core/Router.php';
require_once __DIR__ . '/../Controllers/CartController.php';
require_once __DIR__ . '/../Controllers/ProductController.php';
require_once __DIR__ . '/../Controllers/ArticleController.php';

use App\Core\Router;
use App\Controllers\CartController;
use App\Controllers\ProductController;
use App\Controllers\ArticleController;

$router = new Router();

$router->post('/products/load', [ProductController::class, 'loadProducts']);
$router->post('/product/load/{id}', [ProductController::class, 'loadProduct']);
$router->post('/products/pages', [ProductController::class, 'countPages']);

$router->post('/categories/load', [ProductController::class, 'loadAllCategories']);
$router->post('/sizes/load', [ProductController::class, 'loadAllSizes']);

$router->post('/article/load/{id}', [ArticleController::class, 'getByID']);

$router->post('/cart/size', [CartController::class, 'getSize']);
$router->post('/cart/add', [CartController::class, 'addToCart']);

return $router;