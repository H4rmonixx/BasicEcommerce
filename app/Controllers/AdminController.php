<?php

namespace App\Controllers;

require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/LayoutEngine.php';
use App\Core\Request;
use App\Core\LayoutEngine;

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
    
}