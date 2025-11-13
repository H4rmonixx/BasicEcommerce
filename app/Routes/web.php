<?php

require_once __DIR__ . '/../Core/Router.php';
require_once __DIR__ . '/../Controllers/HomeController.php';
require_once __DIR__ . '/../Controllers/ProductController.php';
require_once __DIR__ . '/../Controllers/ArticleController.php';
require_once __DIR__ . '/../Controllers/CartController.php';
require_once __DIR__ . '/../Controllers/OrderController.php';
require_once __DIR__ . '/../Controllers/UserController.php';

use App\Core\Router;
use App\Controllers\HomeController;
use App\Controllers\ProductController;
use App\Controllers\ArticleController;
use App\Controllers\CartController;
use App\Controllers\OrderController;
use App\Controllers\UserController;

$router = new Router();

$router->get('/', [HomeController::class, 'index']);
$router->get('/about', [HomeController::class, 'about']);
$router->get('/contact', [HomeController::class, 'contact']);

$router->get('/products', [ProductController::class, 'showProducts']);
$router->get('/products/{filters}', [ProductController::class, 'showProducts']);
$router->get('/products/{filters}/{page}', [ProductController::class, 'showProducts']);

$router->get('/product/{id}', [ProductController::class, 'showProduct']);

$router->get('/article/{id}', [ArticleController::class, 'showArticle']);

$router->get('/cart', [CartController::class, 'showCart']);

$router->get('/summary/{orderid}', [OrderController::class, 'showSummary']);

$router->get('/login', [UserController::class, 'showLogin']);

return $router;