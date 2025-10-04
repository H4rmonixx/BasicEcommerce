<?php

namespace App\Controllers;

require_once __DIR__ . '/../Core/Request.php';
use App\Core\Request;

class ProductController {
    public function productsList(Request $request) {

        $body = file_get_contents(__DIR__ . '/../Views/productsList.html');
        $styles = <<<EOD
        <link rel="stylesheet" href="/css/style.css">
        <link rel="stylesheet" href="/css/products.css">
        EOD;
        $scripts = <<<EOD
        <script src="/js/products.js"></script>
        <script src="/js/loadProductTiles.js"></script>
        <script src="/js/loadCartSize.js"></script>
        <script src="/js/infobox.js"></script>
        EOD;

        if($request->param("category") != null){
            $scripts .= '<script>linkCategory = "'.$request->param("category").'";</script>';
        }
        
        include __DIR__ . '/../Views/layout.php';

        return true;
    }

    public function test(Request $request) {
        echo $request->param('id');

        return true;
    }
}