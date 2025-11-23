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

    public function showProduct(Request $request) {

        $view = file_get_contents(__DIR__ . '/../Views/product.html');
        echo LayoutEngine::resolveLayout($view);

        return true;
    }

    public function loadProductsFiltered(Request $request){
        
        $filters = $request->json();
        if($filters == null){
            echo json_encode([]);
            return true;
        }
        $products = Product::getFilteredProducts($filters);
        echo json_encode($products);
        
        return true;
    }

    public function loadProductsList(Request $request){
        
        $products = Product::getProductsList();
        echo json_encode($products);
        
        return true;
    }

    public function loadProduct(Request $request){
        
        $id = $request->param("id");
        if($id == null){
            echo null;
            return true;
        }

        $product = Product::getByID($id);
        echo json_encode($product);
        
        return true;
    }

    public function loadProductByVariant(Request $request){
        
        $variantid = $request->param("variantid");
        if($variantid == null){
            echo null;
            return true;
        }

        $product = Product::getByVariantID($variantid);
        echo json_encode($product);
        
        return true;
    }

    public function countPages(Request $request){

        $filters = $request->json();
        if($filters == null){
            echo null;
            return true;
        }
        $count = Product::getCount($filters);
        echo json_encode($count);

        return true;
    }

    public function addProduct(Request $request){
        $data = $request->json();
        if($data == null){
            echo null;
            return true;
        }

        $product_id = Product::createProduct($data);
        echo json_encode([true, $product_id]);
        return true;
    }
}