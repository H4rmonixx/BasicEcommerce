<?php

require_once __DIR__ . '/../Core/Router.php';
require_once __DIR__ . '/../Controllers/AdminController.php';
require_once __DIR__ . '/../Controllers/ProductController.php';
require_once __DIR__ . '/../Controllers/CategoryController.php';
require_once __DIR__ . '/../Controllers/VariantController.php';
require_once __DIR__ . '/../Controllers/ArticleController.php';
require_once __DIR__ . '/../Controllers/OrderController.php';
require_once __DIR__ . '/../Controllers/UserController.php';
require_once __DIR__ . '/../Controllers/ConfigurationController.php';
require_once __DIR__ . '/../Middleware/AdminAuthMiddleware.php';
require_once __DIR__ . '/../Middleware/APIAdminAuthMiddleware.php';

use App\Core\Router;
use App\Controllers\AdminController;
use App\Controllers\UserController;
use App\Controllers\CategoryController;
use App\Controllers\VariantController;
use App\Controllers\ArticleController;
use App\Controllers\OrderController;
use App\Controllers\ProductController;
use App\Controllers\ConfigurationController;
use App\Middleware\AdminAuthMiddleware;
use App\Middleware\APIAdminAuthMiddleware;

$router = new Router();

$router->get('/admin', [AdminController::class, 'index'], [
    AdminAuthMiddleware::class
]);
$router->get('/admin/orders', [AdminController::class, 'orders'], [
    AdminAuthMiddleware::class
]);
$router->get('/admin/products', [AdminController::class, 'products'], [
    AdminAuthMiddleware::class
]);
$router->get('/admin/product/{id}', [AdminController::class, 'product'], [
    AdminAuthMiddleware::class
]);
$router->get('/admin/categories', [AdminController::class, 'categories'], [
    AdminAuthMiddleware::class
]);
$router->get('/admin/variants', [AdminController::class, 'variants'], [
    AdminAuthMiddleware::class
]);
$router->get('/admin/articles', [AdminController::class, 'articles'], [
    AdminAuthMiddleware::class
]);
$router->get('/admin/article/{id}', [AdminController::class, 'article'], [
    AdminAuthMiddleware::class
]);
$router->get('/admin/users', [AdminController::class, 'users'], [
    AdminAuthMiddleware::class
]);


$router->post("/product/new", [ProductController::class, 'addProduct'], [
    APIAdminAuthMiddleware::class
]);
$router->post("/product/delete/{id}", [ProductController::class, 'deleteProduct'], [
    APIAdminAuthMiddleware::class
]);
$router->post("/product/edit/desc/{productid}", [ProductController::class, 'editDesc'], [
    APIAdminAuthMiddleware::class
]);
$router->post("/product/edit/info/{productid}", [ProductController::class, 'editInfo'], [
    APIAdminAuthMiddleware::class
]);
$router->post("/product/photo/new", [ProductController::class, 'addPhoto'], [
    APIAdminAuthMiddleware::class
]);
$router->post("/product/photo/delete/{id}", [ProductController::class, 'deletePhoto'], [
    APIAdminAuthMiddleware::class
]);
$router->post("/product/photos/reorder/{productid}", [ProductController::class, 'reorderPhoto'], [
    APIAdminAuthMiddleware::class
]);
$router->post("/product/variant/delete/{id}", [ProductController::class, 'deleteProductVariant'], [
    APIAdminAuthMiddleware::class
]);
$router->post("/product/variant/edit/{id}", [ProductController::class, 'editProductVariant'], [
    APIAdminAuthMiddleware::class
]);
$router->post("/product/variant/new", [ProductController::class, 'addProductVariant'], [
    APIAdminAuthMiddleware::class
]);
$router->post("/products/list", [ProductController::class, 'loadProductsList'], [
    APIAdminAuthMiddleware::class
]);


$router->post("/category/new", [CategoryController::class, 'addCategory'], [
    APIAdminAuthMiddleware::class
]);
$router->post("/category/edit/{id}", [CategoryController::class, 'editCategory'], [
    APIAdminAuthMiddleware::class
]);
$router->post("/category/delete/{id}", [CategoryController::class, 'deleteCategory'], [
    APIAdminAuthMiddleware::class
]);


$router->post("/variant/new", [VariantController::class, 'addVariant'], [
    APIAdminAuthMiddleware::class
]);
$router->post("/variant/edit/{id}", [VariantController::class, 'editVariant'], [
    APIAdminAuthMiddleware::class
]);
$router->post("/variant/delete/{id}", [VariantController::class, 'deleteVariant'], [
    APIAdminAuthMiddleware::class
]);


$router->post("/article/new", [ArticleController::class, 'addArticle'], [
    APIAdminAuthMiddleware::class
]);
$router->post("/article/delete/{id}", [ArticleController::class, 'deleteArticle'], [
    APIAdminAuthMiddleware::class
]);
$router->post("/article/edit/content/{articleid}", [ArticleController::class, 'editContent'], [
    APIAdminAuthMiddleware::class
]);
$router->post("/article/edit/info/{articleid}", [ArticleController::class, 'editInfo'], [
    APIAdminAuthMiddleware::class
]);
$router->post("/articles/list", [ArticleController::class, 'loadArticlesList'], [
    APIAdminAuthMiddleware::class
]);


$router->post("/users/list", [UserController::class, 'loadUsersList'], [
    APIAdminAuthMiddleware::class
]);
$router->post('/user/update/data/{userid}', [UserController::class, 'updateUserDataSuper'], [
    APIAdminAuthMiddleware::class
]);
$router->post('/user/update/password/{userid}', [UserController::class, 'updateUserPasswordSuper'], [
    APIAdminAuthMiddleware::class
]);
$router->post('/user/update/type/{userid}', [UserController::class, 'updateUserType'], [
    APIAdminAuthMiddleware::class
]);
$router->post('/user/delete/{userid}', [UserController::class, 'deleteUser'], [
    APIAdminAuthMiddleware::class
]);


$router->post("/orders/list", [OrderController::class, 'loadOrdersList'], [
    APIAdminAuthMiddleware::class
]);
$router->post("/order/edit/status/{orderid}", [OrderController::class, 'editStatus'], [
    APIAdminAuthMiddleware::class
]);


$router->post("/configuration/list", [ConfigurationController::class, 'loadConfigurationList'], [
    APIAdminAuthMiddleware::class
]);
$router->post("/configuration/update/{configid}", [ConfigurationController::class, 'updateConfigurationValue'], [
    APIAdminAuthMiddleware::class
]);
$router->post("/configuration/banner/set", [ConfigurationController::class, 'updateBanner'], [
    APIAdminAuthMiddleware::class
]);

return $router;