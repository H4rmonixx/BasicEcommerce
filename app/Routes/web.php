<?php

require_once __DIR__ . '/../Core/Router.php';
require_once __DIR__ . '/../Controllers/HomeController.php';
require_once __DIR__ . '/../Controllers/ProductController.php';
require_once __DIR__ . '/../Middleware/TestMiddleware.php';

use App\Core\Router;
use App\Controllers\HomeController;
use App\Controllers\ProductController;
use App\Middleware\TestMiddleware;

$router = new Router();

$router->get('/', [HomeController::class, 'index']);
$router->get('/products', [ProductController::class, 'productsList']);
$router->get('/products/{filters}', [ProductController::class, 'productsList']);

return $router;