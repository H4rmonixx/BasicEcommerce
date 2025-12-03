<?php

require_once __DIR__ . '/../Core/Router.php';
require_once __DIR__ . '/../Controllers/HomeController.php';
require_once __DIR__ . '/../Controllers/ProductController.php';
require_once __DIR__ . '/../Controllers/ArticleController.php';
require_once __DIR__ . '/../Controllers/CartController.php';
require_once __DIR__ . '/../Controllers/OrderController.php';
require_once __DIR__ . '/../Controllers/UserController.php';
require_once __DIR__ . '/../Middleware/UserAuthMiddleware.php';
require_once __DIR__ . '/../Middleware/AdminTopbarMiddleware.php';

use App\Core\Router;
use App\Controllers\HomeController;
use App\Controllers\ProductController;
use App\Controllers\ArticleController;
use App\Controllers\CartController;
use App\Controllers\OrderController;
use App\Controllers\UserController;
use App\Middleware\UserAuthMiddleware;
use App\Middleware\AdminTopbarMiddleware;

$router = new Router();

$router->get('/', [HomeController::class, 'index'], [
    AdminTopbarMiddleware::class
]);
$router->get('/about', [HomeController::class, 'about'], [
    AdminTopbarMiddleware::class
]);
$router->get('/contact', [HomeController::class, 'contact'], [
    AdminTopbarMiddleware::class
]);

$router->get('/products', [ProductController::class, 'showProducts'], [
    AdminTopbarMiddleware::class
]);
$router->get('/products/{filters}', [ProductController::class, 'showProducts'], [
    AdminTopbarMiddleware::class
]);
$router->get('/products/{filters}/{page}', [ProductController::class, 'showProducts'], [
    AdminTopbarMiddleware::class
]);

$router->get('/product/{id}', [ProductController::class, 'showProduct'], [
    AdminTopbarMiddleware::class
]);

$router->get('/articles', [ArticleController::class, 'showArticles'], [
    AdminTopbarMiddleware::class
]);
$router->get('/articles/{page}', [ArticleController::class, 'showArticles'], [
    AdminTopbarMiddleware::class
]);
$router->get('/article/{id}', [ArticleController::class, 'showArticle'], [
    AdminTopbarMiddleware::class
]);

$router->get('/cart', [CartController::class, 'showCart'], [
    AdminTopbarMiddleware::class
]);

$router->get('/summary/{orderid}', [OrderController::class, 'showSummary'], [
    AdminTopbarMiddleware::class
]);

$router->get('/login', [UserController::class, 'showLogin'], [
    AdminTopbarMiddleware::class
]);
$router->get('/login/reset', [UserController::class, 'showResetLogin'], [
    AdminTopbarMiddleware::class
]);
$router->get('/login/reset/{id}', [UserController::class, 'showResetLoginPanel'], [
    AdminTopbarMiddleware::class
]);
$router->get('/account', [UserController::class, 'showAccount'], [
    UserAuthMiddleware::class,
    AdminTopbarMiddleware::class
]);

return $router;