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

    public function test(Request $request) {
        echo $request->param('tekst');

        return true;
    }
}