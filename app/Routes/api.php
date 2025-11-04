<?php

require_once __DIR__ . '/../Core/Router.php';
require_once __DIR__ . '/../Controllers/CartController.php';

use App\Core\Router;
use App\Controllers\CartController;

$router = new Router();

$router->post('/cart/size', [CartController::class, 'getSize']);
$router->post('/cart/add', [CartController::class, 'addToCart']);

return $router;