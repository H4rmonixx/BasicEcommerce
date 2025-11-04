<?php

require_once __DIR__ . '/../Core/Router.php';
require_once __DIR__ . '/../Controllers/HomeController.php';
require_once __DIR__ . '/../Controllers/ProductController.php';
require_once __DIR__ . '/../Controllers/ArticleController.php';

use App\Core\Router;
use App\Controllers\HomeController;
use App\Controllers\ProductController;
use App\Controllers\ArticleController;

$router = new Router();

$router->get('/', [HomeController::class, 'index']);

$router->get('/products', [ProductController::class, 'showProducts']);
$router->get('/products/{filters}', [ProductController::class, 'showProducts']);
$router->get('/products/{filters}/{page}', [ProductController::class, 'showProducts']);

$router->get('/product/{id}', [ProductController::class, 'showProduct']);

$router->get('/article/{id}', [ArticleController::class, 'showArticle']);

return $router;