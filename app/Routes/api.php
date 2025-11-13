<?php

require_once __DIR__ . '/../Core/Router.php';
require_once __DIR__ . '/../Controllers/CartController.php';
require_once __DIR__ . '/../Controllers/ProductController.php';
require_once __DIR__ . '/../Controllers/ArticleController.php';
require_once __DIR__ . '/../Controllers/UserController.php';
require_once __DIR__ . '/../Controllers/OrderController.php';

use App\Core\Router;
use App\Controllers\CartController;
use App\Controllers\ProductController;
use App\Controllers\ArticleController;
use App\Controllers\UserController;
use App\Controllers\OrderController;

$router = new Router();

$router->post('/products/load', [ProductController::class, 'loadProducts']);
$router->post('/product/load/{id}', [ProductController::class, 'loadProduct']);
$router->post('/product/load/variant/{variantid}', [ProductController::class, 'loadProductByVariant']);
$router->post('/products/pages', [ProductController::class, 'countPages']);

$router->post('/categories/load', [ProductController::class, 'loadAllCategories']);
$router->post('/sizes/load', [ProductController::class, 'loadAllSizes']);

$router->post('/article/load/{id}', [ArticleController::class, 'loadArticle']);

$router->post('/cart/size', [CartController::class, 'getSize']);
$router->post('/cart/add', [CartController::class, 'addToCart']);
$router->post('/cart/delete/{index}', [CartController::class, 'deleteFromCart']);
$router->post('/cart/change/{index}', [CartController::class, 'changeCart']);
$router->post('/cart/load', [CartController::class, 'loadCart']);

$router->post('/user/address/load', [UserController::class, 'getUserAddress']);
$router->post('/user/login/try', [UserController::class, 'login']);
$router->post('/user/register/try', [UserController::class, 'register']);

$router->post('/order/new', [OrderController::class, 'placeOrder']);

return $router;