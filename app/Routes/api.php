<?php

require_once __DIR__ . '/../Core/Router.php';
require_once __DIR__ . '/../Controllers/CartController.php';
require_once __DIR__ . '/../Controllers/ProductController.php';
require_once __DIR__ . '/../Controllers/ArticleController.php';
require_once __DIR__ . '/../Controllers/UserController.php';
require_once __DIR__ . '/../Controllers/OrderController.php';
require_once __DIR__ . '/../Controllers/ConfigurationController.php';
require_once __DIR__ . '/../Controllers/CategoryController.php';
require_once __DIR__ . '/../Controllers/VariantController.php';

require_once __DIR__ . '/../Middleware/APIUserAuthMiddleware.php';

use App\Core\Router;
use App\Controllers\CartController;
use App\Controllers\ProductController;
use App\Controllers\ArticleController;
use App\Controllers\UserController;
use App\Controllers\OrderController;
use App\Controllers\ConfigurationController;
use App\Controllers\CategoryController;
use App\Controllers\VariantController;

use App\Middleware\APIUserAuthMiddleware;

$router = new Router();

$router->post('/products/load', [ProductController::class, 'loadProductsFiltered']);
$router->post('/product/load/{id}', [ProductController::class, 'loadProduct']);
$router->post('/product/load/variant/{variantid}', [ProductController::class, 'loadProductByVariant']);
$router->post('/products/pages', [ProductController::class, 'countPages']);

$router->post('/categories/load', [CategoryController::class, 'loadAllCategories']);
$router->post('/variants/load', [VariantController::class, 'loadAllVariants']);

$router->post('/articles/load', [ArticleController::class, 'loadArticles']);
$router->post('/article/load/{id}', [ArticleController::class, 'loadArticle']);

$router->post('/cart/size', [CartController::class, 'getSize']);
$router->post('/cart/add', [CartController::class, 'addToCart']);
$router->post('/cart/delete/{index}', [CartController::class, 'deleteFromCart']);
$router->post('/cart/change/{index}', [CartController::class, 'changeCart']);
$router->post('/cart/load', [CartController::class, 'loadCart']);

$router->post('/user/load', [UserController::class, 'loadUser']);
$router->post('/user/login', [UserController::class, 'login']);
$router->post('/user/register', [UserController::class, 'register']);
$router->post('/user/logout', [UserController::class, 'logout']);
$router->post('/user/update/data', [UserController::class, 'updateUserData'], [APIUserAuthMiddleware::class]);
$router->post('/user/update/password', [UserController::class, 'updateUserPassword'], [APIUserAuthMiddleware::class]);
$router->post('/user/orders/load', [UserController::class, 'loadUserOrders'], [APIUserAuthMiddleware::class]);

$router->post('/order/new', [OrderController::class, 'placeOrder']);
$router->post('/order/load/{id}', [OrderController::class, 'loadOrder']);

$router->post('/configuration/load/{id}', [ConfigurationController::class, 'loadProperty']);

return $router;