<?php

namespace App\Controllers;

require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/LayoutEngine.php';
use App\Core\Request;
use App\Core\LayoutEngine;

class ProductController {
    public function productsList(Request $request) {

        $view = file_get_contents(__DIR__ . '/../Views/products.html');
        
        $js = "<script>";
        if($request->param("filters") != null){
            $js .= '<script>alert("'.$request->param("filters").')";</script>';
        }
        $js .= "</script>";

        LayoutEngine::updateView($view, "scripts", $js);
        echo LayoutEngine::resolveLayout($view);

        return true;
    }

    public function test(Request $request) {
        echo $request->param('id');

        return true;
    }
}