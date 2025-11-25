<?php

namespace App\Controllers;

require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/LayoutEngine.php';
require_once __DIR__ . '/../Models/Product.php';
use App\Core\Request;
use App\Core\LayoutEngine;
use App\Models\Product;

class AdminController {
    public function index(Request $request) {

        $view = file_get_contents(__DIR__ . '/../Views/Admin/index.html');

        echo LayoutEngine::resolveAdminLayout($view);

        return true;
    }

    public function products(Request $request) {

        $view = file_get_contents(__DIR__ . '/../Views/Admin/products.html');

        echo LayoutEngine::resolveAdminLayout($view);

        return true;
    }

    public function product(Request $request) {

        $id = $request->param("id");
        if($id == null){
            return false;
        }
        if(!Product::ifExists($id)){
            return false;
        }

        $view = file_get_contents(__DIR__ . '/../Views/Admin/product.html');

        echo LayoutEngine::resolveAdminLayout($view);

        return true;
    }

    public function categories(Request $request){

        $view = file_get_contents(__DIR__ . '/../Views/Admin/categories.html');

        echo LayoutEngine::resolveAdminLayout($view);

        return true;
    }
    
}