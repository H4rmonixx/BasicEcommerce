<?php

namespace App\Controllers;

require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/LayoutEngine.php';
use App\Core\Request;
use App\Core\LayoutEngine;

class HomeController {
    public function index(Request $request) {

        $view = file_get_contents(__DIR__ . '/../Views/index.html');

        echo LayoutEngine::resolveLayout($view);

        return true;
    }

    public function about(Request $request) {

        $view = file_get_contents(__DIR__ . '/../Views/about.html');

        echo LayoutEngine::resolveLayout($view);

        return true;
    }

    public function contact(Request $request) {

        $view = file_get_contents(__DIR__ . '/../Views/contact.html');

        echo LayoutEngine::resolveLayout($view);

        return true;
    }
    
}