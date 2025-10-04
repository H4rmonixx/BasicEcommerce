<?php

require_once __DIR__ . '/../Core/Router.php';
require_once __DIR__ . '/../Controllers/ApiController.php';

use App\Core\Router;
use App\Controllers\ApiController;

$router = new Router();

$router->post('/api/load/products/latest', [ApiController::class, 'loadLatestProducts']);
$router->post('/api/load/products/all', [ApiController::class, 'loadAllProducts']);
$router->post('/api/load/cart/size', [ApiController::class, 'loadCartSize']);

return $router;