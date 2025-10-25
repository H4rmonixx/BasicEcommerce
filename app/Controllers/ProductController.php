<?php

namespace App\Controllers;

require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/LayoutEngine.php';
require_once __DIR__ . '/../Models/Product.php';
use App\Core\Request;
use App\Core\LayoutEngine;
use App\Models\Product;

class ProductController {
    public function showProducts(Request $request) {

        $view = file_get_contents(__DIR__ . '/../Views/products.html');
        echo LayoutEngine::resolveLayout($view);

        return true;
    }

    public function loadProducts(Request $request){
        
        $filters = $request->json();
        if($filters == null){
            echo json_encode([]);
            return true;
        }
        $products = Product::getTilesInfoArray($filters);

        echo json_encode($products);
        
        return true;
    }

    public function loadAllCategories(Request $request){
        
        $categories = Product::getAllCategories();

        echo json_encode($categories);

        return true;
    }

    public function loadAllSizes(Request $request){
        
        $sizes = Product::getAllSizes();

        echo json_encode($sizes);

        return true;
    }
}