<?php

namespace App\Controllers;

require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/LayoutEngine.php';
use App\Core\Request;
use App\Core\LayoutEngine;

class ProductController {
    public function productsList(Request $request) {

        echo LayoutEngine::resolveLayout('products.html');

        if($request->param("category") != null){
            echo '<script>linkCategory = "'.$request->param("category").'";</script>';
        }

        return true;
    }

    public function test(Request $request) {
        echo $request->param('id');

        return true;
    }
}